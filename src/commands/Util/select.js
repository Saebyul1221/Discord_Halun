const Command = require("../../structures/Command")

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "골라줘",
      aliases: ["골라", "골라봐"],
      description: "주어진 파라미터 중 하나를 랜덤하게 선택해요.",
      category: "유틸리티",
    })
  }

  async run(message, args, embed) {
    if (args.length < 2)
      return message.reply(
        '`하룬아 골라줘 < 1번 > < 2번 > [ 3번 ] [ 4번 ]..."이 올바른 명령어에요!'
      )

    const words = args.slice(0)
    const random = Math.floor(Math.random() * words.length)

    embed.setDescription(`제 선택은 \`${words[random]}\` 이에요!`)
    message.reply({ embeds: [embed] })
  }
}
