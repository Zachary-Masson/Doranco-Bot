const ENV = require("dotenv").config().parsed;
const CONFIG = require("../config.json");
const { Client, Intents } = require("discord.js");
const { readFileSync, readdirSync } = require("fs");
const moment = require("moment");
const DeployInteractionClass = require("./DeployInteraction");

moment.locale("fr", {
  months:
    "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split(
      "_"
    ),
  monthsShort:
    "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
  monthsParseExact: true,
  weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
  weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
  weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "DD/MM/YYYY",
    LL: "D MMMM YYYY",
    LLL: "D MMMM YYYY HH:mm",
    LLLL: "dddd D MMMM YYYY HH:mm",
  },
  calendar: {
    sameDay: "[Aujourd’hui à] LT",
    nextDay: "[Demain à] LT",
    nextWeek: "dddd [à] LT",
    lastDay: "[Hier à] LT",
    lastWeek: "dddd [dernier à] LT",
    sameElse: "L",
  },
  relativeTime: {
    future: "dans %s",
    past: "il y a %s",
    s: "quelques secondes",
    m: "une minute",
    mm: "%d minutes",
    h: "une heure",
    hh: "%d heures",
    d: "un jour",
    dd: "%d jours",
    M: "un mois",
    MM: "%d mois",
    y: "un an",
    yy: "%d ans",
  },
  dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
  ordinal: function (number) {
    return number + (number === 1 ? "er" : "e");
  },
  meridiemParse: /PD|MD/,
  isPM: function (input) {
    return input.charAt(0) === "M";
  },
  // In case the meridiem units are not separated around 12, then implement
  // this function (look at locale/id.js for an example).
  // meridiemHour : function (hour, meridiem) {
  //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
  // },
  meridiem: function (hours, minutes, isLower) {
    return hours < 12 ? "PD" : "MD";
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4, // Used to determine first week of the year.
  },
});

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
    await this.launch();
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
    new DeployInteractionClass(this._client, this._events);
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

    this._events.on("client.debug.title", (message) =>
      console.log(`\n\x1b[36m${message} ↓\x1b[0m`)
    );
    this._events.on("client.debug", (message) => console.log(message));

    if (CONFIG.debug_commands) {
      this._events.on("client.debug.commands", (commandName, userTag) => {
        console.log(
          `   [\x1b[33mCommands\x1b[0m] '\x1b[33m${commandName}\x1b[0m' par <\x1b[34m${userTag}\x1b[0m> le ${moment().format(
            "L [à] LT"
          )}`
        );
      });
    }
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
