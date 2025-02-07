module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: ['> 1%', 'last 2 versions'],
      add: true,
      features: {
        appearance: { properties: ['appearance', '-webkit-appearance', '-moz-appearance'] }
      }
    }
  }
}