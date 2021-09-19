const { Client, Collection, Intents } = require("discord.js")
const Util = require("./Util.js")
const { error } = new (require("../utils/output"))()
const config = require("../../config.json")
const knex = require("knex")(config.database)
const AllOfIntents = new Intents()
AllOfIntents.add(config.intents)

module.exports = class HalunClient extends Client {
  constructor(options = {}) {
    super({
      disableMentions: ["everyone"],
      intents: AllOfIntents,
      allowedMentions: {
        repliedUser: false,
      },
    })

    this.validate(options)
    this.commands = new Collection()
    this.aliases = new Collection()
    this.events = new Collection()
    this.utils = new Util(this)
    this.knex = knex
  }

  validate(options) {
    if (typeof options !== "object") error("옵션 파라미터는 Object 여야해요!")

    if (!options.token) error("클라이언트 토큰이 누락됬어요!")
    this.token = options.token

    if (!options.prefix) error("클라이언트 접두사가 누락됬어요1")
    if (typeof options.prefix !== "string") error("접두사는 문자열이여야 해요!")
    this.prefix = options.prefix

    if (!options.owners) error("봇 오너가 누락됬어요!")
    if (!Array.isArray(options.owners)) error("봇 오너의 타입은 반드시 배열 이여야해요!")
    this.owners = options.owners
    this.guildID = "861455901926883389"
  }

  async start(token = this.token) {
    this.utils.loadCommands()
    this.utils.loadEvents()
    super.login(token)
  }
}
