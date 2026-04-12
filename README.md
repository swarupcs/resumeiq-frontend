# ResumeIQ - AI Resume Builder Frontend

The frontend user interface for **ResumeIQ**, a modern AI-powered resume and cover letter builder. Built with React and TypeScript, it features a visually stunning dynamic interface, live real-time resume previews, and integrated AI suggestions to help craft ATS-optimized resumes.

## 🌟 Key Features

- **Live Resume Builder Engine**
  - Real-time WYSIWYG side-by-side preview with responsive UI editing.
  - Multi-theme aesthetic control and real-time layout adjustments.
- **Smart Artificial Intelligence**
  - Instant AI-generated Cover Letters tailored specifically to copy-pasted Job Descriptions.
  - Granular AI enhancement suggestions mapped to user inputs.
- **Rich User Interface**
  - Built meticulously with shadcn/ui and Radix.
  - TailwindCSS v4 configurations with customized `.bg-mesh` and dynamic glassmorphism aesthetics.
  - Fully responsive, mobile-optimized flows.
- **Robust State Management**
  - Redux Toolkit mapped locally with Redux Persist for reliable user sessions.
  - TanStack React Query (v5) abstracting and managing optimal asynchronous server requests and caches.
- **Client-Side Export capabilities**
  - Interactive PDF parsing and downloading via highly optimized export triggers.

## 💻 Tech Stack

- **Framework:** React v19 + Vite
- **Programming Language:** TypeScript
- **Styling:** Tailwind CSS v4, Framer Motion, tw-animate-css
- **UI Components:** Shadcn UI, Radix UI, Base UI, Lucide Icons
- **State Management:** Redux Toolkit, Redux Persist
- **Data Fetching:** TanStack React Query (v5), Axios
- **Routing:** React Router v7

## 📁 Project Structure

```text
src/
├── api/              # Axios instances & API request handlers
├── app/              # Global app store and Redux configurations
├── assets/           # Static assets, fonts, and images
├── components/       # Reusable React components (shadcn ui, builder layout)
├── config/           # Base configurations and constants
├── context/          # React Context providers (Providers wrapper)
├── features/         # Redux state slices (e.g. authSlice, templateSlice)
├── hooks/            # Custom React hooks combining React Query logic
├── lib/              # Utility libraries and shadcn utils (e.g. utils.ts)
├── pages/            # Application view pages and route handlers
├── routes/           # React Router route declarative setups
├── services/         # Layer separating external API logic
└── types/            # Global TypeScript types & interface declarations
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18+ recommended)
- The [ResumeIQ Backend](https://github.com/your-username/ai-resume-builder-backend) running locally (default: port 8080)

### Installation

1. **Clone the repository and install dependencies:**

   Using `npm`, `yarn`, or `pnpm` (which this project's lockfile natively assumes):

   ```bash
   pnpm install
   ```
   *(Or `npm install` if preferred)*

2. **Configure Environment Variables:**

   Create a `.env` file at the root of the project:

   ```bash
   # .env
   VITE_BACKEND_URL=http://localhost:8080/api
   ```

3. **Run the Development Server:**

   ```bash
   npm run dev
   ```

   The Vite server will start, typically accessible at `http://localhost:5173/`.

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Compiles TypeScript and builds the application for production using Vite.
- `npm run lint`: Runs ESLint to verify code logic and formatting.
- `npm run preview`: Locally previews the production build compiled in the `dist` directory.

## 🛡 Design Philosophy & Architecture

- **Predictable State Iteration:** Employs Redux for long-living user sessions and TanStack Query strictly for transient server state, preventing caching clashes.
- **Lazy Loading Components:** Code-splitting handles independent bundles logic locally (e.g., Auth Flow routes) natively configured via `React.lazy` on declarative routes to maintain rapid Initial Time-To-Interactive bounds.
- **Design Tokens:** Strict `hsl` standard tokenized root CSS variables in `index.css` mapped to Tailwind CSS seamlessly.
