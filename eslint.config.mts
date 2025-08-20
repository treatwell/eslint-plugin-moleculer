import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  { ignores: ['dist/', '.pnp.*', '.yarn'] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettier,
);
