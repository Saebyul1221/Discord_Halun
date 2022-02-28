let message = undefined
const sendToLog = new (require("./sendToLog"))()

process.on("uncaughtException", (error) => {
  if (!message) return console.error(error)
  const embed = require("../utils/api/errorEmbed")(message)
  switch (error.message) {
    case "Not Owner":
      embed.setDescription("해당 명령어는 오너만 사용할 수 있어요!")
      message.channel.send({ embeds: [embed] })
      break
    case "Permission Denied":
      embed.setDescription("권한이 부족하여 이 명령어를 사용할 수 없어요!")
      message.channel.send({ embeds: [embed] })
      break
    default:
      sendToLog.error(error.stack)
      break
  }
})

module.exports.setMessage = (ctx) => {
  return (message = ctx)
}
