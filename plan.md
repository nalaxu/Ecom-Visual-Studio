 Step 1: Project Initialization                                                                                 │
│                                                                                                                │
│ Initialize Next.js in the existing directory and add tooling.                                                  │
│                                                                                                                │
│ npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm  │
│ pnpm add -D prettier eslint-config-prettier tsx                                                                │
│ pnpm add next-themes zod lucide-react                                                                          │
│                                                                                                                │
│ Create/update:                                                                                                 │
│ - .prettierrc — { "semi": true, "singleQuote": true, "tabWidth": 2, "trailingComma": "es5" }                   │
│ - .eslintrc.json — extend prettier                                                                             │
│ - .gitignore — add .env.local, uploads/, prisma/dev.db, prisma/dev.db-journal                                  │
│ - .env.example and .env.local — DATABASE_URL, STORAGE_PROVIDER, LOCAL_STORAGE_PATH, S3 vars, app name/URL      │
│                                                                                                                │
│ Verify: pnpm dev starts, default page loads at localhost:3000                                                  │
│                                                                                                                │
│ ---                                                                                                            │
│ Step 2: Prisma + Database Schema                                                                               │
│                                                                                                                │
│ pnpm add prisma @prisma/client                                                                                 │
│ pnpm prisma init --datasource-provider sqlite                                                                  │
│                                                                                                                │
│ Create prisma/schema.prisma with these models:                                                                 │
│ - Task — id, name, category, platform, outputType, status (pending/processing/completed/failed), templateId,   │
│ modelConfigId, metadata (JSON string), errorMessage, timestamps, soft-delete (deletedAt)                       │
│ - TaskImage — id, taskId, role (input/preprocessed/output), imageType, storagePath, fileName, mimeType,        │
│ fileSize, dimensions, quality fields (score/status/detail), sortOrder                                          │
│ - CopyResult — id, taskId, platform, title, bulletPoints, description, keywords, language                      │
│ - ModelConfig — id, name, provider, baseUrl, apiKey, modelName, capabilities (JSON string), timeout,           │
│ maxRetries, isEnabled                                                                                          │
│ - PromptTemplate — id, name, category, outputType, platform, promptText, variables (JSON string), isBuiltin,   │
│ isFavorite                                                                                                     │
│                                                                                                                │
│ SQLite constraints: no enums (use string columns), no native JSON type (store as string, parse in app).        │
│                                                                                                                │
│ Create src/lib/db.ts — Prisma client singleton (prevents hot-reload duplication in dev).                       │
│                                                                                                                │
│ Create prisma/seed.ts — built-in prompt templates for rug/desk_mat categories, placeholder model config.       │
│                                                                                                                │
│ Add scripts to package.json:                                                                                   │
│ "db:push": "prisma db push"                                                                                    │
│ "db:studio": "prisma studio"                                                                                   │
│ "db:seed": "prisma db seed"                                                                                    │
│ "db:reset": "prisma db push --force-reset && prisma db seed"                                                   │
│ "typecheck": "tsc --noEmit"                                                                                    │
│ "format": "prettier --write ."                                                                                 │
│                                                                                                                │
│ Verify: pnpm prisma db push creates tables, pnpm db:studio shows all 5 tables                                  │
│                                                                                                                │
│ ---                                                                                                            │
│ Step 3: Type Definitions                                                                                       │
│                                                                                                                │
│ Create src/types/ with domain types shared across client and server:                                           │
│                                                                                                                │
│ - platform.ts — Platform, OutputType, TaskStatus, ImageRole, ImageType, QualityStatus type aliases             │
│ - model.ts — ModelProviderType, CapabilityType, ModelConfigDTO                                                 │
│ - template.ts — PromptTemplateDTO, TemplateVariable                                                            │
│ - storage.ts — StorageFile, UploadResult                                                                       │
│ - task.ts — TaskDTO, TaskImageDTO, CopyResultDTO                                                               │
│                                                                                                                │
│ Verify: pnpm typecheck passes                                                                                  │
│                                                                                                                │
│ ---                                                                                                            │
│ Step 4: Configuration + Utilities                                                                              │
│                                                                                                                │
│ - src/lib/config.ts — typed config object reading from process.env with defaults for db, storage, and app      │
│ settings                                                                                                       │
│ - src/lib/utils.ts — cn() utility (clsx + tailwind-merge for shadcn/ui), formatDate helper                     │
│                                                                                                                │
│ ---                                                                                                            │
│ Step 5: Storage Abstraction                                                                                    │
│                                                                                                                │
│ Create src/lib/storage/:                                                                                       │
│ - types.ts — IStorageProvider interface with upload(), getUrl(), delete(), exists()                            │
│ - local.ts — LocalStorageProvider using fs + path, stores to uploads/{directory}/{timestamp}-{fileName}        │
│ - s3.ts — stub S3StorageProvider that throws "S3 not configured" (correct interface shape, filled in later)    │
│ - index.ts — factory getStorageProvider() reads appConfig.storage.provider and returns the right instance      │
│                                                                                                                │
│ Create uploads/.gitkeep.                                                                                       │
│                                                                                                                │
│ Verify: Import and call getStorageProvider().upload(...) with a test buffer in a route handler                 │
│                                                                                                                │
│ ---                                                                                                            │
│ Step 6: shadcn/ui + UI Shell                                                                                   │
│                                                                                                                │
│ pnpm dlx shadcn@latest init                                                                                    │
│ pnpm dlx shadcn@latest add button card input select sidebar skeleton toast dialog dropdown-menu separator      │
│ badge tooltip                                                                                                  │
│                                                                                                                │
│ Create layout components:                                                                                      │
│ - src/app/layout.tsx — root layout with ThemeProvider, Toaster, metadata                                       │
│ - src/app/globals.css — Tailwind directives + shadcn CSS variables                                             │
│ - src/components/layout/app-sidebar.tsx — sidebar nav with links: Home (/), New Task (/tasks/new), History     │
│ (/history), Settings (/settings)                                                                               │
│ - src/components/layout/header.tsx — top bar with page title + theme toggle                                    │
│ - src/components/layout/theme-toggle.tsx — light/dark mode toggle                                              │
│ - src/app/(dashboard)/layout.tsx — dashboard shell composing sidebar + header + content area                   │
│                                                                                                                │
│ Create placeholder pages (each renders title + description):                                                   │
│ - src/app/(dashboard)/page.tsx — Home / Workbench                                                              │
│ - src/app/(dashboard)/tasks/new/page.tsx — New Task                                                            │
│ - src/app/(dashboard)/tasks/[id]/page.tsx — Task Results                                                       │
│ - src/app/(dashboard)/history/page.tsx — History                                                               │
│ - src/app/(dashboard)/settings/page.tsx — Settings                                                             │
│                                                                                                                │
│ The (dashboard) route group keeps URLs clean (no /dashboard prefix) while sharing the sidebar layout.          │
│                                                                                                                │
│ Verify: All 5 pages navigable with working sidebar, theme toggle works                                         │
│                                                                                                                │
│ ---                                                                                                            │
│ Step 7: Three-Layer Architecture Foundation                                                                    │
│                                                                                                                │
│ Layer 1 — Model Adapter Layer (src/lib/models/)                                                                │
│                                                                                                                │
│ - types.ts — IModelAdapter, AdapterConfig, ModelRequest, ModelResponse, ModelMessage, ModelContentPart         │
│ - adapters/base.ts — abstract BaseModelAdapter with shared timeout/retry/error handling, abstract _invokeRaw() │
│ - adapters/openai.ts — stub extending base, correct fetch structure for /v1/chat/completions                   │
│ - adapters/anthropic.ts — stub extending base                                                                  │
│ - adapters/gemini.ts — stub extending base                                                                     │
│ - index.ts — ModelAdapterRegistry with register() and getAdapter(), pre-registers 3 providers                  │
│                                                                                                                │
│ Layer 2 — Capability Abstraction Layer (src/lib/capabilities/)                                                 │
│                                                                                                                │
│ - types.ts — ITextToImageCapability, IImageToImageCapability, IMultimodalRecognitionCapability,                │
│ ICopyGenerationCapability + supporting types                                                                   │
│ - index.ts — placeholder CapabilityService                                                                     │
│                                                                                                                │
│ Layer 3 — Business Orchestration Layer (src/lib/orchestration/)                                                │
│                                                                                                                │
│ - types.ts — PipelineStep, TaskPipeline, ITaskOrchestrator                                                     │
│ - index.ts — placeholder TaskOrchestrator with canonical pipeline: preprocess → generate → quality_check →     │
│ copy_generation                                                                                                │
│                                                                                                                │
│ Verify: pnpm typecheck passes, adapter registry importable                                                     │
│                                                                                                                │
│ ---                                                                                                            │
│ Step 8: API Route Handlers                                                                                     │
│                                                                                                                │
│ Create working skeleton routes (Prisma CRUD, proper status codes, zod validation):                             │
│                                                                                                                │
│ ┌────────────────────────────────┬──────────────────┬─────────────────────────────────────────────────┐        │
│ │             Route              │     Methods      │                     Purpose                     │        │
│ ├────────────────────────────────┼──────────────────┼─────────────────────────────────────────────────┤        │
│ │ api/health/route.ts            │ GET              │ { status: "ok", timestamp }, tests DB + storage │        │
│ ├────────────────────────────────┼──────────────────┼─────────────────────────────────────────────────┤        │
│ │ api/tasks/route.ts             │ GET, POST        │ List tasks (pagination, filters), create task   │        │
│ ├────────────────────────────────┼──────────────────┼─────────────────────────────────────────────────┤        │
│ │ api/tasks/[id]/route.ts        │ GET, PUT, DELETE │ Get/update/soft-delete single task              │        │
│ ├────────────────────────────────┼──────────────────┼─────────────────────────────────────────────────┤        │
│ │ api/tasks/[id]/images/route.ts │ GET              │ List images for a task                          │        │
│ ├────────────────────────────────┼──────────────────┼─────────────────────────────────────────────────┤        │
│ │ api/models/route.ts            │ GET, POST        │ List/create model configurations                │        │
│ ├────────────────────────────────┼──────────────────┼─────────────────────────────────────────────────┤        │
│ │ api/templates/route.ts         │ GET, POST        │ List/create prompt templates                    │        │
│ ├────────────────────────────────┼──────────────────┼─────────────────────────────────────────────────┤        │
│ │ api/storage/upload/route.ts    │ POST             │ Multipart file upload via storage provider      │        │
│ └────────────────────────────────┴──────────────────┴─────────────────────────────────────────────────┘        │
│                                                                                                                │
│ Verify: curl localhost:3000/api/health returns ok, POST/GET /api/tasks works                                   │
│                                                                                                                │
│ ---                                                                                                            │
│ Step 9: Seed Data + Final Polish                                                                               │
│                                                                                                                │
│ Flesh out prisma/seed.ts:                                                                                      │
│ - 3–5 built-in prompt templates for "rug" category (white_bg, dimension, scene variants)                       │
│ - 1–2 templates for "desk_mat" category                                                                        │
│ - 1 placeholder model config entry (disabled)                                                                  │
│                                                                                                                │
│ Update CLAUDE.md with actual build commands, architecture, and project structure.                              │
│                                                                                                                │
│ ---                                                                                                            │
│ Final Verification Checklist                                                                                   │
│                                                                                                                │
│ 1. pnpm install — no errors                                                                                    │
│ 2. pnpm typecheck — zero TS errors                                                                             │
│ 3. pnpm lint — zero ESLint errors                                                                              │
│ 4. pnpm build — production build succeeds                                                                      │
│ 5. pnpm dev — dev server starts on :3000                                                                       │
│ 6. All 5 pages render with sidebar navigation                                                                  │
│ 7. Theme toggle works (light/dark)                                                                             │
│ 8. curl localhost:3000/api/health — returns { status: "ok" }                                                   │
│ 9. pnpm db:studio — shows all 5 tables                                                                         │
│ 10. pnpm db:seed — populates templates                                                                         │
│ 11. POST /api/tasks + GET /api/tasks — CRUD works                                                              │
│ 12. POST /api/storage/upload — file appears in uploads/                                                        │
│                                                                                                                │
│ ---                                                                                                            │
│ Key Files                                                                                                      │
│                                                                                                                │
│ ┌────────────────────────────────┬────────────────────────────────────────────────────┐                        │
│ │              File              │                        Role                        │                        │
│ ├────────────────────────────────┼────────────────────────────────────────────────────┤                        │
│ │ prisma/schema.prisma           │ All data persistence — must be created first       │                        │
│ ├────────────────────────────────┼────────────────────────────────────────────────────┤                        │
│ │ src/lib/db.ts                  │ Prisma singleton used by every API route           │                        │
│ ├────────────────────────────────┼────────────────────────────────────────────────────┤                        │
│ │ src/lib/models/types.ts        │ IModelAdapter interface the 3-layer arch builds on │                        │
│ ├────────────────────────────────┼────────────────────────────────────────────────────┤                        │
│ │ src/lib/storage/types.ts       │ IStorageProvider interface for all image I/O       │                        │
│ ├────────────────────────────────┼────────────────────────────────────────────────────┤                        │
│ │ src/app/(dashboard)/layout.tsx │ Dashboard shell shared by all 5 pages              │                        │
│ ├────────────────────────────────┼────────────────────────────────────────────────────┤                        │
│ │ src/lib/config.ts              │ Single source of truth for config                  │   