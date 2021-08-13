const Event = require("../../structures/Event")
const config = require("../../../config.json")
const knex = require("knex")(config.database)

module.exports = class extends Event {
  async run(message) {
    const mentionRegex = RegExp(`^<@!${this.client.user.id}>$`)
    if (!message.guild || message.author.bot) return

    if (message.content.match(mentionRegex))
      message.channel.send(`제 접두사는 \`${this.client.prefix}\` 이에요!`)

    const prefix = this.client.prefix

    if (!message.content.startsWith(prefix)) return

    const [cmd, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g)

    const command =
      this.client.commands.get(cmd.toLowerCase()) ||
      this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()))

    const embed = require("../../utils/embed")(message)
    if (command) {
      command.run(message, args, embed, knex)
    }
  }
}
