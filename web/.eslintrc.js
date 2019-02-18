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
    'jsx-a11y/alt-text': ['off'],
    'react/jsx-no-target-blank': ['off'],
  },
};
