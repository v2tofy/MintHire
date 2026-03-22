import { NextResponse } from "next/server";
import { createJob, deleteJobById, listJobs, updateJob } from "@/lib/jobs-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const jobs = await listJobs();
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const job = await request.json();
  const created = await createJob(job);
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(request: Request) {
  const updatedJob = await request.json();

  const saved = await updateJob(updatedJob);
  if (saved) {
    return NextResponse.json(saved);
  }

  return NextResponse.json({ error: "Job not found" }, { status: 404 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  
  if (!id) {
    return NextResponse.json({ error: "Job ID required" }, { status: 400 });
  }

  await deleteJobById(id);

  return NextResponse.json({ success: true });
}
