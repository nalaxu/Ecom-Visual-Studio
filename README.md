# Ecom Visual Studio (电商商品图工坊)

This is a [Next.js](https://nextjs.org) project designed as a web application for cross-border e-commerce product image generation and management.

## Current Progress

- **Step 1: Project Initialization** - ✅ Completed
  - Initialized Next.js with TypeScript, Tailwind CSS, ESLint, App Router, and React Compiler.
  - Added tooling: Prettier, `next-themes`, `zod`, `lucide-react`.
  - Configured project environment (`.prettierrc`, `.eslintrc.json`, `.gitignore`, `.env.local`).
- **Step 2: Prisma + Database Schema** - ✅ Completed
  - Setup Prisma with SQLite locally.
  - Implemented the database schema representing product requirements (`Task`, `TaskImage`, `CopyResult`, `ModelConfig`, `PromptTemplate`).
  - Added the dev-safe Prisma client singleton (`src/lib/db.ts`).
  - Synced database tables (`pnpm db:push`).
  - Created initial database seeding script (`prisma/seed.ts`).

---

## Full Implementation Plan

Based on the original structural design, here is the execution plan:

### Step 1: Project Initialization (Completed)
- Initialize Next.js in the existing directory and add tooling.
- Add prettier, eslint-config-prettier, tsx, next-themes, zod, lucide-react.
- Create project config files and verify development server starts.

### Step 2: Prisma + Database Schema (Completed)
- Add prisma and @prisma/client, initialize with `sqlite`.
- Create `prisma/schema.prisma` mapping out tasks, images, generated copies, and system settings.
- Create `src/lib/db.ts` to prevent hot-reload connection leaks.
- Create `prisma/seed.ts` and set up standard database npm scripts.

### Step 3: Type Definitions
- Create `src/types/` with strict domain types (TypeScript) shared across client and server:
  - `platform.ts`, `model.ts`, `template.ts`, `storage.ts`, `task.ts`

### Step 4: Configuration + Utilities
- Create `src/lib/config.ts` for typed app configuration driven by `process.env`.
- Create `src/lib/utils.ts` for standard shadcn/tailwind merging and formatting.

### Step 5: Storage Abstraction
- Create `src/lib/storage/` establishing the `IStorageProvider` interface.
- Implement `local.ts` for immediate file system uploads and provide a stubbed `s3.ts`.

### Step 6: shadcn/ui + UI Shell
- Initialize `shadcn/ui` and add basic UI components (button, card, input, sidebar, dialog, etc.).
- Build nested dashboard layouts (`src/app/(dashboard)/layout.tsx`) utilizing a sidebar and header.
- Flesh out standard scaffolding pages for the application route structure.

### Step 7: Three-Layer Architecture Foundation
- **Layer 1:** Model Adapter Layer (`src/lib/models`) to interface with OpenAI, Anthropic, Gemini.
- **Layer 2:** Capability Abstraction Layer (`src/lib/capabilities`) for generic text-to-image and multimodal tasks.
- **Layer 3:** Business Orchestration Layer (`src/lib/orchestration`) defining the sequence pipeline.

### Step 8: API Route Handlers
- Set up scalable Next.js App Router API endpoints supporting Prisma validation.
- Routes: Healthchecks, task dispatching, model configs, templates, and storage uploading.

### Step 9: Seed Data + Final Polish
- Complete full default database insertions via `prisma/seed.ts` for standard item templates (Rugs, Desk mats).
- Finalize UI mapping and update primary documentation.

---

## Getting Started

First, ensure dependencies are installed via pnpm:

```bash
pnpm install
```

Generate the Prisma client:

```bash
pnpm prisma generate
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.