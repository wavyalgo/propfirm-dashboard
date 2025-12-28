import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // 开发环境使用 '/'，生产环境使用 '/propfirm-dashboard/'
  base: mode === 'production' ? '/propfirm-dashboard/' : '/',
}))
