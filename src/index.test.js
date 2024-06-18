import path from 'path'
import postcss from 'postcss'
import boxShadowPlugin from '.'
import { expect, test } from 'vitest'
import tailwindcss from 'tailwindcss'

// Custom CSS matcher
expect.extend({
  // Compare two CSS strings with all whitespace removed
  // This is probably naive but it's fast and works well enough.
  toMatchCss(received, argument) {
    function stripped(string_) {
      return string_.replaceAll(/\s/g, '').replaceAll(';', '')
    }

    const pass = stripped(received) === stripped(argument)

    return {
      pass,
      actual: received,
      expected: argument,
      message: () => pass ? 'All good!' : 'CSS does not match',
    }
  }
})

// Function to run the plugin
function run(config, css = '@tailwind utilities', plugin = tailwindcss) {
  let { currentTestName } = expect.getState()

  config = {
    ...{
      plugins: [boxShadowPlugin],
      corePlugins: {
        preflight: false,
      }
    },
    ...config,
  }

  return postcss(plugin(config)).process(css, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  })
}

test('uses shadow values from config as-is', () => {
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

test('arbitrary values', () => {
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
