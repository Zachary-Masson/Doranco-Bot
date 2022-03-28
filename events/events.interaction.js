const { Interaction } = require("discord.js");

class Events {
  _data;

  constructor() {
    this._data = {
      name: "interactionCreate",
    };
  }

  execute(events, client, interaction) {
    // Start interaction in var client "client.interaction['commands/menus/others']"
  }
}

module.exports = Events;
