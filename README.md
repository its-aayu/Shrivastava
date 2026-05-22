# Aayu Printing Studio — AI-Powered Print SaaS

A production-grade SaaS platform for a premium print studio. Built across a 90-day plan covering a customer-facing marketing frontend, authenticated SaaS dashboard, FastAPI backend with JWT auth and file uploads, and an AI integration layer (Phase 3). Currently at the end of Phase 2.

**Live demo:** https://shrivastava-five.vercel.app/

---

## Everything built so far

### Phase 1 — Marketing Frontend (complete)

**App shell and routing**
- React 19 + Vite 7 SPA — state-based routing in `App.jsx` (no React Router)
- `React.lazy()` + `Suspense` code-splitting on all page components
- `AnimatePresence` page transitions with `MotionConfig reducedMotion="user"`
- Skip link, `<main id="main-content">`, scroll restoration on navigation

**10 Marketing pages**
Home, About/Studio, Services, Gallery, Team, Journal/Blog, Pricing, Contact, FAQ, Product Detail

**Shared component library**
- Layout: `Navbar` (floating glassmorphism, sticky, responsive), `Footer`
- Sections: `PageHero`, `SectionHeader`, `QuoteForm`, `PromoBand`, `ReviewSection`, `ServiceCards`, `StatsStrip`, `TrustStrip`, `ImagePanel`
- UI primitives: `Button` (4 variants), `Card`, `Input`, `Reveal` (scroll-reveal), `ScrollTop`, `PageLoader`

**Animation system** — `src/animations/motion.js`
- Variants: `gridContainer`, `cardItem`, `fadeUp`, `fadeLeft`, `fadeRight`, `scaleIn`, `floatingAnimation`
- `Reveal` component wraps any element with configurable `y`, `delay`, `duration`
- Stagger grids on product/service/value cards

**CSS architecture**
- `App.css` — master import file (variables → globals → typography → utilities → animations → components → dashboard → responsive)
- `src/styles/variables.css` — full design token system (colors, glass, fonts, spacing, radii, shadows, transitions)
- Per-page `style.css` files extend the shared system

**Accessibility and performance**
- `:focus-visible` focus rings (keyboard only, not mouse)
- `@media (pointer: coarse)` — 44px minimum tap targets
- `@media (prefers-reduced-motion: reduce)` — disables all CSS transitions
- ARIA labels, `aria-current`, semantic `<nav aria-label>`, lazy image loading with fallback

---

### Mock data layer — `src/mock-data/` (complete)

Schema-first design mirroring the PostgreSQL tables. Migration from JSON → DB needs no frontend changes.

| File | Contents |
|---|---|
| `products.json` | 18 products — INR pricing, GSM, finish, delivery, features, tags, rating |
| `categories.json` | 8 product categories with slugs, icons, sort order |
| `orders.json` | 15 orders — statuses: delivered, processing, proof_review, production, cancelled |
| `users.json` | 7 customers + 1 admin with spend history |
| `faq.json` | 18 print FAQ entries with category grouping |
| `documents.json` | 35 RAG knowledge-base docs covering CMYK, DPI, bleed, GSM, finishes |
| `chat-prompts.json` | Full AI assistant config: system prompt, RAG config, fallback responses |

---

### Phase 2A — Backend foundation (complete)

**FastAPI app** — `backend/app/main.py`
- CORS middleware (reads `ALLOWED_ORIGINS` from env)
- Lifespan startup: `create_tables()` ensures all ORM models are synced
- Swagger UI at `/docs`, ReDoc at `/redoc`, health check at `/health`

**Database** — `backend/app/db/database.py`
- SQLAlchemy 2.0: `engine`, `SessionLocal`, `Base`, `get_db()` dependency, `ping_db()`
- Connected to **Neon PostgreSQL** (cloud) via `DATABASE_URL` in `backend/.env`

**6 ORM models** — `backend/app/models/`
| Model | Key fields |
|---|---|
| `Product` | id, slug, title, category, price (INR), gsm, finish, features (JSONB) |
| `User` | id, name, email, hashed_password, role (customer/admin), total_orders, preferred_products |
| `Order` | id, user_id, product_id, status, quantity, unit_price, total_price, created_at |
| `Document` | doc_id, title, category, content, tags, file_path, file_size, mime_type, uploaded_by |
| `ChatHistory` | session_id, role, message, created_at |
| `FAQ` | id, question, answer, category |

**Seeding** — `backend/seed.py`
- Loads all 5 JSON files → PostgreSQL in safe mode (skip if exists) or `--force` to overwrite
- Seeded: 18 products, 8 users, 15 orders, 35 documents, 18 FAQs

**API endpoints**
| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Service info |
| `GET` | `/health` | DB connection status |
| `GET` | `/api/v1/products` | All products (filterable: `?category=`, `?featured=true`) |
| `GET` | `/api/v1/products/featured` | Featured products |
| `GET` | `/api/v1/products/{id}` | Product by id or slug |
| `GET` | `/api/v1/orders/` | All orders |
| `GET` | `/api/v1/orders/{id}` | Single order |
| `POST` | `/api/v1/orders/` | Create order |
| `PATCH` | `/api/v1/orders/{id}/status` | Update order status |

