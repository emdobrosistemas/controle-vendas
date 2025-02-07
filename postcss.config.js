module.exports = {
  plugins: {
    'tailwindcss': require('tailwindcss'),
    'autoprefixer': {
      overrideBrowserslist: ['> 1%', 'last 2 versions'],
      add: true
    }
  }
}