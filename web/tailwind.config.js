/** @type {import('tailwindcss').Config} */
export default {
  content: ['./public/**/*.html', , 'src/**/*.vue'],
  theme: {
    extend: {
      gridTemplateRows: {
        '6': 'repeat(6, min-content)',
      },
      transitionProperty: {
        height: 'height',
        transform: 'transform',
      },
      height: {
        header: '50px',
        screen: '100vh',
        'screen-1/2': '50vh',
        'screen-1/4': '25vh',
        full: '100%',
        '1/2': '50%',
      },
      minHeight: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        '200': '200px',
        '300': '300px',
        '400': '400px',
        '540': '540px',
        header: '50px',
      },
      maxHeight: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        full: '100%',
        '400': '400px',
        '500': '500px',
        '600': '600px',
        header: '50px',
        screen: '100vh',
      },
      maxWidth: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        full: '100%',
        xl: '1024px',
        header: '50px',
      },
    },
  },
  variants: {
    margin: ['first', 'last', 'responsive'],
    padding: ['first', 'last', 'responsive'],
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
  },
};
