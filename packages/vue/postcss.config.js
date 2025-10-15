export default {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-prefix-selector': {
      prefix: '.blario-wrapper',
      transform: function (prefix, selector, prefixedSelector) {
        // Don't prefix keyframes, CSS variables, or special selectors
        if (selector.startsWith('@') || selector.startsWith(':root') || selector.startsWith('*')) {
          return selector;
        }

        // Don't prefix our wrapper class itself
        if (selector === '.blario-wrapper') {
          return selector;
        }

        // For all other selectors, add the prefix
        return prefixedSelector;
      }
    },
    'autoprefixer': {},
  },
};