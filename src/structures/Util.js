const path = require("path")
const { promisify } = require("util")
const glob = promisify(require("glob"))
const Command = require("./Command.js")
const Event = require("./Event.js")
const { error } = new (require("../utils/sendToLog"))()
const config = require("../../config.json")
const knex = require("knex")(config.database)

module.exports = class Util {
  constructor(client) {
    this.client = client
  }

  isClass(input) {
    return (
      typeof input === "function" &&
      typeof input.prototype === "object" &&
      input.toString().substring(0, 5) === "class"
    )
  }

  get directory() {
    return `${path.dirname(require.main.filename)}${path.sep}`
  }

  removeDuplicates(arr) {
    return [...new Set(arr)]
  }

  async loadCommands() {
    return glob(`${this.directory}commands/**/*.js`).then((commands) => {
      for (const commandFile of commands) {
        delete require.cache[commandFile]
        const { name } = path.parse(commandFile)
        const File = require(commandFile)
        if (!this.isClass(File)) error(`${name} 커맨드에 클래스가 누락됬어요!`)
        const command = new File(this.client, name.toLowerCase())
        if (!(command instanceof Command)) error(`${name} 파일은 명령어가 아니에요!`)
        this.client.commands.set(command.name, command)
        if (command.aliases.length) {
          for (const alias of command.aliases) {
            this.client.aliases.set(alias, command.name)
          }
        }
      }
    })
  }

  async loadEvents() {
    return glob(`${this.directory}events/**/*.js`).then((events) => {
      for (const eventFile of events) {
        delete require.cache[eventFile]
        const { name } = path.parse(eventFile)
        const File = require(eventFile)
        if (!this.isClass(File)) error(`${name} 이벤트에 클래스가 누락됬어요!`)
        const event = new File(this.client, name)
        if (!(event instanceof Event)) throw new TypeError(`${name} 파일은 이벤트가 아니에요!`)
        this.client.events.set(event.name, event)
        event.emitter[event.type](name, (...args) => event.run(...args, knex))
      }
    })
  }
}
