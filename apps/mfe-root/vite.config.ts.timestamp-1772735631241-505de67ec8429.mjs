// vite.config.ts
import react from "file:///home/goliraworkspace/pocs/aplicacao/frontend/.yarn/__virtual__/@vitejs-plugin-react-virtual-856fda0a6b/4/.yarn/berry/cache/@vitejs-plugin-react-npm-4.7.0-650e714693-10c0.zip/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import { defineConfig } from "file:///home/goliraworkspace/pocs/aplicacao/frontend/.yarn/__virtual__/vite-virtual-0c906da34b/4/.yarn/berry/cache/vite-npm-5.4.21-12a8265f9b-10c0.zip/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/home/goliraworkspace/pocs/aplicacao/frontend/apps/mfe-root";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    // Habilitar CORS para permitir carregamento de MFEs
    cors: true
  },
  build: {
    // Root não é uma biblioteca, é uma aplicação
    // Não deve ter configuração lib
    outDir: "dist",
    sourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9nb2xpcmF3b3Jrc3BhY2UvcG9jcy9hcGxpY2FjYW8vZnJvbnRlbmQvYXBwcy9tZmUtcm9vdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZ29saXJhd29ya3NwYWNlL3BvY3MvYXBsaWNhY2FvL2Zyb250ZW5kL2FwcHMvbWZlLXJvb3Qvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvZ29saXJhd29ya3NwYWNlL3BvY3MvYXBsaWNhY2FvL2Zyb250ZW5kL2FwcHMvbWZlLXJvb3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MyxcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgIC8vIEhhYmlsaXRhciBDT1JTIHBhcmEgcGVybWl0aXIgY2FycmVnYW1lbnRvIGRlIE1GRXNcbiAgICBjb3JzOiB0cnVlLFxuICB9LFxuICBidWlsZDoge1xuICAgIC8vIFJvb3Qgblx1MDBFM28gXHUwMEU5IHVtYSBiaWJsaW90ZWNhLCBcdTAwRTkgdW1hIGFwbGljYVx1MDBFN1x1MDBFM29cbiAgICAvLyBOXHUwMEUzbyBkZXZlIHRlciBjb25maWd1cmFcdTAwRTdcdTAwRTNvIGxpYlxuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtVyxPQUFPLFdBQVc7QUFDclgsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBRjdCLElBQU0sbUNBQW1DO0FBSXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUE7QUFBQSxJQUVaLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQTtBQUFBLElBR0wsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLEVBQ2I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
