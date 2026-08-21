import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Site complet static: conținutul vine din public/content.json,
// deci nu mai există niciun proxy către un API.
export default defineConfig({
  plugins: [react()],
})
