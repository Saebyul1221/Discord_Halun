const Command = require("../../structures/Command")

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "핑",
      aliases: ["핑", "퐁", "레이턴시"],
      description: "현재 하룬의 레이턴시를 보여드려요.",
      category: "유틸리티",
    })
  }

  async run(message) {
    const msg = await message.reply({ content: "잠시만 기다려주세요..." })
    const latency = msg.createdTimestamp - message.createdTimestamp

    msg.edit(
      `봇 지연시간: \`${latency}ms\`, API 지연시간: \`${Math.round(
        this.client.ws.ping
      )}ms\``
    )
  }
}
