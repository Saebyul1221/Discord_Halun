const Event = require("../../structures/Event")
const Discord = require("discord.js")
const { error } = new (require("../../utils/output"))()
const badwords = require("../../../badwords.json")

module.exports = class extends Event {
  async run(member, knex) {
    if (!member.guild.id === this.guildID) return
    const data = (await knex("entry"))[0]
    const channel = member.guild.channels.cache.get("861469538523938816")
    const notifyChannel = member.guild.channels.cache.get("870935360786530314")
    let blind = false
    let catched = ""
    if (!channel) return error("입장 메시지를 전송 할 채널을 찾지 못했어요.")
    badwords.some((badword) => {
      if (member.displayName.includes(badword)) {
        catched += `${badword}\n`
        const role = member.guild.roles.cache.get("870936654523793459")
        member.roles.add(role)
        blind = true
      }
    })
    if (blind === true) {
      const embed = new Discord.MessageEmbed()
        .setTitle("검열된 유저가 있습니다.")
        .addField("유저 이름", member.displayName, true)
        .addField("검열된 내용", catched, true)
      const Buttons = new Discord.MessageActionRow().addComponents(
        new Discord.MessageButton()
          .setCustomId(`APPLY_BLIND_${member.user.id}`)
          .setLabel("승인하기")
          .setStyle("PRIMARY"),
        new Discord.MessageButton()
          .setCustomId(`DENY_BLIND_${member.user.id}`)
          .setLabel("거절하기(차단)")
          .setStyle("DANGER")
      )
      notifyChannel.send({
        content: "<@&861473445161861150>",
        embeds: [embed],
        components: [Buttons],
      })
    } else {
      const replaceObj = {
        "{user}": `${member}`,
        "{guild}": member.guild.name,
        "{count}": member.guild.memberCount,
      }

      let context = data.join
      for (const [key, value] of Object.entries(replaceObj))
        context = context.replaceAll(key, value)

      channel.send({ content: context })
    }
  }
}
