// filepath: /Users/michaelrobards/Documents/Projects/ztm/vibe-coding/news-reader/web/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5177'
    }
  }
})
