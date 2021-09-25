const { MessageAttachment } = require("discord.js")
const Command = require("../../structures/Command")
const fs = require("fs")
const calc = require("../../utils/typing")
let isStarted = false

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "타자",
      aliases: ["타자", "타수", "WPM"],
      description: "타수를 측정해드려요.",
      category: "재미",
    })
  }

  async run(message, args, embed) {
    if (isStarted) return message.reply({ content: "다른 사람이 먼저 타수를 측정하고 있어요." })
    const config = this.config
    fs.readdir(config.sentenceDir, function (err, file) {
      isStarted = true
      const started_at = new Date().getTime()
      let fileName = ""
      const random = Math.floor(Math.random() * file.length)
      fileName = `${file[random]}`.split(".")[0]
      embed.setDescription("잠시 후 타자 측정이 시작됩니다.\n**줄바꿈은 공백 1칸으로 인식합니다.**")
      message.reply({ embeds: [embed] }).then(async (msg) => {
        const wait = (amount) => new Promise((resolve) => setTimeout(resolve, amount))
        await wait(3000)
        const imageFile = new MessageAttachment(`${config.sentenceDir}/${fileName}.png`)
        embed.setDescription(
          "다음 사진의 적힌 문장을 그대로 적으세요.\n**줄바꿈은 공백 1칸으로 처리해주세요.**"
        )
        embed.setImage(`attachment://${fileName}.png`)
        msg
          .edit({ content: `${message.member}`, embeds: [embed], files: [imageFile] })
          .then(async (text) => {
            const filter = (m) => m.author.id === message.author.id
            text.channel
              .awaitMessages({ filter, max: 1, time: 60000, erros: ["time"] })
              .then((collected) => {
                if (collected.first().content !== config.sentence[fileName]) {
                  isStarted = false
                  return message.reply({ content: "오탈자가 존재합니다. 타자 측정을 종료합니다." })
                }
                const ended_at = new Date().getTime() - 4001
                const result = calc.xStart(config.sentence[fileName], started_at, ended_at)
                message.channel.send({
                  content: `${message.member}\n결과: \`${result}타\` 걸린시간: \`${
                    ended_at - started_at
                  }\`ms`,
                })
                isStarted = false
              })
          })
      })
    })
  }
}
