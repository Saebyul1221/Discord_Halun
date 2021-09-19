const Discord = require("discord.js")
const { info, error } = new (require("../output"))()

module.exports = async function button(client) {
  const authentication = (await this.client.knex("authentication"))[0]
  const channel = client.channels.cache.get(authentication.channel)
  const messageID = authentication.messageID
  channel.messages
    .fetch(messageID)
    .then(() => {
      info("SUCCESS", "Confirmed the authentication message.")
    })
    .catch(() => {
      error("No authentication message found.")
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
          await this.client.knex("authentication").update({ messageID: msg.id })
        })
    })
}
