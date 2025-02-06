import hmppsConfig from '@ministryofjustice/eslint-config-hmpps'

export default [
  ...hmppsConfig({
    extraIgnorePaths: ['assets/**', 'esbuild/**'],
    extraPathsAllowingDevDependencies: ['cypress.config.ts'],
  }),
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
    rules: {
      'no-plusplus': [
        'error',
        {
          allowForLoopAfterthoughts: true,
        },
      ],
    },
  },
]
