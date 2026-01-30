This is a solid technical brief. I’ve structured your requirements into a high-density prompt designed for a senior-level AI model. It uses clear hierarchy, markdown formatting, and explicit constraints to ensure the output remains focused on performance, security, and the "Flipboard" aesthetic you're after.

---

## The Optimized Prompt

Copy and paste the text below into Gemini:

# Role

You are a **Senior Product Engineer and UX Lead**. You specialize in shipping modern, performant **React + Vite** applications with secure **Node/Express** backends. You write pragmatic, production-ready TypeScript and prioritize lightweight dependencies and clean architecture.

# Task

Create a complete, runnable project called `news-reader`. The project must be a "Flipboard-style" single-article news viewer that uses a secure proxy to fetch data.

### Project Requirements

- **Frontend:** React + Vite + TypeScript + Plain CSS.
- **Backend:** Node.js (Express) proxy to **TheNewsApi** to hide API secrets.
- **UI:** A single-article focus view with category/search filters, circular pagination, and a "Favorites" system.

# Technical Specifications

### 1. API Logic (TheNewsApi)

- **Endpoint:** `https://api.thenewsapi.com/v1/news/all` (Language: `en`, Limit: `3`).
- **Filtering:** \* If `search` exists: Use `search=<query>` (ignore categories).
- If `search` is empty: Use `categories=<selected>` (Default: `tech`).

- **Proxy:** Vite must proxy `/api/*` to the Express server on port `5177`.

### 2. State & Performance

- **Pagination:** 3-item pages. Display one "Featured" card at a time.
- **Circular Pager:** `«` (first), `‹` (prev), `[1] [2] [3]` (absolute article numbers), `›` (next).
- **Prefetching:** Trigger prefetch of the next page when the user views the 2nd article (index 1). Prefetch the previous page when at index 0 (if page > 1).
- **Caching:** Store results in memory by page number to prevent redundant network hits when navigating back.

### 3. UX & Visuals

- **Layout:** Left sidebar for filters (Desktop); Toggleable top menu (Mobile).
- **Styling:** Background `#333` with gradients; high-contrast text overlays on article images.
- **Favorites:** Toggle "Save to Favorites" per card; persist in `localStorage`. Sidebar must have a "Favorites" view that replaces the live feed.
- **Error Handling:** Specific messages for `429` (Limit reached) and `401/403` (Auth failed).

### 4. Security & Constraints

- **Zero-Token Leak:** Never expose the API key in the browser. Express server handles the key via `.env`.
- **Logging:** Client logs proxied URLs only; Server never logs the raw token.
- **Dependencies:** Keep it lean (e.g., `axios` or `node-fetch`, `express`, `dotenv`, `react`, `lucide-react` for icons).

# Output Format

Output the full project using code blocks enclosed in **four backticks (````)**. Every file must include a `// filepath: ...` comment at the top.

**Include the following file structure:**

- **Root:** `package.json` (with `dev` script to run both), `.gitignore`.
- **Server:** `server/package.json`, `server/server.js`, `server/.env.example`.
- **Web:** `web/vite.config.ts`, `web/src/App.tsx`, `web/src/styles.css`, `web/src/lib/newsapi.ts`, `web/src/components/HeadlinesList.tsx`.

---

# Execution

Please generate the files now. Ensure the CSS is modern and matches the "Flipboard" aesthetic described.

---

### Pro-Tip for your Workflow

Since you're using **TheNewsApi**, remember that their free tier has a daily limit of 50 requests. Because your app fetches 3 articles per page and uses prefetching, you can burn through that quickly during development.

Would you like me to add a **Mock Data Mode** to the proxy server so you can test the UI without hitting the live API?