---

### Phase 2B — JWT Authentication (complete)

**Backend** — `backend/app/api/auth.py`, `services/auth_service.py`, `utils/security.py`, `utils/auth.py`
- `POST /api/v1/auth/signup` — register new user, hash password with bcrypt, return JWT
- `POST /api/v1/auth/login` — verify credentials, return JWT
- `GET /api/v1/auth/me` — return current user profile (requires bearer token)
- `get_current_user()` FastAPI dependency — decodes JWT, fetches user from DB
- Token payload includes `sub` (user id), `email`, `role`

**Frontend** — `src/context/AuthContext.jsx`
- `AuthProvider` wraps the entire app
- On mount: reads `aayu_token` from `localStorage`, calls `/auth/me` to restore session
- If token expired or invalid: clears storage, user stays logged out
- Exports: `user`, `token`, `isAuthenticated`, `loading`, `login(token, userData)`, `logout()`
- `useAuth()` hook for any component to read auth state

**Login page** — `src/pages/Login/`
- Full-page glassmorphism card (no Navbar/Footer)
- Connects to `POST /auth/login` → stores token → redirects to Dashboard
- Error states, loading state, link to Signup

**Signup page** — `src/pages/Signup/`
- Same design system as Login
- Connects to `POST /auth/signup` → stores token + user data → redirects to Dashboard
- Client-side validation: min 8-char password

**Protected routing**
- Auth pages (`login`, `signup`, `dashboard`) skip the marketing Navbar and Footer entirely
- Dashboard checks `isAuthenticated` on mount — redirects to Login if no valid token
- Navbar shows "Sign In" when logged out, "Dashboard" when logged in (visible on all screen sizes)
- Mobile dropdown also includes the auth option

---

### Phase 2C — File Upload Pipeline (complete)

**Backend** — `backend/app/api/uploads.py`, `services/upload_service.py`
- `POST /api/v1/uploads` — multipart form upload, requires bearer token
- Accepted formats: **PDF, PNG, JPG/JPEG** only — validated by both file extension and MIME type
- Max size: **10 MB** — returns `400` with clear message if exceeded
- Blocked formats: `.exe`, `.zip`, and anything not in the allowed set returns `400`
- Files saved to `backend/app/uploads/` with UUID-prefixed safe filename to prevent collisions and path traversal
- Unauthenticated requests return `401`

**Response format:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "a3f9...safe_name.pdf",
    "original_filename": "my-artwork.pdf",
    "path": "/absolute/path/on/server",
    "size": 204800,
    "content_type": "application/pdf"
  }
}
```

**RAG ingestion stubs** — `backend/app/services/rag_service.py`
- `extract_text(file_path)` — stub for pdfplumber / pytesseract (Phase 3)
- `chunk_document(text, chunk_size=400, overlap=50)` — stub for tiktoken chunking
- `generate_embeddings(chunks)` — stub for OpenAI text-embedding-3-small
- `store_vectors(doc_id, embeddings, db)` — stub for pgvector storage
- `ingest_document(doc_id, file_path, db)` — orchestrates full pipeline (returns status dict)

---

### Phase 2D — SaaS Dashboard (complete)

**Dashboard** — `src/pages/Dashboard/`
```
Dashboard/
├── index.jsx               Main layout + tab routing + auth guard
├── style.css               Complete dashboard CSS (sidebar, cards, tables, badges, upload zone)
└── components/
    ├── Sidebar.jsx          Nav with Overview, Orders, Uploads, AI, Settings — inline SVG icons
    ├── DashboardCard.jsx    Metric card (icon + value + label + tag)
    ├── DashboardHeader.jsx  Sticky header with greeting and Sign Out
    ├── OrdersTable.jsx      API-first → mock fallback, status badges
    └── UploadsTable.jsx     Drag-and-drop upload zone + localStorage history
```

**Overview tab** — 4 metric cards: Total Orders, Pending, Files Uploaded, AI Requests (Phase 3)
- Recent orders table (last 5 rows)

**Orders tab** — full orders table
- Columns: Order ID, Product, Status, Amount, Date
- Status badges: pending (amber), processing (blue), completed/delivered (green), cancelled (red)
- Fetches from `GET /api/v1/orders/` with auth token — falls back to `mock-data/orders.json`

**Uploads tab** — file upload center
- Drag-and-drop zone or click to browse
- Calls `POST /api/v1/uploads` — requires the user to be logged in
- Upload history persisted in `localStorage` (until a GET /uploads endpoint is added in Phase 3)
- Shows: original filename, type, size, upload date

**AI Assistant tab** — Phase 3 placeholder
- Chat panel UI ready, inputs disabled
- "Phase 3" badge displayed

**Design system**
- Glassmorphism cards (`backdrop-filter: blur(14px)`, rgba white backgrounds)
- Responsive: 4-column cards → 2-column at 1100px → stacked sidebar at 768px
- Framer Motion tab transitions

**`src/lib/api.js` updates**
- Token-aware `request()` — auto-injects `Authorization: Bearer <token>` from `localStorage`
- `authApi` — login, signup, me
- `ordersApi` — getAll, getById
- `uploadsApi` — upload (multipart FormData)

---

## Running the project

### Frontend

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`. Works standalone without the backend (shows mock data on most pages, auth/upload features need the backend running).

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs at `http://localhost:8000`. Swagger UI at `http://localhost:8000/docs`.

