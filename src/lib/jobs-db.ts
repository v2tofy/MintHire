import { Pool } from "pg";

export type Job = {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  tags: string[];
  description: string;
  applyLink: string;
};

export type NewJob = Omit<Job, "id">;

let initPromise: Promise<void> | null = null;

const connectionString =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? process.env.PRISMA_DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing database connection string. Set DATABASE_URL in environment variables.");
}

const globalForPool = globalThis as typeof globalThis & {
  jobsDbPool?: Pool;
};

const pool =
  globalForPool.jobsDbPool ??
  new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPool.jobsDbPool = pool;
}

function normalizeRow(row: Record<string, unknown>): Job {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? ""),
    company: String(row.company ?? ""),
    salary: String(row.salary ?? "Negotiable"),
    location: String(row.location ?? ""),
    tags: Array.isArray(row.tags) ? row.tags.map((tag) => String(tag)) : [],
    description: String(row.description ?? ""),
    applyLink: String(row.apply_link ?? ""),
  };
}

async function seedIfEmpty() {
  return;
}

export async function initJobsTable() {
  if (!initPromise) {
    initPromise = (async () => {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS jobs (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          company TEXT NOT NULL,
          salary TEXT NOT NULL,
          location TEXT NOT NULL,
          tags JSONB NOT NULL DEFAULT '[]'::jsonb,
          description TEXT NOT NULL,
          apply_link TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);

      await seedIfEmpty();
    })();
  }

  await initPromise;
}

export async function listJobs(): Promise<Job[]> {
  await initJobsTable();

  const { rows } = await pool.query(
    `
      SELECT id, title, company, salary, location, tags, description, apply_link
      FROM jobs
      ORDER BY CAST(id AS INTEGER) ASC
    `
  );

  return rows.map((row) => normalizeRow(row));
}

export async function getJobById(id: string): Promise<Job | null> {
  await initJobsTable();

  const { rows } = await pool.query(
    `
      SELECT id, title, company, salary, location, tags, description, apply_link
      FROM jobs
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  );

  if (!rows[0]) {
    return null;
  }

  return normalizeRow(rows[0]);
}

export async function createJob(job: NewJob): Promise<Job> {
  await initJobsTable();

  const { rows: nextRows } = await pool.query<{ next_id: number }>(
    "SELECT COALESCE(MAX(CAST(id AS INTEGER)), 100) + 1 AS next_id FROM jobs"
  );
  const nextId = String(nextRows[0]?.next_id ?? 101);

  const { rows } = await pool.query(
    `
      INSERT INTO jobs (id, title, company, salary, location, tags, description, apply_link)
      VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8)
      RETURNING id, title, company, salary, location, tags, description, apply_link
    `,
    [
      nextId,
      job.title,
      job.company,
      job.salary || "Negotiable",
      job.location,
      JSON.stringify(job.tags ?? []),
      job.description,
      job.applyLink,
    ]
  );

  return normalizeRow(rows[0]);
}

export async function updateJob(job: Job): Promise<Job | null> {
  await initJobsTable();

  const { rows } = await pool.query(
    `
      UPDATE jobs
      SET
        title = $1,
        company = $2,
        salary = $3,
        location = $4,
        tags = $5::jsonb,
        description = $6,
        apply_link = $7,
        updated_at = NOW()
      WHERE id = $8
      RETURNING id, title, company, salary, location, tags, description, apply_link
    `,
    [
      job.title,
      job.company,
      job.salary || "Negotiable",
      job.location,
      JSON.stringify(job.tags ?? []),
      job.description,
      job.applyLink,
      job.id,
    ]
  );

  if (!rows[0]) {
    return null;
  }

  return normalizeRow(rows[0]);
}

export async function deleteJobById(id: string): Promise<boolean> {
  await initJobsTable();

  const { rowCount } = await pool.query("DELETE FROM jobs WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}