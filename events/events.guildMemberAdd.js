const { GuildMember } = require("discord.js");
const CONFIG = require("../config.json");

class Events {
  _data;

  constructor() {
    this._data = {
      name: "guildMemberAdd",
    };
  }

  /**
   *
   * @param {Object} events
   * @param {GuildMember} member
   */
  execute(events, client, member) {
    member.send(CONFIG.welcome_message);
  }
}

module.exports = Events;
