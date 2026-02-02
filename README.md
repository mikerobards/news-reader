# News Reader

A generic, Flipboard-style news reading application built with React, Vite, and Express. This application aggregates news from [TheNewsApi](https://www.thenewsapi.com/) and serves it through a secure proxy backend.

## Features

- **News Aggregation**: Fetches the latest news articles from various categories (Tech, Business, Science, etc.).
- **Search Functionality**: Allows users to search for specific news topics.
- **Responsive Design**: Built with a mobile-first approach using modern CSS.
- **Secure Backend**: Express server handles API keys securely, preventing exposure to the client.
- **Serverless Ready**: Configured for seamless deployment on Vercel.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Lucide React (Icons)
- **Backend**: Node.js, Express, Axios
- **Deployment**: Vercel

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- API Key from [TheNewsApi](https://www.thenewsapi.com/)

## Installation & Local Development

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd news-reader
    ```

2.  **Install dependencies:**
    This command installs dependencies for both the root, server, and web workspaces.

    ```bash
    npm install
    cd server && npm install
    cd ../web && npm install
    cd ..
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `server/` directory:

    ```bash
    cp server/.env.example server/.env
    ```

    Add your API key to `server/.env`:

    ```env
    NEWS_API_KEY=your_api_key_here
    PORT=5177
    ```

4.  **Start the Application:**
    Run both the frontend and backend concurrently from the root directory:
    ```bash
    npm start
    ```

    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:5177`

## Deployment

### Vercel

This project is configured for Vercel.

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the project into Vercel.
3.  Vercel will detect the `vercel.json` configuration.
4.  **Important**: Add the `NEWS_API_KEY` in the Vercel Project Settings > Environment Variables.
5.  Deploy.

## Project Structure

```
news-reader/
├── package.json        # Root scripts (concurrently)
├── vercel.json         # Vercel deployment config
├── server/             # Express backend
│   ├── server.js
│   └── package.json
└── web/                # React + Vite frontend
    ├── src/
    ├── vite.config.ts
    └── package.json
```
