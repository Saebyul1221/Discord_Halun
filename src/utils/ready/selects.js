const Discord = require("discord.js")
const { info, error } = new (require("../output"))()

module.exports = async function select(client, config) {
  const getRole = (await client.knex("getrole"))[0]
  const gChannel = client.channels.cache.get(getRole.channel)
  const gMessageID = getRole.messageID
  gChannel.messages
    .fetch(gMessageID)
    .then(() => {
      info("SUCCESS", "Confirmed the role message.")
    })
    .catch(() => {
      error("No role message found.")
      gChannel.bulkDelete(100)
      const selects = new Discord.MessageActionRow().addComponents(
        new Discord.MessageSelectMenu()
          .setCustomId("ROLEMENU")
          .setPlaceholder("역할을 선택하실 수 있습니다!")
          .setMinValues(0)
          .setMaxValues(1)
          .addOptions(config.selects)
      )
      info("CREATE", "The role message is being generated.")
      gChannel
        .send({
          content: "역할을 선택하시고 싶으시다면 아래 메뉴를 확인해주세요!",
          components: [selects],
        })
        .then(async (msg) => {
          await client.knex("getrole").update({ messageID: msg.id })
        })
    })
}
