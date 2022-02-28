const Command = require("../../structures/Command")

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "입장메시지",
      aliases: ["입장메세지", "입장메시지"],
      description: "유저 입장 메시지를 변경해요.",
      category: "관리자",
      devOnly: true,
      fullCommand: "하룬아 입장메시지 < 메시지 >",
    })
  }

  async run(message, args, embed) {
    await this.client.knex("entry").update({ join: args.join(" ") })
    let context = args.join(" ")
    const replaceObj = {
      "{user}": `${message.member.displayName}#${message.author.discriminator}`,
      "{guild}": message.member.guild.name,
      "{count}": message.member.guild.memberCount,
    }
    for (const [key, value] of Object.entries(replaceObj)) {
      context = context.replaceAll(key, value)
    }
    embed.setTitle("변경 완료!")
    embed.setDescription(
      "다음에 접속하는 유저부터 바뀐 메시지로 전송할게요.\n\n**변경된 입장 메시지 미리보기**: \n" +
        context
    )
    message.reply({ embeds: [embed] })
  }
}
