"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";

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

// --- Animations exactly matching the user's 2026 aesthetics ---
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", stiffness: 220, damping: 20, staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

function BackgroundEffects() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-0 mix-blend-multiply">
        <div className="absolute -top-[40%] -left-[10%] h-[70%] w-[50%] rounded-full bg-linear-to-br from-indigo-100/60 to-purple-100/60 blur-[100px]" />
        <div className="absolute -bottom-[30%] -right-[10%] h-[60%] w-[40%] rounded-full bg-linear-to-tl from-cyan-100/60 to-blue-100/60 blur-[100px]" />
      </div>
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isEditing, setIsEditing] = useState<Job | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Default empty form
  const emptyJob: Omit<Job, "id"> = { title: "", company: "", salary: "Negotiable", location: "", tags: [], description: "", applyLink: "" };
  const [formData, setFormData] = useState<Omit<Job, "id">>(emptyJob);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "A2005exe") {
      setIsAuthenticated(true);
      fetchJobs();
    } else {
      alert("Incorrect password");
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/jobs?t=${Date.now()}`);
      if (res.ok) {
        setJobs(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    const res = await fetch(`/api/jobs?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setJobs(jobs.filter((j) => j.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = !!isEditing;
    const url = "/api/jobs";
    const method = isUpdate ? "PUT" : "POST";
    const payload = isUpdate ? { ...formData, id: isEditing.id } : formData;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setIsEditing(null);
      setIsAdding(false);
      setFormData(emptyJob);
      fetchJobs();
    }
  };

  const openEdit = (job: Job) => {
    setIsEditing(job);
    setFormData({ ...job });
    setIsAdding(false);
  };

  const openAdd = () => {
    setIsAdding(true);
    setFormData({ ...emptyJob });
    setIsEditing(null);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(",").map(t => t.trim()).filter(t => t);
    setFormData({ ...formData, tags });
  };

  if (!isAuthenticated) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f5f7] px-4 py-6 font-sans sm:px-6">
        <BackgroundEffects />
        <motion.div
          variants={containerVariants} initial="hidden" animate="visible"
          className="relative z-10 w-full max-w-88 rounded-4xl bg-white/80 p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-3xl ring-1 ring-white/50"
        >
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h1 className="text-[24px] font-medium tracking-tight text-[#1d1d1f]">Admin Access</h1>
            <p className="mt-2 text-[14px] text-[#86868b]">Enter the secure passcode.</p>
          </motion.div>
          <motion.form variants={itemVariants} onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Passcode"
              className="w-full rounded-2xl bg-black/3 px-4 py-4 text-center text-[15px] font-medium tracking-widest text-[#1d1d1f] outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-black/10"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center rounded-full bg-[#1d1d1f] px-5 py-4 text-[15px] font-medium text-white shadow-[0_12px_24px_-6px_rgba(0,0,0,0.25)] transition-all hover:scale-[1.02] hover:bg-black active:scale-95"
            >
              Unlock Dashboard
            </button>
          </motion.form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-[#f4f5f7] px-4 py-10 font-sans sm:px-6 lg:px-8">
      <BackgroundEffects />
      
      <motion.div
        variants={containerVariants} initial="hidden" animate="visible"
        className="no-scrollbar relative z-10 w-full max-w-4xl overflow-y-auto rounded-4xl bg-white/80 p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-3xl ring-1 ring-white/50 sm:p-8"
        style={{ maxHeight: "calc(100dvh - 5rem)" }}
      >
        <motion.div variants={itemVariants} className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[28px] font-medium tracking-tight text-[#1d1d1f]">Job Database</h1>
            <p className="text-[14px] text-[#86868b]">Manage all live postings.</p>
          </div>
          {!isEditing && !isAdding && (
            <button
              onClick={openAdd}
              className="flex items-center justify-center rounded-full bg-[#1d1d1f] px-5 py-3 text-[14px] font-medium text-white shadow-[0_8px_16px_-4px_rgba(0,0,0,0.2)] transition-all hover:scale-[1.02] hover:bg-black active:scale-95"
            >
              + Add New Job
            </button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {isEditing || isAdding ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSave}
              className="flex flex-col gap-4 rounded-2xl bg-black/2 p-6 ring-1 ring-black/5"
            >
              <h2 className="mb-2 text-[18px] font-medium text-[#1d1d1f]">
                {isAdding ? "Create Job Posting" : `Editing Job #${isEditing?.id}`}
              </h2>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Job Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                <Input label="Company Name" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-medium text-[#6e6e73]">Salary</label>
                    <span className="text-[11px] text-[#86868b]">Leave blank for Negotiable</span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="pointer-events-none absolute left-4 text-[14px] font-medium text-[#6e6e73]">LKR</span>
                    <input
                      type="text"
                      className="w-full rounded-xl bg-white py-3 pl-13 pr-12 text-[14px] font-medium text-[#1d1d1f] border border-black/10 outline-none focus:border-black focus:ring-2 focus:ring-black"
                      value={formData.salary === "Negotiable" ? "" : formData.salary.replace(/^LKR\s*/i, "").replace(/\/?\s*mo$/i, "").trim()}
                      onChange={e => setFormData({...formData, salary: e.target.value ? `LKR ${e.target.value}/mo` : "Negotiable"})}
                    />
                    <span className="pointer-events-none absolute right-4 text-[14px] font-medium text-[#6e6e73]">/mo</span>
                  </div>
                </div>
                <Input label="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[13px] font-medium text-[#6e6e73]">Tags (Comma separated)</label>
                  <input
                    type="text"
                    className="w-full rounded-xl bg-white px-4 py-3 text-[14px] font-medium text-[#1d1d1f] border border-black/10 outline-none focus:border-black focus:ring-2 focus:ring-black"
                    value={formData.tags.join(", ")}
                    onChange={handleTagsChange}
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[13px] font-medium text-[#6e6e73]">Description</label>
                  <textarea
                    rows={4}
                    className="w-full resize-y rounded-xl bg-white px-4 py-3 text-[14px] leading-relaxed text-[#1d1d1f] border border-black/10 outline-none focus:border-black focus:ring-2 focus:ring-black"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[13px] font-medium text-[#6e6e73]">Apply Link</label>
                  <input
                    type="text"
                    className="w-full rounded-xl bg-white px-4 py-3 text-[14px] font-medium text-[#1d1d1f] border border-black/10 outline-none focus:border-black focus:ring-2 focus:ring-black"
                    value={formData.applyLink}
                    onChange={e => setFormData({...formData, applyLink: e.target.value})}
                    onBlur={e => {
                      let val = e.target.value.trim();
                      if (!val) return;
                      
                      // Auto-format email
                      if (val.includes("@") && !val.startsWith("mailto:") && !val.startsWith("http")) {
                        val = "mailto:" + val;
                      } 
                      // Auto-format phone number (8+ digits, optional +) -> WhatsApp
                      else if (/^\+?[\d\s-]{8,}$/.test(val)) {
                        let digits = val.replace(/[^\d+]/g, "");
                        // Sri Lanka local format to international
                        if (digits.startsWith("0")) digits = "94" + digits.slice(1);
                        digits = digits.replace("+", ""); // wa.me needs clean digits
                        val = "https://wa.me/" + digits;
                      } 
                      // Auto-format missing https://
                      else if (!val.startsWith("http") && !val.startsWith("mailto:") && !val.startsWith("tel:")) {
                        val = "https://" + val;
                      }
                      
                      setFormData({...formData, applyLink: val});
                    }}
                    required
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => { setIsEditing(null); setIsAdding(false); }}
                  className="rounded-full bg-white px-6 py-3 text-[14px] font-medium text-[#1d1d1f] shadow-xs outline-none ring-1 ring-black/10 transition-colors hover:bg-[#f0f0f0]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#1d1d1f] px-6 py-3 text-[14px] font-medium text-white shadow-sm transition-all hover:bg-black active:scale-95"
                >
                  Save Job
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
              {jobs.length === 0 ? (
                <div className="flex items-center justify-center rounded-2xl border border-dashed border-black/10 py-12 text-[#86868b]">
                  No jobs found.
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-xs ring-1 ring-black/5 transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-[18px] font-medium text-[#1d1d1f]">{job.title}</h3>
                      <p className="mt-1 text-[14px] text-[#6e6e73]">{job.company} &bull; {job.location}</p>
                      <div className="mt-2 flex gap-2">
                        <span className="rounded-lg bg-[#f2f2f3] px-2 py-1 text-[11px] font-medium text-[#6e6e73]">ID: {job.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(job)}
                        className="rounded-full bg-[#f4f5f7] px-4 py-2 text-[13px] font-medium text-[#1d1d1f] transition-colors hover:bg-[#e2e2e5]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="rounded-full bg-[#fff0f0] px-4 py-2 text-[13px] font-medium text-[#e53e3e] transition-colors hover:bg-[#ffe5e5]"
                      >
                        Delete
                      </button>
                      <a
                        href={`/jobs/${job.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#1d1d1f] transition-colors hover:bg-black/10"
                        title="View Live"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}

function Input({ label, className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[13px] font-medium text-[#6e6e73]">{label}</label>
      <input
        className="w-full rounded-xl bg-white px-4 py-3 text-[14px] font-medium text-[#1d1d1f] border border-black/10 outline-none focus:border-black focus:ring-2 focus:ring-black"
        {...props}
      />
    </div>
  );
}
