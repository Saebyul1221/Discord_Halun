const Event = require("../../structures/Event")
const config = require("../../../config.json")
const { error, info } = new (require("../../utils/output"))()
const Discord = require("discord.js")

const Buttons = new Discord.MessageActionRow().addComponents(
  new Discord.MessageButton()
    .setCustomId(`APPLY_BLIND_DISABLED`)
    .setLabel("승인하기")
    .setStyle("PRIMARY")
    .setDisabled(true),
  new Discord.MessageButton()
    .setCustomId(`DENY_BLIND_DISABLED`)
    .setLabel("거절하기(차단)")
    .setStyle("DANGER")
    .setDisabled(true)
)

module.exports = class extends Event {
  async run(interaction, knex) {
    if (interaction.customId === "AUTHENTICATION") {
      interaction.member.guild.members
        .fetch(interaction.user.id)
        .then(async (member) => {
          const hasRole = member.roles.cache.find(
            (role) => role.id === config.auth.roleID
          )
          if (hasRole)
            return interaction.reply({
              content: "이미 인증되어 있습니다.",
              ephemeral: true,
            })
          member.roles.add(config.auth.roleID).catch((err) => {
            error(
              `I cannot grant roles to ${member.displayName}(${member.id}) users. Error content: \n${err}`
            )
          })
          await knex("authenticationlogs").insert({
            userID: interaction.user.id,
          })
          info("SUCCESS", `Add role. (User: ${interaction.user.id})`)
          interaction.reply({
            content: "인증이 완료되었습니다.",
            ephemeral: true,
          })
          interaction.client.channels.cache.get(config.auth.notifyID).send(`
           **[SUCCESS]** \`${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id})\` 님이 인증하셨습니다.\n
           `)
        })
    }
    if (interaction.customId === "ROLEMENU") {
      interaction.member.guild.members
        .fetch(interaction.user.id)
        .then(async (member) => {
          for (const role in config.selectsRole) {
            const hasRole = member.roles.cache.find(
              (r) => r.id === config.selectsRole[role]
            )
            const _role = interaction.member.guild.roles.cache.get(
              config.selectsRole[role]
            )
            if (hasRole) member.roles.remove(_role)
          }
          const role = interaction.member.guild.roles.cache.get(
            config.selectsRole[interaction.values[0]]
          )
          member.roles.add(role)
          interaction.reply({
            content: "역할이 적용되었습니다!",
            ephemeral: true,
          })
        })
    }
    if (interaction.customId.startsWith("APPLY_BLIND")) {
      const cid = interaction.customId
      interaction.member.guild.members
        .fetch(cid.split("_").slice(-1)[0])
        .then(async (member) => {
          const role =
            interaction.member.guild.roles.cache.get("870936654523793459")
          member.roles.remove(role)
        })
        .catch(() => false)
      interaction.reply({ content: "승인되었습니다!", ephemeral: true })
      interaction.message.channel.messages
        .fetch(interaction.message.id)
        .then((msg) => {
          msg.edit({
            content: "승인 된 유저입니다.",
            components: [Buttons],
          })
        })
    }
    if (interaction.customId.startsWith("DENY_BLIND")) {
      const cid = interaction.customId
      interaction.member.guild.members
        .fetch(cid.split("_").slice(-1)[0])
        .then(async (member) => {
          member.ban({ reason: "부적절한 닉네임" })
        })
        .catch(() => false)
      interaction.reply({
        content: "입장이 거절되었습니다! 자동으로 해당 유저는 차단됩니다.",
        ephemeral: true,
      })
      interaction.message.channel.messages
        .fetch(interaction.message.id)
        .then((msg) => {
          msg.edit({
            content: "**거절 된 유저입니다.**",
            components: [Buttons],
          })
        })
    }
  }
}
