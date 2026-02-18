import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_BASE_API } = env
  return {
    plugins: [
      vue(),
      UnoCSS(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    server: {
      port: 80,
      host: true,
      open: true,
      proxy: {
        '/swagger-api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/swagger-api/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              delete proxyRes.headers['x-frame-options'];
              delete proxyRes.headers['content-security-policy'];
            });
          }
        },
        '/druid': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/druid/, '/druid'),
          configure: (proxy, options) => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              delete proxyRes.headers['x-frame-options'];
              delete proxyRes.headers['content-security-policy'];
            });
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
})
