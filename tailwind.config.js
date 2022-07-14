module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        barlow: ['Barlow', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

// default paragraph font-color: text-slate-500
// default heading font-color: text-slate-700
