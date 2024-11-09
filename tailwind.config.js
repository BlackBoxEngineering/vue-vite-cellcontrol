module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['Pacifico', 'cursive'],
        'roboto-mono': ['"Roboto Mono"', 'monospace'],
      },
      animation: {
        fade: 'fadeOut 10s ease-in-out',
      },
      keyframes: theme => ({
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      }),
      backgroundImage: {
        'main-background': "url('/src/assets/organic-background.png')",
      },
    },
  },
  plugins: [],
  important: true,
};
