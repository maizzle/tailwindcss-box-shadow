const plugin = require('tailwindcss/plugin')

const boxShadow = plugin(
  function ({matchUtilities, theme}) {
    matchUtilities(
      {
        shadow: value => ({
          boxShadow: value
        }),
      },
      {
        values: theme('boxShadow')
      }
    )
  },
  {
    corePlugins: {
      boxShadow: false,
      boxShadowColor: false,
    }
  }
)

module.exports = boxShadow
