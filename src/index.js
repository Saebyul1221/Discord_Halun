const HalunClient = require("./structures/Client")
const config = require("../config.json")

const client = new HalunClient(config)
client.start()
