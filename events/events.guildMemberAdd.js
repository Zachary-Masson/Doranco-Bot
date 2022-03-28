const { GuildMember } = require("discord.js");

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
  execute(events, client, member) {}
}

module.exports = Events;
