module.exports = {
  'extends': [
    'react-app',
  ],
  'env': {
    'jasmine': true,
  },
  'globals': {
    'root': 'readonly',
    '$': 'readonly',
  },
  'rules': {
    'react/react-in-jsx-scope': ['off'],
    'jsx-a11y/alt-text': ['off'],
    'react/jsx-no-target-blank': ['off'],
    'array-callback-return': ['off'],
  },
};
