// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    es6: true,
    commonjs: true,
    browser: true
  },
  extends: [
    // https://github.com/airbnb/javascript
    'airbnb'
  ],
  // https://github.com/yannickcr/eslint-plugin-react
  plugins: ['react', 'babel', 'promise'],
  // add your custom rules here
  rules: {
    'object-curly-newline': 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-mixed-operators': 0,
    'import/no-extraneous-dependencies': 0,
    'react/forbid-prop-types': 0,
    'react/prefer-stateless-function': 0,
    'react/require-default-props': 0,
    'react/no-find-dom-node': 0,
    'react/no-did-mount-set-state': 0,
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
        aspects: ['invalidHref', 'preferButton']
      }
    ],
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0
  }
}
