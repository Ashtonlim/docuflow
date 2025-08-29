import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [react(), tailwindcss()],
    // set base path. usually root but if deploy to gh pages, use repo name
    base: `${env.VITE_BASE_PATH}`,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // Alias '@' to the 'src' directory
        '~': path.resolve(__dirname, './'), // Alias '~' to the project root
      },
    },
  }
})
