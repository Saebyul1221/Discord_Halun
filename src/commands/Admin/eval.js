const Command = require("../../structures/Command")

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "실행",
      aliases: ["실행", "에발", "이발", "뱉어"],
      description: "사용할 수 있는 명령어를 보여드려요.",
      category: "개발자",
      usage: "[커맨드]",
      devOnly: true,
    })
  }

  async run(message, args, embed) {
    if (args.length < 1) return message.reply("`하룬아 실행 < 코드 >` 가 올바른 명령어에요.")
    const text = args.join(" ")

    if (text.indexOf("exit") != -1 && text.indexOf("process") != -1) {
      embed.setTitle("실행 실패!")
      embed.setDescription("`process.exit()` 함수는 이용할 수 없습니다!")
      message.channel.send(`${message.member}`, { embeds: [embed] })
    } else {
      try {
        const result = new Promise((resolve) => resolve(eval(text)))
        return result
          .then((output) => {
            if (typeof output !== "string")
              output = require("util").inspect(output, {
                depth: 0,
              })

            if (output.includes(this.client.token))
              output = output.replace(this.client.token, "토큰")
            if (output.length > 1010) output = output.slice(0, 1010) + "\n..."
            embed.setDescription(
              "입력 :\n```js\n" + text + "\n```\n출력 :```js\n" + output + "\n```"
            )
            message.reply({ embeds: [embed] })
          })
          .catch((error) => {
            error = error.toString()
            error = error.replace(this.client.token, "토큰")

            if (error.includes(this.client.token)) error = error.replace(this.client.token, "토큰")
            embed.setTitle("실행 실패!")
            embed.setDescription(`
\`\`\`js
${error}
\`\`\`
      `)
            message.reply({ embeds: [embed] })
          })
      } catch (err) {
        embed.setTitle("실행 실패!")
        embed.setDescription(`
\`\`\`js
${err}
\`\`\`
    `)
        message.reply({ embeds: [embed] })
      }
    }
  }
}
