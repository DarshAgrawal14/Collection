import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  host: true,
  allowedHosts: ['0428-183-83-172-184.ngrok-free.app']
}
})

