import { defineConfig } from 'vite'
import veauryVitePlugins from 'veaury/vite/index.js'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      // vue()
      veauryVitePlugins({
        type:'vue'
      })
  ],
  proxy: {
    '/api': {
      // target: 'http://192.163.1.3:8221',
      target: 'http://localhost:8221',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
})
