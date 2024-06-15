import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server : {
    watch: {
      usePolling: true
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js', 
  }
})

/*
when use node user in image building, got vite "504 (Outdated Optimize Dep)"
when use root everything is fine, 
  some error show node user has no permission in something vite want, so it runOptimizeDeps
  Error: EACCES: permission denied, mkdir '/usr/src/app/node_modules/.vite/deps_temp_0ae19d58'
  these options will not solve direct to the problem but maybe interesting
  or "vite --force"
  optimizeDeps: {
    exclude: [
      "@apollo/client", 
      "graphql-ws",
      "react-dom", 
      "react", 
      "react-router-dom"]
  } 
*/