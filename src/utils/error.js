const embed = require("./api/errorEmbed")
const sendToLog = new (require("./sendToLog"))()

let message = undefined
global.message = message

process.on("uncaughtException", (error) => {
  if (!message) return console.error(error)
  const shortMsg = error.message
  switch (shortMsg) {
    case shortMsg.includes("Not Owner"):
      embed.setDescription("해당 명령어는 오너만 사용할 수 있어요!")
      message.channel.send({ embeds: [embed] })
      break
    case shortMsg.includes("Permission Denied"):
      embed.setDescription("권한이 부족하여 이 명령어를 사용할 수 없어요!")
      message.channel.send({ embeds: [embed] })
      break
    default:
      // console.error(error)
      sendToLog.error(error.message)
      break
  }
})
