import { Metadata } from "next";
import { getJobById } from "@/lib/jobs-db";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    return {
      title: "Job Not Found",
      description: "This job listing does not exist.",
    };
  }

  return {
    title: `${job.title} at ${job.company}`,
    description: job.description,
    openGraph: {
      type: "website",
      locale: "en_IE",
      title: `${job.title} | ${job.company}`,
      description: `Salary: ${job.salary} • Location: ${job.location}`,
      siteName: "Job Viewer",
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} | ${job.company}`,
      description: `Salary: ${job.salary} • Location: ${job.location}`,
    },
  };
}

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
