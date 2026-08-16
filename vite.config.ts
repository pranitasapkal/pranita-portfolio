import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // No manualChunks: the only entry here was the `three` split, removed with the
  // WebGL hero (ADR-004). Route-level lazy() now does all the code splitting.
})
