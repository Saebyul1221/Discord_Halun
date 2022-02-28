const { error } = new (require("../utils/sendToLog"))()
const config = require("../../config.json")

module.exports = class Event {
  constructor(client, name, options = {}) {
    this.name = name
    this.client = client
    this.type = options.once ? "once" : "on"
    this.emitter =
      (typeof options.emitter === "string" ? this.client[options.emitter] : options.emitter) ||
      this.client
    this.config = config
  }

  // eslint-disable-next-line no-unused-vars
  async run(...args) {
    error(`이벤트 ${this.name} 에 "run" 메서드가 존재하지 않아요!`)
  }
}
