const Command = require("../../structures/Command")

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: "경고",
      aliases: ["주의"],
      description: "해당 유저의 경고를 지급하거나 차감해요.",
      category: "관리자",
    })
  }

  async run(message, args, embed) {
    if (!this.client.owners.some((oid) => message.author.id.includes(oid)))
      return message.reply({ content: "관리자만 사용할 수 있어요." })
    const commands = ["지급", "차감", "확인"]
    if (!commands.includes(args[0]))
      return message.reply({
        content: "`하룬아 경고 < 지급 / 차감 / 확인 > < 대상 > [ 사유 ]` 이 올바른 명령어에요.",
      })
    if (args[0] === commands[0]) {
      if (args[1] !== undefined) {
        const member = message.mentions.users.first()
        if (!member) return message.reply({ content: "대상은 멘션으로 지정하여야 해요." })
        const data = await this.client.knex("warn").where({ userID: member.id })
        const reason = args[2] === undefined ? "사유가 지정되지 않았어요." : args.slice(2).join(" ")
        const res = await this.giveWarn(member, data, args.slice(2).join(" "))
        if (res) {
          const count = data.length === 0 ? 0 : data[0].count
          embed.setTitle("경고 지급 알림")
          embed.setDescription(`\`${member.username}\`님에게 경고를 지급했어요.`)
          embed.addField("현재 경고 횟수", `\`${(count + 1).toString()}\`회`, true)
          embed.addField("경고 사유", reason, true)
          message.reply({ embeds: [embed] })
        } else {
          embed.setTitle("경고 지급 실패")
          embed.setDescription(res)
          message.reply({ embeds: [embed] })
        }
      } else {
        message.reply({ content: "대상이 지정되지 않았어요. " })
      }
    }
    if (args[0] === commands[1]) {
      if (args[1] !== undefined) {
        const member = message.mentions.users.first()
        if (!member) return message.reply({ content: "대상은 멘션으로 지정하여야 해요." })
        if (isNaN(args[2] === true))
          message.reply({ content: "케이스는 무조건 정수형 이여야 되요." })
        const data = await this.client.knex("warn").where({ userID: member.id })
        const res = await this.removeWarn(member, data, args[2])
        if (res) {
          const count = data.length === 0 ? 0 : data[0].count
          embed.setTitle("경고 차감 알림")
          args[2] === undefined
            ? embed.setDescription(`\`${member.username}\`님의 경고를 차감했어요.`)
            : embed.setDescription(`\`${member.username}\`님의 #${args[2]} 경고를 차감했어요.`)
          embed.addField("현재 경고 횟수", `\`${(count - 1).toString()}\`회`, true)
          message.reply({ embeds: [embed] })
        } else {
          embed.setTitle("경고 차감 실패")
          embed.setDescription("경고를 보유하지 않은 유저에요.")
          message.reply({ embeds: [embed] })
        }
      } else {
        message.reply({ content: "대상이 지정되지 않았어요. " })
      }
    }
    if (args[0] === commands[2]) {
      if (args[1] !== undefined) {
        const member = message.mentions.users.first()
        if (!member) return message.reply({ content: "대상은 멘션으로 지정하여야 해요." })
        const data = await this.client.knex("warn").where({ userID: member.id })
        if (!data.length > 0) return message.reply({ content: "경고를 보유하지 않은 유저에요." })
        const reason = JSON.parse(data[0].reason)
        embed.setDescription(`\`${member.username}\`님의 경고 목록이에요.`)
        for (let i = 0; i < data[0].count; i++) embed.addField(`#${i + 1} 케이스`, reason[i])
        message.reply({ embeds: [embed] })
      }
    }
  }

  async giveWarn(member, data, reason = "사유가 지정되지 않았어요.") {
    if (!data.length > 0) {
      const reasonArr = [reason]
      try {
        await this.client.knex("warn").insert({
          userID: member.id,
          count: 1,
          reason: JSON.stringify(reasonArr),
        })
        return true
      } catch (err) {
        return err
      }
    } else {
      const reasonArr = JSON.parse(data[0].reason)
      const count = data[0].count
      reasonArr.push(reason)
      try {
        await this.client
          .knex("warn")
          .update({
            count: count + 1,
            reason: JSON.stringify(reasonArr),
          })
          .where({ userID: member.id })
        return true
      } catch (err) {
        return err
      }
    }
  }

  async removeWarn(member, data, caseNum) {
    if (!data.length > 0 || data[0].count === 0) return false
    const reasonArr = JSON.parse(data[0].reason)
    const count = data[0].count
    if (!caseNum) caseNum = count

    if (reasonArr[caseNum - 1] !== undefined)
      reasonArr.splice(reasonArr.indexOf(reasonArr[caseNum - 1]), 1)

    try {
      await this.client
        .knex("warn")
        .update({
          count: count - 1,
          reason: JSON.stringify(reasonArr),
        })
        .where({ userID: member.id })
      return true
    } catch (err) {
      return err
    }
  }
}
