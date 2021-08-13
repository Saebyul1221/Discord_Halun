const Event = require("../../structures/Event")
const { error } = new (require("../../utils/output"))()
const badwords = require("../../../badwords.json")

module.exports = class extends Event {
  async run(member, knex) {
    if (!member.guild.id === this.guildID) return
    const data = (await knex("entry"))[0]
    const channel = member.guild.channels.cache.get("861469538523938816")
    let blind = false
    if (!channel) return error("퇴장 메시지를 전송 할 채널을 찾지 못했어요.")
    badwords.some((badword) => {
      if (member.displayName.includes(badword)) blind = true
    })
    if (blind === false) {
      const replaceObj = {
        "{user}": `${member}`,
        "{guild}": member.guild.name,
        "{count}": member.guild.memberCount,
      }

      let context = data.quit
      for (const [key, value] of Object.entries(replaceObj))
        context = context.replaceAll(key, value)

      channel.send({ content: context })
    }
  }
}
