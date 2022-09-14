/* eslint-env jest */
const path = require('path')
const postcss = require('postcss')
const tailwindcss = require('tailwindcss')
const boxShadowPlugin = require('./index.js')

function run(config, css = '@tailwind utilities', plugin = tailwindcss) {
  const {currentTestName} = expect.getState()

  config = {
    plugins: [boxShadowPlugin],
    corePlugins: {
      preflight: false,
    },
    ...config,
  }

  return postcss(plugin(config)).process(css, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

it('uses shadow values from config as-is', () => {
  const config = {
    content: [{
      raw: String.raw`
        <div class="shadow"></div>
      `
    }],
  }

  return run(config).then(result => {
    expect(result.css).toMatchCss(String.raw`
      .shadow {
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      }
    `)
  })
})

it('arbitrary values', () => {
  const config = {
    content: [{
      raw: String.raw`
        <div class="shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"></div>
      `
    }],
  }

  return run(config).then(result => {
    expect(result.css).toMatchCss(String.raw`
      .shadow-\[0_35px_60px_-15px_rgba\(0\2c 0\2c 0\2c 0\.3\)\] {
        box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
      }
    `)
  })
})
