const { MessageEmbed } = require("discord.js")
const Command = require("../../structures/Command")

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "도움말",
      aliases: ["도움", "도움말", "헬프", "썸바디헬프미"],
      description: "사용할 수 있는 명령어를 보여드려요.",
      category: "유틸리티",
      usage: "[커맨드]",
    })
  }

  async run(message, [command]) {
    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setAuthor({ text: "하룬의 도움말 메뉴!", iconURL: message.guild.iconURL({ dynamic: true }) })
      .setThumbnail(this.client.user.displayAvatarURL())
      .setFooter({
        text: message.author.username,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp()

    if (command) {
      const cmd =
        this.client.commands.get(command) ||
        this.client.commands.get(this.client.aliases.get(command))

      if (!cmd) return message.reply("알 수 없는 명령어에요..")

      embed.setAuthor({ name: `${cmd.name} 도움말`, iconURL: this.client.user.displayAvatarURL() })
      embed.setDescription(
        [
          `**❯ 별칭:** ${
            cmd.aliases.length
              ? cmd.aliases.map((alias) => `\`${alias}\``).join(" ")
              : "별칭이 없어요!"
          }`,
          `**❯ 설명:** ${cmd.description}`,
          `**❯ 카테고리:** ${cmd.category}`,
          `**❯ 사용법:** \`${cmd.usage}\``,
        ].join("\n")
      )

      return message.reply({ embeds: [embed] })
    } else {
      embed.setDescription(
        [
          `봇의 접두사는 ${this.client.prefix}이에요.`,
          `\`<>\` 는 필수 사항이고, \`[]\` 는 선택 사항이에요.`,
        ].join("\n")
      )
      let categories
      if (!this.client.owners.includes(message.author.id)) {
        categories = this.client.utils.removeDuplicates(
          this.client.commands
            .filter((cmd) => cmd.category !== "개발자" && cmd.category !== "관리자")
            .map((cmd) => cmd.category)
        )
      } else {
        categories = this.client.utils.removeDuplicates(
          this.client.commands.map((cmd) => cmd.category)
        )
      }

      for (const category of categories) {
        embed.addField(
          `**${category}**`,
          this.client.commands
            .filter((cmd) => cmd.category === category)
            .map((cmd) => `\`${cmd.name}\``)
            .join(" ")
        )
      }
      return message.reply({ embeds: [embed] })
    }
  }
}
