const Event = require("../structures/Event")
const { info, data } = new (require("../utils/output"))()
const readyHandler = require("../utils/ready")
const config = require("../../config.json")

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      once: true,
    })
  }

  run() {
    info("READY", "봇이 켜졌어요!")
    data(`${this.client.commands.size}개의 커맨드가 로드되었어요!`)
    data(`${this.client.events.size}개의 이벤트가 로드되었어요!`)
    readyHandler.button(this.client)
    readyHandler.select(this.client, config)
  }
}
