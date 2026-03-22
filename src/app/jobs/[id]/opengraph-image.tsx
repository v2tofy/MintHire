import { ImageResponse } from "@vercel/og";
import { getJobById } from "@/lib/jobs-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const alt = "Job Listing Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 64,
            background: "#020617",
            color: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Job Not Found
        </div>
      ),
      {
        ...size,
      }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "radial-gradient(circle at 15% 15%, #155e75 0%, #0f172a 35%, #020617 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px",
          color: "white",
          fontFamily: "Geist, Inter, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-60px",
            right: "-40px",
            width: "320px",
            height: "320px",
            borderRadius: "9999px",
            background: "rgba(45, 212, 191, 0.16)",
            filter: "blur(40px)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "24px",
            zIndex: 1,
          }}
        >
          <div
            style={{
              padding: "10px 18px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "9999px",
              fontSize: "26px",
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
              display: "flex",
              color: "#ccfbf1",
            }}
          >
            {job.company}
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#99f6e4",
              padding: "8px 14px",
              borderRadius: "9999px",
              background: "rgba(20,184,166,0.16)",
              border: "1px solid rgba(45,212,191,0.36)",
              display: "flex",
            }}
          >
            Live Job Card
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", zIndex: 1 }}>
          <div style={{ fontSize: "24px", color: "#94a3b8", display: "flex" }}>
            {job.location}
          </div>
          <h1
            style={{
              fontSize: "76px",
              fontWeight: 800,
              lineHeight: 1.05,
              margin: 0,
              padding: 0,
              color: "#f8fafc",
              maxWidth: "1000px",
              display: "flex",
            }}
          >
            {job.title}
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            gap: "24px",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              background: "rgba(15,23,42,0.52)",
              border: "1px solid rgba(148,163,184,0.25)",
              borderRadius: "24px",
              padding: "20px 24px",
              minWidth: "420px",
            }}
          >
            <span style={{ fontSize: "22px", color: "#94a3b8", display: "flex" }}>Salary</span>
            <span style={{ fontSize: "44px", fontWeight: 700, color: "#ccfbf1", display: "flex" }}>
              {job.salary}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              marginLeft: "auto",
              gap: "8px",
            }}
          >
            <span style={{ fontSize: "22px", color: "#94a3b8", display: "flex" }}>Company</span>
            <span style={{ fontSize: "32px", fontWeight: 600, color: "#f8fafc", display: "flex" }}>
              {job.company}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
