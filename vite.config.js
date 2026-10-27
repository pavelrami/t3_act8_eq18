import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ruta publica solicitada por la Actividad 8 del equipo 18.
// Tambien se utiliza al generar el build de produccion.
export default defineConfig({
  plugins: [react()],
  base: '/t3_act8_eq18/',
})
