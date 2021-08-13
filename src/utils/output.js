const config = require("../../config.json")
const colors = require("colors")
colors.setTheme(config.colors)

module.exports = class Output {
  info(head, body) {
    console.log(`[${head}]`.info, `${body}`)
  }

  warn(body) {
    console.log("[WARN]".warn, `${body}`)
  }

  error(body) {
    console.log("[ERROR]".error, `${body}`)
  }

  data(body) {
    console.log("[DATA]".data, `${body}`)
  }
}
