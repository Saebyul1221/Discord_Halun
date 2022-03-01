const { MessageActionRow, MessageButton } = require("discord.js")
const Command = require("../../structures/Command")

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "커맨드",
      aliases: ["커맨드", "커스텀", "커스텀커맨드"],
      description: "커스텀 커맨드를 추가해요.",
      category: "재미",
      fullCommand: "하룬아 커맨드 < 추가 / 삭제 > < 커맨드명 > < 커맨드내용 >",
    })
  }

  async run(message, args, embed) {
    const commandType = args[0]
    const commandName = args[1]
    const response = args.slice(2).join(" ")
    if (!commandType === "목록") {
      if ((commandType === "추가" && !response) || (commandType === "삭제" && !commandName)) {
        embed.setDescription(`잘못된 명령어 인자에요!\n사용법: \`${this.fullCommand}\``)
        return message.reply({ embeds: [embed] })
      }
    }
    switch (commandType) {
      case "추가":
        const responseRegExp = response
          .replaceAll("@everyone", "@에브리원")
          .replaceAll("@here", "@히얼")
        await this.client.knex("customcmd").insert({
          user: message.author.id,
          cmd: commandName,
          value: responseRegExp,
        })
        if (commandName === this.config.prefix.split(" ")[0])
          return message.reply({ content: "봇의 접두사는 등록하실 수 없어요!" })
        embed.setTitle("등록 성공!")
        embed.setDescription(
          `앞으로 **${commandName}** 이라는 말에 대해서 **${responseRegExp}** 라고 대답할게요!`
        )
        message.reply({ embeds: [embed] })
        break
      case "삭제":
        const data = await this.client
          .knex("customcmd")
          .where({ user: message.author.id, cmd: commandName })
        if (!data.length > 0) {
          embed.setDescription(
            `등록하신 커맨드를 찾지 못했어요.. 커맨드 삭제는 본인만 할 수 있어요!`
          )
          return message.reply({ embeds: [embed] })
        }
        const filter = (interaction) =>
          interaction.customId.startsWith("CustomCommandDelete") &&
          interaction.user.id === message.author.id
        embed.setTitle("정말로 삭제하시겠어요?")
        embed.setDescription(
          `삭제를 하게되면 본인이 등록한 **'${commandName}'** 의 모든 내용이 사라져요. `
        )
        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId("CustomCommandDeleteApprove")
              .setLabel("삭제하기")
              .setStyle("DANGER")
          )
          .addComponents(
            new MessageButton()
              .setCustomId("CustomCommandDeleteCancel")
              .setLabel("취소하기")
              .setStyle("PRIMARY")
          )
        message.reply({ embeds: [embed], components: [row] }).then((msg) => {
          msg.awaitMessageComponent({ filter: filter }).then(async (interaction) => {
            if (interaction.customId === "CustomCommandDeleteApprove") {
              await this.client
                .knex("customcmd")
                .where({
                  user: message.author.id,
                  cmd: commandName,
                })
                .del()
              embed.setTitle("삭제 성공!")
              embed.setDescription(`커맨드 **${commandName}** 을(를) 삭제했어요!`)
              msg.edit({ embeds: [embed], components: [] })
            } else {
              embed.setTitle("삭제가 취소되었어요!")
              embed.description = null
              msg.edit({ embeds: [embed], components: [] })
            }
          })
        })
        break
      case "목록":
        const commands = await this.client.knex("customcmd").select()
        const fullSize = commands.length > 30 ? 30 : commands.length
        if (!fullSize > 0) return message.reply({ content: "아직은 아무것도 없는 것 같네요..." })
        let ctx = ""
        for (let i = 0; i < fullSize; i++) ctx += `${i + 1}. ${commands[i].cmd}\n`
        embed.setDescription(`        
커맨드 갯수는 최대 **30개**까지만 보여요!
\`\`\`md
${ctx}
\`\`\``)

        message.reply({ embeds: [embed] })
        break
      default:
        embed.setDescription(`잘못된 명령어 인자에요!\n사용법: \`${this.fullCommand}\``)
        message.reply({ embeds: [embed] })
    }
  }
}
