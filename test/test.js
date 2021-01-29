const test = require('ava')
const plugin = require('../lib/')
const {merge} = require('lodash')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')

const generatePluginCss = config => {
  return postcss(
    tailwindcss(
      merge({
        theme: {
          screens: {
            sm: '640px'
          }
        },
        corePlugins: false,
        plugins: [
          plugin
        ]
      }, config)
    )
  )
    .process('@tailwind utilities', {
      from: null
    })
    .then(result => result)
}

const config = {
  theme: {
    boxShadow: {
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }
  },
  variants: {
    boxShadow: ['responsive']
  }
}

const expected = `.shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
}

@media (min-width: 640px) {
  .sm\\:shadow {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
  }

  .sm\\:shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
  }
}`

test('It generates utilities', async t => {
  const {css} = await generatePluginCss(config)

  t.is(css, expected)
})
