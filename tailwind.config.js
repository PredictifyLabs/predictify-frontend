/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Busca clases en todos los archivos HTML y TS dentro de src
  ],
  theme: {
    extend: {
      colors: {
        predictify: {
          // Fondos oscuros
          bg: {
            primary: '#0A0A0A',
            secondary: '#121212',
            card: '#1A1A1A',
            elevated: '#1E1E1E',
            dark: '#050505',
          },
          // Bordes
          border: {
            subtle: '#2E2E2E',
            light: 'rgba(255, 255, 255, 0.1)',
            lighter: 'rgba(255, 255, 255, 0.05)',
            medium: 'rgba(255, 255, 255, 0.08)',
          },
          // Texto
          text: {
            primary: '#FFFFFF',
            secondary: '#B3B3B3',
            muted: '#666666',
            disabled: '#888888',
          },
          // Acentos principales
          accent: {
            blue: '#4070F4',
            blueHover: '#5B8DEF',
            purple: '#7C3AED',
            purpleLight: '#a855f7',
            green: '#10B981',
            yellow: '#F59E0B',
            red: '#EF4444',
            orange: '#F97316',
          },
          // Gradientes (usar con bg-gradient-to-r)
          gradient: {
            primary: 'linear-gradient(90deg, #a855f7 0%, #3b82f6 100%)',
            blue: 'linear-gradient(90deg, #4070F4 0%, #5B8DEF 100%)',
            purple: 'linear-gradient(90deg, #7C3AED 0%, #a855f7 100%)',
          },
        },
      },
      // Sombras personalizadas
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'glow-blue': '0 0 40px rgba(64, 112, 244, 0.3)',
        'glow-purple': '0 0 40px rgba(168, 85, 247, 0.3)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
      // Backdrop blur para glassmorphism
      backdropBlur: {
        'xs': '2px',
        'glass': '12px',
      },
      // Border radius personalizados
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      // Animaciones personalizadas
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% center' },
          '50%': { backgroundPosition: '100% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
  // Descomenta la siguiente línea si notas conflictos con los estilos base de Ng-Zorro
  // corePlugins: {
  //   preflight: false,
  // },
}