/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Glowform Lab Brand Theme - Magical Wellness Science
        'theme-bg': '#FFF6E8',           // Warm Cream (main background)
        'theme-text': '#7A4A2E',         // Caramel Brown (primary text)
        'theme-accent': '#F4C24F',       // Radiant Gold (hero color)
        'theme-accent-hover': '#E3AE3A', // Honey Gold (hover state)
        'theme-secondary': '#F3D2B8',    // Peach Nude (soft accent)
        'text-secondary': '#9B6B4A',     // Medium caramel (body text)

        // Cream scale (backgrounds)
        cream: {
          50: '#FFFCF7',
          100: '#FFF9F0',
          200: '#FFF6E8',   // Main background
          300: '#FFEFD8',
          400: '#FFE5C4',
          500: '#FFD9AD',
          600: '#E5C59C',
          700: '#CCB08B',
          800: '#B29A79',
          900: '#998568',
        },

        // Gold scale (primary brand color)
        gold: {
          50: '#FEF9E7',
          100: '#FCF0C3',
          200: '#FAE69B',
          300: '#F7DC73',
          400: '#F4C24F',   // Radiant Gold - Primary
          500: '#E3AE3A',   // Honey Gold
          600: '#C99628',
          700: '#A87C1F',
          800: '#876318',
          900: '#664A12',
        },

        // Peach scale (soft accent)
        peach: {
          50: '#FDF7F2',
          100: '#FBEFE5',
          200: '#F8E3D4',
          300: '#F3D2B8',   // Peach Nude
          400: '#EABC9A',
          500: '#DFA57C',
          600: '#C98E65',
          700: '#AB7450',
          800: '#8C5C3E',
          900: '#6D462F',
        },

        // Blush scale (beauty accent)
        blush: {
          50: '#FDF5F7',
          100: '#FBEAEF',
          200: '#F7D5DF',
          300: '#F2B8C6',   // Blush Pink
          400: '#EA96AC',
          500: '#DF7491',
          600: '#C95A78',
          700: '#A94560',
          800: '#88364C',
          900: '#66293A',
        },

        // Caramel scale (text color)
        caramel: {
          50: '#F8F1EB',
          100: '#EDE0D4',
          200: '#DCCAB8',
          300: '#C4A988',
          400: '#A88560',
          500: '#9B6B4A',
          600: '#7A4A2E',   // Primary text
          700: '#5F3A23',
          800: '#462B1A',
          900: '#2E1C11',
        },

        // Primary scale mapped to gold for compatibility
        primary: {
          50: '#FEF9E7',
          100: '#FCF0C3',
          200: '#FAE69B',
          300: '#F7DC73',
          400: '#F4C24F',
          500: '#E3AE3A',
          600: '#C99628',
          700: '#A87C1F',
          800: '#876318',
          900: '#664A12',
        },

        // Accent colors
        accent: {
          light: '#F7DC73',
          DEFAULT: '#F4C24F',
          dark: '#E3AE3A',
          white: '#FFFFFF',
          black: '#7A4A2E',
        },

        // Magenta mapped to blush for backward compatibility
        magenta: {
          50: '#FDF5F7',
          100: '#FBEAEF',
          200: '#F7D5DF',
          300: '#F2B8C6',
          400: '#EA96AC',
          500: '#DF7491',
          600: '#C95A78',
          700: '#A94560',
          800: '#88364C',
          900: '#66293A',
        },

        // Navy mapped to caramel for backward compatibility
        navy: {
          50: '#F8F1EB',
          100: '#EDE0D4',
          200: '#DCCAB8',
          300: '#C4A988',
          400: '#A88560',
          500: '#9B6B4A',
          600: '#7A4A2E',
          700: '#5F3A23',
          800: '#462B1A',
          900: '#2E1C11',
        },

        // Teal for accents (kept for variety)
        teal: {
          50: '#E8F7F5',
          100: '#C4EBE6',
          200: '#9CDFD5',
          300: '#74D3C4',
          400: '#4FC7B3',
          500: '#2BB9A1',
          600: '#239A86',
          700: '#1B7A6A',
          800: '#145B4F',
          900: '#0D3C34',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(244, 194, 79, 0.08)',
        'medium': '0 4px 20px rgba(244, 194, 79, 0.12)',
        'hover': '0 8px 30px rgba(244, 194, 79, 0.18)',
        'glow': '0 0 30px rgba(244, 194, 79, 0.25)',
        'glow-lg': '0 0 50px rgba(244, 194, 79, 0.35)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideIn': 'slideIn 0.4s ease-out',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(244, 194, 79, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(244, 194, 79, 0.5)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
