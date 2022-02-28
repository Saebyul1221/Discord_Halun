const { error } = new (require("../utils/sendToLog"))()
const config = require("../../config.json")

module.exports = class Command {
  constructor(client, name, options = {}) {
    this.client = client
    this.name = options.name || name
    this.aliases = options.aliases || []
    this.description = options.description || "설명이 없어요!"
    this.category = options.category || "기타"
    this.usage = `${this.client.prefix}${this.name} ${options.usage || ""}`.trim()
    this.config = config
  }

  // eslint-disable-next-line no-unused-vars
  async run(message, args) {
    error(`명령어 ${this.name} 에 "run" 메서드가 존재하지 않아요!`)
  }
}
