const ENV = require("dotenv").config().parsed;
const CONFIG = require("../config.json");
const { Client, Intents } = require("discord.js");
const { readFileSync, readdirSync } = require("fs");

class clientClass {
  _client;
  _events;
  _dirname;

  constructor($dirname, EVENTS) {
    this._dirname = $dirname;
    this._events = EVENTS;
    this.main();
  }

  async main() {
    this._client = new Client({
      partials: ["CHANNEL"],
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
      ],
    });
    this._client["interaction"] = new Object();
    this._client["interaction"]["commands"] = new Array();
    if (CONFIG.debug) await this.debug();
    await this.events();
    this.interaction();
  }

  async events() {
    this._events.emit("client.debug", "");
    this._events.emit("client.debug", "\x1b[36mEvent ↓\x1b[0m");
    const eventsFiles = await readdirSync(`${this._dirname}/events/`).filter(
      (fileName) => fileName.endsWith(".js")
    );
    await eventsFiles.map(async (fileName) => {
      const eventClass = require(`${this._dirname}/events/${fileName}`);
      const { _data, execute } = new eventClass();
      await this._client.on(
        _data.name,
        execute.bind(this, this._events, this._client)
      );
      this._events.emit(
        "client.debug",
        `   [\x1b[32mDEBUG\x1b[0m] Events "${_data.name}" est initialiser`
      );
    });
  }

  async interaction() {
    await this.commands();
  }

  async commands() {
    this._events.emit("client.debug", "");
    this._events.emit("client.debug", "\x1b[36mCommands ↓\x1b[0m");
    const commandsFiles = await readdirSync(
      `${this._dirname}/interaction/commands`
    ).filter(
      (fileName) => fileName.endsWith(".js") && fileName.startsWith("command.")
    );
    await commandsFiles.map(async (fileName) => {
      const commandClass = require(`${this._dirname}/interaction/commands/${fileName}`);
      const { _data, execute } = new commandClass();
      await this._client["interaction"]["commands"].push({
        data: _data,
        execute,
      });
      this._events.emit(
        "client.debug",
        `   [\x1b[32mDEBUG\x1b[0m] Commands "${_data.name}" est initialiser`
      );
    });
  }

  async debug() {
    const motd = await readFileSync(`${this._dirname}/motd.txt`, {
      encoding: "utf-8",
    });
    console.log(motd);

    this._events.on("client.debug", (message) => console.log(message));
  }

  async launch() {
    await this._client.login(ENV.BOT_TOKEN);
    this._events.emit("client.debug", "");
    this._events.emit("client.debug", "\x1b[36mOther ↓\x1b[0m");
    this._events.emit(
      "client.debug",
      `   [\x1b[32mDEBUG\x1b[0m] ${this._client.user.tag} est en ligne !`
    );
  }
}

module.exports = clientClass;
