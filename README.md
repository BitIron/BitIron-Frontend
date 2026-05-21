# BitIron Frontend

> **The Arsenal** — Premium sports supplement e-commerce platform. Brutalist design system. Multi-Page Application built with Vite + Tailwind CSS.

---

## ✨ Key Features

- **🤖 AI Advisor** — Full-screen 8-step cinematic slideshow that collects the user's athletic profile (discipline, goal, training days, diet, supplements, meals, training time) and generates a personalized high-performance training + nutrition plan via the backend API. Results are displayed in a tabbed interface with workout, nutrition, and product recommendations.

- **🛒 Full E-commerce Flow** — Product catalog with dynamic filtering and search, persistent JWT-authenticated cart, item quantity management, promo code support (`ATHLETE20`), and atomic checkout that validates stock and creates orders in a single backend transaction.

- **🔐 JWT Authentication** — Secure login and registration with token lifecycle management. All protected pages redirect unauthenticated users. Session expiry is handled automatically with a 401 interceptor.

- **📊 Athlete Dashboard** — Personal profile display and full AI plan history, rendered with a custom parser that formats training blocks, exercise rows, meal cards and nutritional macros.

- **🌙 Dark / Light Mode** — Persistent theme toggle (stored in `localStorage`) applied instantly on page load to prevent FOUC (Flash of Unstyled Content).

- **🎨 Brutalist Design System** — Custom design language based on `#e62429` red, high-contrast typography, geometric decorations, and cinematic Motion One animations with Ken Burns effects and spring physics transitions.

- **📱 Fully Responsive** — Mobile-first layout using Tailwind CSS, adapted for all screen sizes from 320px to 4K.

---

## 🖥️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Build Tool | [Vite 5](https://vitejs.dev/) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com/) + DaisyUI |
| HTTP Client | [Axios](https://axios-http.com/) |
| Animations | [Motion One](https://motion.dev/) |
| Architecture | Multi-Page Application (MPA) — Vanilla JS modules |

---

## 📄 Pages

| File | Route | Description |
|------|-------|-------------|
| `index.html` | `/` | Home — Hero, Philosophy, Shop Catalog, AI Advisor CTA |
| `login.html` | `/login.html` | Authentication — Login & Register forms |
| `advisor.html` | `/advisor.html` | AI Advisor — 8-step cinematic plan generator |
| `checkout.html` | `/checkout.html` | Cart review & order checkout |
| `dashboard.html` | `/dashboard.html` | Athlete dashboard — profile + plan history |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- The [BitIron Backend](https://github.com/BitIron/BitIron-Backend) running locally on port `3000`

### Installation

```bash
# Clone the repository
git clone https://github.com/BitIron/BitIron-Frontend.git
cd BitIron-Frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_API_URL=http://localhost:3000/api
```

> If no `.env` is present, the frontend defaults to `http://localhost:3000/api`.

### Run in Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🗂️ Project Structure

```text
src/
├── components/         # Reusable UI components (Navbar, Footer, ShopCatalog...)
│   ├── Navbar.js
│   ├── Footer.js
│   ├── Hero.js
│   ├── ShopCatalog.js
│   ├── ProductCard.js
│   ├── ProductDetailModal.js
│   ├── AdvisorCTA.js
│   └── AIchat.js
│
├── pages/              # Page-level controllers
│   └── AIchat.js
│
├── lib/                # Core logic & API layer
│   ├── api.js          # Centralized Axios client (JWT interceptors)
│   ├── cart.js         # Cart state management & event bus
│   ├── aichat.js       # AI Advisor slideshow controller
│   ├── theme.js        # Dark/Light mode persistence
│   └── motion.js       # Animation utilities
│
├── layouts/            # HTML layout wrappers
│   └── MainLayout.js
│
├── styles/
│   └── global.css      # Tailwind directives + custom design tokens
│
├── main.js             # Home page entry point
├── auth.js             # Login/Register page entry point
├── advisor.js          # Advisor page entry point
├── checkout.js         # Checkout page entry point
└── dashboard.js        # Dashboard page entry point

public/
└── assets/             # Static images — products, advisor cards, slides
```

---

## 🔌 Backend Connection

All API calls go through `src/lib/api.js`, which uses a centralized Axios instance:

- **Base URL:** `VITE_API_URL` env variable (default: `http://localhost:3000/api`)
- **JWT Auth:** Automatically injected via request interceptor from `localStorage` key `bitiron_token`
- **Session Expiry:** A 401 response interceptor clears the token and redirects to `/login.html`

### Key API integrations

| Feature | Method | Endpoint |
|---------|--------|----------|
| Login | `POST` | `/auth/login` |
| Register | `POST` | `/auth/registro` |
| Get profile | `GET` | `/auth/perfil` |
| Get products | `GET` | `/productos?limit=100` |
| Get cart | `GET` | `/carrito` |
| Add to cart | `POST` | `/carrito` |
| Update cart item | `PUT` | `/carrito/:id` |
| Remove cart item | `DELETE` | `/carrito/:id` |
| Checkout | `POST` | `/pedidos/checkout` |
| Order history | `GET` | `/pedidos/cliente/:id` |
| Generate AI plan | `POST` | `/planes/generar` |
| Plan history | `GET` | `/planes/historial` |

---

## 🎨 Design System

The UI follows a **Brutalist** design language:

- **Primary color:** `#e62429` (BitIron Red)
- **Typography:** Black weight fonts, uppercase tracking, tight leading
- **Theme:** Full dark/light mode support persisted in `localStorage`
- **Animations:** Cinematic card transitions (Motion One), Ken Burns effects on slides
- **Responsive:** Mobile-first, fully adapted for all screen sizes

---

## 🔐 Authentication Flow

1. User logs in via `/login.html` → receives JWT token
2. Token stored in `localStorage` as `bitiron_token`
3. All subsequent requests include `Authorization: Bearer <token>` header automatically
4. On logout or token expiry (401), token is cleared and user is redirected to login
5. Protected pages (`checkout.html`, `dashboard.html`, `advisor.html`) redirect unauthenticated users to login

---

## 🌿 Gitflow

This repository follows the **Gitflow** branching strategy:

- `main` — Stable production releases
- `develop` — Integration branch for new features
- `feature/*` — New feature branches
- `fix/*` — Bug fix branches
- `docs/*` — Documentation branches

All changes are merged via **Pull Request** after peer review.
