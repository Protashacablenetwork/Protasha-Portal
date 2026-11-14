import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

export default [
  {
    ignores: ['dist/**/*', 'HTDOCS_UPLOAD/**/*', 'node_modules/**/*', 'src/**/*']
  },
  firebaseRulesPlugin.configs['flat/recommended']
];
