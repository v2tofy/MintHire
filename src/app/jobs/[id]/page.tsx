import { notFound } from "next/navigation";
import { getJobById } from "@/lib/jobs-db";
import { JobClient } from "./JobClient";

export const dynamic = "force-dynamic";

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  return <JobClient job={job} />;
}
