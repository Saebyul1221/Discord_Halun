const HalunClient = require("./structures/Client")
const config = require("../config.json")
require("./utils/error")

const client = new HalunClient(config)
client.start()