### Environment variables

**Backend — `backend/.env`:**
```env
DATABASE_URL=postgresql://user:pass@host/db   # Neon connection string
SECRET_KEY=                                    # python -c "import secrets; print(secrets.token_hex(32))"
ALLOWED_ORIGINS=http://localhost:5173
DEBUG=true
```

**Frontend — `.env` (optional, defaults shown):**
```env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Tech stack

### Frontend
- **React 19 + Vite 7** — SPA, code splitting, HMR
- **Framer Motion** — page transitions, scroll reveals, stagger animations, reduced-motion support
- **Custom CSS** — no UI framework; full design token system with glassmorphism

### Backend
- **FastAPI 0.115** — async routes, auto OpenAPI docs, dependency injection
- **SQLAlchemy 2.0** — ORM, session management, declarative models
- **Pydantic 2.10** — request/response validation and settings management
- **python-jose + passlib[bcrypt]** — JWT creation/verification, password hashing
- **psycopg2-binary** — PostgreSQL driver
- **python-multipart** — multipart file upload support
- **uvicorn** — ASGI server

### Database
- **Neon PostgreSQL** (cloud) — connected and seeded

---

## Project structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/           products.py, orders.py, auth.py, uploads.py
│   │   ├── core/          config.py (pydantic-settings)
│   │   ├── db/            database.py (engine, session, Base)
│   │   ├── models/        product, user, order, document, chat_history, faq
│   │   ├── schemas/       product, user, order, auth, upload
│   │   ├── services/      product_service, order_service, auth_service, upload_service, rag_service
│   │   ├── uploads/       runtime file storage (gitkeep)
│   │   ├── utils/         auth.py (get_current_user dep), security.py (JWT utils)
│   │   └── main.py
│   ├── seed.py
│   └── requirements.txt
│
├── src/
│   ├── animations/        motion.js — shared Framer Motion variants
│   ├── components/
│   │   ├── layout/        Navbar (auth-aware), Footer
│   │   └── ui/            Button, Card, Input, Reveal, ScrollTop, PageLoader
│   ├── context/
│   │   └── AuthContext.jsx   AuthProvider + useAuth hook
│   ├── data/              site.js (nav, gallery, pricing, FAQ static content)
│   ├── hooks/             useProducts.js
│   ├── lib/               api.js (productsApi, authApi, ordersApi, uploadsApi)
│   ├── mock-data/         7 JSON files (products, orders, users, docs, faq, chat-prompts)
│   ├── pages/
│   │   ├── Home, About, Services, Gallery, Team, Blog, Pricing, Contact, FAQ, ProductDetail
│   │   ├── Login/         index.jsx + style.css
│   │   ├── Signup/        index.jsx
│   │   └── Dashboard/     index.jsx, style.css, components/ (Sidebar, DashboardCard, DashboardHeader, OrdersTable, UploadsTable)
│   ├── styles/            variables, globals, typography, utilities, animations, components, dashboard, responsive
│   ├── App.jsx            routing + AuthProvider wrapper
│   └── main.jsx
│
├── index.html
├── package.json
└── vite.config.js
```

---

## Roadmap

### Phase 2 (complete)
- [x] FastAPI project structure
- [x] Product, Orders API
- [x] SQLAlchemy + Neon PostgreSQL connected and seeded
- [x] JWT authentication (signup, login, me)
- [x] File upload endpoint (PDF/PNG/JPG, 10MB limit, auth-protected)
- [x] SaaS dashboard (sidebar, metric cards, orders table, upload center)
- [x] Frontend auth flow (login, signup, protected routes, session persistence)

### Phase 3 — AI integration (next)
- [ ] `GET /api/v1/uploads` — list a user's uploaded files from DB
- [ ] RAG pipeline: pdfplumber → tiktoken chunking → OpenAI embeddings → pgvector storage
- [ ] Cosine similarity search over document embeddings
- [ ] AI print consultant chatbot (streaming, `chat-prompts.json` system prompt)
- [ ] Product recommendation by use case
- [ ] Artwork file validation guidance

### Phase 4 — Dashboards and DevOps
- [ ] Admin dashboard (order management, user list, analytics)
- [ ] Role-based access control (admin vs customer views)
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Vercel (frontend) + Railway or Render (backend)

---

## Developer

Built by Ayush Shrivastava as a real-world learning path across frontend engineering, backend development, AI integration, SaaS architecture, and cloud deployment.
