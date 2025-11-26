/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Busca clases en todos los archivos HTML y TS dentro de src
  ],
  theme: {
    extend: {
      // Aquí puedes extender el tema con tus propios colores si quieres
      colors: {
        predictify: {
          dark: '#050505',
          primary: '#a855f7', // Un morado similar al de tu diseño
          secondary: '#3b82f6', // Un azul similar al de tu diseño
        }
      }
    },
  },
  plugins: [],
  // Descomenta la siguiente línea si notas conflictos con los estilos base de Ng-Zorro
  // corePlugins: {
  //   preflight: false,
  // },
}