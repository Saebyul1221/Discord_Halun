const Event = require("../../structures/Event")
const Discord = require("discord.js")
const { error, info } = new (require("../../utils/output"))()

module.exports = class extends Event {
  async run(message, knex) {
    const authentication = (await knex("authentication"))[0]
    if (message.id === authentication.messageID) {
      const channel = message.client.channels.cache.get(authentication.channel)
      error("The authentication message has been removed.")
      channel.bulkDelete(100)
      const buttons = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId("AUTHENTICATION")
          .setLabel("인증하기")
          .setEmoji("✅")
          .setStyle("PRIMARY")
      )
      info("CREATE", "The authentication message is being generated.")
      channel
        .send({
          content: "인증하실려면 아래 버튼을 눌러주세요.",
          components: [buttons],
        })
        .then(async (msg) => {
          await knex("authentication").update({ messageID: msg.id })
        })
    }
  }
}
