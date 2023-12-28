module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@controllers': './src/controllers',
          '@routes': './src/routes',
          '@models': './src/models',
          '@helpers': './src/helpers',
          '@middlewares': './src/middlewares',
          '@types': './src/types',
        }
      }
    ]
  ]
};
