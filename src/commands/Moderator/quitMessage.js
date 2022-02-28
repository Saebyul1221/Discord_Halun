const Command = require("../../structures/Command")

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "퇴장메시지",
      aliases: ["퇴장메세지", "퇴장메시지"],
      description: "유저 퇴장 메시지를 변경해요.",
      category: "관리자",
      devOnly: true,
      fullCommand: "하룬아 퇴장메시지 < 메시지 >",
    })
  }

  async run(message, args, embed) {
    await this.client.knex("entry").update({ quit: args.join(" ") })
    let context = args.join(" ")
    const replaceObj = {
      "{user}": `${message.member.displayName}#${message.user.discriminator}`,
      "{guild}": message.member.guild.name,
      "{count}": message.member.guild.memberCount,
    }
    for (const [key, value] of Object.entries(replaceObj)) {
      context = context.replaceAll(key, value)
    }
    embed.setTitle("변경 완료!")
    embed.setDescription(
      "다음에 나가는 유저부터 바뀐 메시지로 전송할게요.\n\n**변경된 퇴장 메시지 미리보기**: \n" +
        context
    )
    message.reply({ embeds: [embed] })
  }
}
