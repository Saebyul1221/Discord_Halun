const Event = require("../structures/Event")
const Discord = require("discord.js")
const { error, info } = new (require("../utils/sendToLog"))()

module.exports = class extends Event {
  async run(message) {
    const authentication = (await this.client.knex("authentication"))[0]
    if (message.id === authentication.messageID) {
      const channel = message.client.channels.cache.get(authentication.channel)
      error("인증 메시지가 제거되었습니다.")
      channel.bulkDelete(100)
      const buttons = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId("AUTHENTICATION")
          .setLabel("인증하기")
          .setEmoji("✅")
          .setStyle("PRIMARY")
      )
      info("CREATE", "인증 메시지가 재생성 되었습니다.")
      channel
        .send({
          content: "인증하실려면 아래 버튼을 눌러주세요.",
          components: [buttons],
        })
        .then(async (msg) => {
          await this.client.knex("authentication").update({ messageID: msg.id })
        })
    }
  }
}
