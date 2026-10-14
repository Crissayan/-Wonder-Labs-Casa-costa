import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

// Sombras con el color `primary` (#1A364F = rgb 26 54 79) tomadas de los frames.
const sombraPrimary = (alpha: number) => `rgb(26 54 79 / ${alpha})`;

// Tokens del UI Toolkit (constitución, "Stack Tecnológico y Sistema de Diseño").
// Colores, fuentes y radios REEMPLAZAN los de Tailwind: no existen clases fuera de estos tokens.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: {
      // Vista mobile por defecto (referencia 393 px); vista escritorio desde 1024 px,
      // con medidas máximas iguales al frame de 1456 px.
      lg: '1024px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      primary: '#1A364F',
      white: '#FFFFFF',
      cta: '#FAB53F',
      'secondary-1': '#3DBCD5',
      'secondary-2': '#6AC6DE',
      'secondary-3': '#A0D7E8',
      'secondary-4': '#67C1BD',
      surface: '#EFEFEF',
    },
    fontFamily: {
      nunito: ['Nunito', 'sans-serif'],
      inter: ['Inter', 'sans-serif'],
    },
    borderRadius: {
      none: '0',
      bloque: '10px',
      'btn-m': '10px',
      btn: '14px',
      img: '15px',
      pill: '50px',
      full: '9999px',
    },
    extend: {
      fontSize: {
        // Roles tipográficos del toolkit (mobile / escritorio).
        titulo: '28px',
        'titulo-lg': '64px',
        subtitulo: '24px',
        'subtitulo-lg': '48px',
        encabezado: '20px',
        'encabezado-lg': '36px',
        boton: '12px',
        'boton-lg': '30px',
        caption: '12px',
        'caption-lg': '26px',
        parrafo: '12px',
        'parrafo-lg': '22px',
      },
      boxShadow: {
        tarjeta: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        elevada: `-9px 15px 10px 0 ${sombraPrimary(0.2)}`,
        lateral: `-6px 0 4px 0 ${sombraPrimary(0.25)}`,
      },
      maxWidth: {
        frame: '1456px',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.sombra-titulo': { textShadow: `0 4px 10px ${sombraPrimary(0.7)}` },
        '.sombra-texto': { textShadow: `0 4px 4px ${sombraPrimary(1)}` },
        '.sombra-icono': { filter: `drop-shadow(0 1px 2px ${sombraPrimary(0.6)})` },
      });
    }),
  ],
} satisfies Config;
