const Discord = require("discord.js")
const { info, error } = new (require("../sendToLog"))()

module.exports = async function select(client, config) {
  const getRole = (await client.knex("getrole"))[0]
  const gChannel = client.channels.cache.get(getRole.channel)
  const gMessageID = getRole.messageID
  gChannel.messages
    .fetch(gMessageID)
    .then(() => {
      info("SUCCESS", "역할 선택 메시지를 찾았습니다.")
    })
    .catch(() => {
      error("역할 선택 메시지를 찾을 수 없습니다.")
      gChannel.bulkDelete(100)
      const selects = new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("ROLEMENU")
          .setPlaceholder("역할을 선택하실 수 있습니다!")
          .setMinValues(0)
          .setMaxValues(1)
          .addOptions(config.selects)
      )
      const buttons = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId("ROLE_DELETE")
          .setLabel("프로그래밍 역할 제거하기")
          .setStyle("DANGER")
      )
      info("CREATE", "역할 선택 메시지가 재성성 되었습니다.")
      gChannel
        .send({
          content: "역할을 선택하시고 싶으시다면 아래 메뉴를 확인해주세요!",
          components: [selects, buttons],
        })
        .then(async (msg) => {
          await client.knex("getrole").update({ messageID: msg.id })
        })
    })
}
