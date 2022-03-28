const { Client, Interaction } = require("discord.js");

class Commands {
  _data;
  constructor() {
    this._data = {
      name: "setupMenu",
      description: "Commande pour setup le menu pour choisir sa filière !",
      options: [
        {
          type: 7,
          name: "channel",
          description: "Salon ou le menu va être envoyer",
          required: true,
        },
      ],
    };
  }

  /**
   *
   * @param {Object} events
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute(events, client, interaction) {}
}
module.exports = Commands;
