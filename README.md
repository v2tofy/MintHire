# NexJob

Modern, minimal job board built with Next.js 15, React 19, Tailwind CSS v4, and PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-336791?logo=postgresql&logoColor=white)

## ✨ Highlights

- Professional, modern UI for job listings
- Admin dashboard for job CRUD operations
- PostgreSQL-backed API (no local JSON persistence)
- Dynamic job pages + Open Graph image generation
- Share/apply flow optimized for WhatsApp and email
- Vercel-ready deployment

## 🧱 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19, Tailwind CSS v4, Framer Motion
- **Language:** TypeScript
- **Database:** PostgreSQL (`pg`)
- **Deployment:** Vercel

## 📁 Project Structure

```txt
src/
  app/
    admin/
    api/jobs/
    jobs/[id]/
  lib/
    jobs-db.ts
```

## 🚀 Local Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env.local` file in project root:

```env
DATABASE_URL="your_postgres_connection_string"
POSTGRES_URL="your_postgres_connection_string"
PRISMA_DATABASE_URL="your_postgres_connection_string"
```

> `DATABASE_URL` is required. The others are optional fallbacks.

### 3) Run development server

```bash
npm run dev
```

Open: `http://localhost:3000`

## 🔐 Admin Access

Go to `/admin` and sign in with the configured passcode in code.

> Security note: move admin auth to a secure server-side auth flow before public production use.

## 🧪 Scripts

```bash
npm run dev        # Start dev server
npm run dev:clean  # Clear .next cache and start dev server
npm run lint       # Run ESLint
npm run build      # Production build
npm run start      # Start production server
```

## 📡 API

### `GET /api/jobs`
Returns all jobs.

### `POST /api/jobs`
Creates a new job.

### `PUT /api/jobs`
Updates an existing job by `id`.

### `DELETE /api/jobs?id=JOB_ID`
Deletes a job.

## ☁️ Deploy to Vercel (GitHub Import)

1. Push this repository to GitHub.
2. In Vercel: **New Project → Import Git Repository**.
3. Add environment variables in Vercel Project Settings:
   - `DATABASE_URL`
   - `POSTGRES_URL`
   - `PRISMA_DATABASE_URL`
4. Deploy.

## ✅ Production Checklist

- [ ] Environment variables added in Vercel
- [ ] Database connection tested (`/api/jobs`)
- [ ] Admin route secured for production
- [ ] Secrets rotated if previously shared

## 📄 License

Private project. Update this section if you plan to open-source it.
