const {map, fromPairs} = require('lodash')
const plugin = require('tailwindcss/plugin')
const nameClass = require('tailwindcss/lib/util/nameClass').default

const boxShadow = plugin(
  function ({addUtilities, theme, variants}) {
    const utilities = fromPairs(
      map(theme('boxShadow'), (value, modifier) => {
        return [
          nameClass('shadow', modifier),
          {
            'box-shadow': value
          }
        ]
      })
    )

    addUtilities(utilities, variants('boxShadow'))
  }
)

module.exports = boxShadow
