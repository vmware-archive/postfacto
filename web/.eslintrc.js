module.exports = {
  'extends': [
    'react-app',
    'airbnb',
  ],
  'rules': {
    'camelcase': ['off'],
    'class-methods-use-this': ['off'],
    'jsx-a11y/click-events-have-key-events': ['off'],
    'jsx-a11y/label-has-associated-control': ['off'],
    'jsx-a11y/label-has-for': ['off'],
    'jsx-a11y/no-autofocus': ['off'],
    'jsx-a11y/no-static-element-interactions': ['off'],
    'max-len': ['off'],
    'prefer-destructuring': ['off'],
    'prefer-template': ['off'],
    'react/destructuring-assignment': ['off'],
    'react/forbid-prop-types': ['off'],
    'react/jsx-no-target-blank': ['off'],
    'react/jsx-one-expression-per-line': ['off'],
    'react/no-unescaped-entities': ['off'],
    'react/sort-comp': ['off'],

    'arrow-parens': ['error', 'always'],
    'react/jsx-no-bind': ['error', {
      'ignoreDOMComponents': false,
      'ignoreRefs': false,
      'allowArrowFunctions': true,
      'allowFunctions': false,
      'allowBind': false,
    }],
    'object-curly-newline': ['error', {
      'consistent': true,
    }],
    'object-curly-spacing': ['error', 'never'],
    'operator-linebreak': ['error', 'after'],
    'react/jsx-tag-spacing': ['error', {
      'closingSlash': 'never',
      'beforeSelfClosing': 'never',
      'afterOpening': 'never',
      'beforeClosing': 'never',
    }],
    'quote-props': ['error', 'consistent'],
  },

  'overrides': [{
    'files': ['**/test_support/*', 'spec_helper.*', '*.test.*'],
    'rules': {
      'import/no-extraneous-dependencies': ['error', {'devDependencies': true}],
    },
  }],
};
