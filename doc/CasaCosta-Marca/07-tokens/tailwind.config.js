/** Casa Costa Hotel — preset de Tailwind CSS
 *  Fuente: CasaCostaUIToolKit.pdf (Figma). Uso: presets: [require('./tailwind.config.js')]
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        cc: {
          navy: '#1A364F',
          'navy-deep': '#1C3149',
          'navy-soft': '#2F4670',
          sun: '#FAB53F',
          cyan: { 200: '#A0D7E8', 400: '#6AC6DE', 500: '#3DBCD5' },
          teal: '#67C1BD',
          surface: '#EFEFEF',
          placeholder: '#D9D9D9',
          tint: '#D0E9F2',
          whatsapp: '#64AC4D',
        },
      },
      fontFamily: {
        primary: ['Nunito', 'system-ui', 'sans-serif'],
        secondary: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // escritorio (md+)
        'cc-title': '64px',
        'cc-subtitle': '48px',
        'cc-heading': '36px',
        'cc-button': '30px',
        'cc-caption': '26px',
        'cc-body': '22px',
        // mobile
        'cc-title-m': '28px',
        'cc-subtitle-m': '24px',
        'cc-heading-m': '20px',
        'cc-button-m': '12px',
        'cc-caption-m': '12px',
        'cc-body-m': '12px',
      },
      borderRadius: {
        'cc-image': '15px',
        'cc-info': '10px',
      },
      spacing: {
        'cc-section': '50px',
        'cc-margin-desktop': '80px',
        'cc-margin-mobile': '30px',
        'cc-gutter-desktop': '24px',
        'cc-gutter-mobile': '16px',
      },
      maxWidth: {
        'cc-hero': '1456px',
        'cc-rooms': '1350px',
        'cc-carousel': '1360px',
        'cc-faq': '1319px',
        'cc-reviews': '1125px',
        'cc-popup': '916px',
      },
      backgroundColor: {
        'cc-overlay': 'rgba(26, 54, 79, 0.95)',
      },
    },
  },
};
