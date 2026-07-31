/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bordeaux:       '#5B1A26',
        'bordeaux-deep':'#3E0F18',
        claret:         '#8C2F39',
        gold:           '#C6A15B',
        'gold-soft':    '#E7D3A1',
        ivory:          '#F8F2E9',
        cream:          '#EFE6D6',
        sand:           '#DCCDB4',
        surface:        '#FFFDF9',
        ink:            '#241016',
        'ink-muted':    '#6E5C52',
        success:        '#4F7A57',
        error:          '#B23A3A',
        warning:        '#C9772D',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body:    ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        sm:   '10px',
        md:   '14px',
        lg:   '22px',
        pill: '999px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(36,16,22,0.06)',
        md: '0 10px 30px rgba(36,16,22,0.10)',
        lg: '0 20px 50px rgba(36,16,22,0.14)',
      },
    },
  },
  plugins: [],
};
