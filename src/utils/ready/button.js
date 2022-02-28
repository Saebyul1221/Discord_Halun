const Discord = require("discord.js")
const { info, error } = new (require("../sendToLog"))()

module.exports = async function button(client) {
  const authentication = (await client.knex("authentication"))[0]
  const channel = client.channels.cache.get(authentication.channel)
  const messageID = authentication.messageID
  channel.messages
    .fetch(messageID)
    .then(() => {
      info("SUCCESS", "인증 메시지를 찾았습니다.")
    })
    .catch(() => {
      error("인증 메시지를 찾을 수 없습니다.")
      channel.bulkDelete(100)
      const buttons = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId("AUTHENTICATION")
          .setLabel("인증하기")
          .setEmoji("✅")
          .setStyle("PRIMARY")
      )
      info("CREATE", "인증 메시지가 재생성 되었습니다")
      channel
        .send({
          content: "인증하실려면 아래 버튼을 눌러주세요!",
          components: [buttons],
        })
        .then(async (msg) => {
          await client.knex("authentication").update({ messageID: msg.id })
        })
    })
}
