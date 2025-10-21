export default {
  plugins: {
    '@tailwindcss/postcss': {},
    'postcss-prefix-selector': {
      prefix: '.blario-root',
      transform: function (prefix, selector, prefixedSelector) {
        // Don't prefix keyframes, CSS variables, or special selectors
        if (selector.startsWith('@') || selector.startsWith(':root') || selector.startsWith('*')) {
          return selector;
        }

        // Don't prefix our root class itself
        if (selector === '.blario-root') {
          return selector;
        }

        // For all other selectors, add the prefix
        return prefixedSelector;
      }
    },
    'autoprefixer': {},
  },
};