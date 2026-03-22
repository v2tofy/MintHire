"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Job = {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  tags: string[];
  description: string;
  applyLink: string;
};

export function JobClient({ job }: { job: Job }) {
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const quickTags = job.tags.slice(0, 3).join(" | ");

  const shareText = [
    "*New Job Opportunity*",
    `${job.title}`,
    `${job.company}`,
    "",
    `Location: ${job.location}`,
    `Salary: ${job.salary || "Negotiable"}`,
    quickTags ? `Tags: ${quickTags}` : "",
    "",
    "*Apply:*",
    currentUrl,
    "",
    "More verified job updates:",
    "https://chat.whatsapp.com/IjOQ9hb99BaLNhmil4SAIJ",
  ]
    .filter(Boolean)
    .join("\n");

  const shareParams = new URLSearchParams({ text: shareText });
  const shareLink = `https://api.whatsapp.com/send?${shareParams.toString()}`;

  const applyText = `Hello! I would like to apply for the "${job.title}" position at ${job.company}.\n\nJob link: ${currentUrl}`;
  let smartApplyLink = job.applyLink;

  if (job.applyLink.startsWith("https://wa.me/")) {
    const separator = job.applyLink.includes("?") ? "&" : "?";
    smartApplyLink = `${job.applyLink}${separator}text=${encodeURIComponent(applyText)}`;
  } else if (job.applyLink.startsWith("mailto:")) {
    const subject = `Application for ${job.title} at ${job.company}`;
    const separator = job.applyLink.includes("?") ? "&" : "?";
    smartApplyLink = `${job.applyLink}${separator}subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(applyText)}`;
  }

  const companyFirstLetter = job.company.charAt(0).toUpperCase();
  const sinhalaRegex = /[\u0D80-\u0DFF]/;
  const titleHasSinhala = sinhalaRegex.test(job.title);
  const descriptionHasSinhala = sinhalaRegex.test(job.description);

  // Framer Motion variants for staggered 2026-style reveal
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 220,
        damping: 20,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  return (
    <main className="relative flex min-h-screen items-start justify-center overflow-hidden bg-[#f4f5f7] px-4 py-6 font-sans selection:bg-black selection:text-white sm:items-center sm:px-6 sm:py-8 lg:px-8">
      {/* 2026 Premium Ambient Background with Noise blend */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 mix-blend-multiply">
          <div className="absolute -top-[40%] -left-[10%] h-[70%] w-[50%] rounded-full bg-linear-to-br from-indigo-100/60 to-purple-100/60 blur-[100px]" />
          <div className="absolute -bottom-[30%] -right-[10%] h-[60%] w-[40%] rounded-full bg-linear-to-tl from-cyan-100/60 to-blue-100/60 blur-[100px]" />
        </div>
        {/* Subtle texture grain for that luxury physical feel */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>
      </div>

      <motion.article
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="no-scrollbar relative z-10 w-full max-w-[24rem] overflow-y-auto rounded-4xl bg-white/80 p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-3xl ring-1 ring-white/50 sm:max-w-136 sm:p-8 lg:max-w-152 lg:p-10"
        style={{ maxHeight: "calc(100dvh - 3rem)" }}
      >
        <motion.div variants={itemVariants} className="mb-6 flex items-start sm:mb-8">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[#1d1d1f] text-base font-bold text-white shadow-sm ring-1 ring-black/5 sm:h-13 sm:w-13 sm:text-lg">
            {companyFirstLetter}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-3 sm:mb-4">
          <div className="mb-0.5 flex items-baseline gap-2">
            <span className="wrap-break-word text-sm font-medium tracking-tight text-[#1d1d1f] sm:text-[15px]">{job.company}</span>
          </div>
          <h1
            className={`wrap-break-word text-[22px] font-medium leading-[1.15] tracking-[-.02em] text-[#1d1d1f] sm:text-[24px] lg:text-[26px] ${titleHasSinhala ? "font-sinhala" : ""}`}
          >
            {job.title}
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-5 flex flex-wrap gap-1.5 sm:mb-6 sm:gap-2">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-black/4 px-2.5 py-1 text-[11px] font-medium text-[#1d1d1f]/70 transition-colors duration-200 hover:bg-black/8 hover:text-[#1d1d1f] sm:px-3 sm:py-1.25"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.p
          variants={itemVariants}
          className={`mb-6 whitespace-pre-line wrap-break-word text-[14px] leading-relaxed text-[#6e6e73] sm:mb-8 sm:text-[15px] ${descriptionHasSinhala ? "font-sinhala" : ""}`}
        >
          {job.description}
        </motion.p>

        <motion.div variants={itemVariants} className="mb-5 mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap items-baseline">
            {job.salary && job.salary.toLowerCase() !== "negotiable" && job.salary.includes('/') ? (
              <>
                <span className="text-[20px] font-medium tracking-[-.02em] text-[#1d1d1f] sm:text-[22px]">
                  {job.salary.split('/')[0]}
                </span>
                <span className="ml-0.5 whitespace-nowrap text-[12px] font-medium text-[#86868b] sm:text-[13px]">
                  /{job.salary.split('/')[1]}
                </span>
              </>
            ) : (
              <span className="text-[20px] font-medium tracking-[-.02em] text-[#1d1d1f] sm:text-[22px]">
                {job.salary || "Negotiable"}
              </span>
            )}
          </div>
          <div className="text-[13px] font-medium text-[#6e6e73] sm:pb-1 sm:text-right">
            {job.location}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.hr variants={itemVariants} className="mb-6 border-t border-black/6 sm:mb-8" />

        <motion.div variants={itemVariants} className="space-y-4">
          <a
            href={smartApplyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex w-full justify-center outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f5f7] rounded-full"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <div className="relative flex w-full items-center justify-center overflow-hidden rounded-full bg-[#1d1d1f] px-5 py-4 ring-1 ring-black/10 shadow-[0_12px_24px_-6px_rgba(0,0,0,0.25),inset_0_-4px_6px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.15)] transition-all duration-300 group-hover:bg-black group-hover:scale-[1.01] group-hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.3),inset_0_-4px_6px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.2)] group-active:scale-95 sm:px-6 sm:py-4.5">
              <div className="pointer-events-none absolute inset-x-4 top-px h-[35%] rounded-t-full bg-linear-to-b from-white/20 to-transparent blur-[0.5px]" />
              <span className="relative z-10 text-[15px] font-medium tracking-wide text-white antialiased sm:text-[16px]">
                Apply now
              </span>
            </div>
          </a>

          <a
            href={shareLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 rounded-full py-1 text-center text-[13px] font-medium text-[#86868b] outline-none transition-colors duration-200 hover:text-[#1d1d1f] focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Share on WhatsApp
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>

        {/* Minimal Card Footer */}
        <motion.div variants={itemVariants} className="mt-6 sm:mt-8 flex items-center justify-center border-t border-black/6 pt-5">
          <p className="text-[12px] font-medium tracking-tight text-[#86868b]">
            Powered by <span className="font-semibold text-[#1d1d1f]">MintHire</span>
          </p>
        </motion.div>
      </motion.article>
    </main>
  );
}
