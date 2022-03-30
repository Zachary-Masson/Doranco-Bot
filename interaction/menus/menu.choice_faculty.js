const {
  Client,
  Interaction,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

class Menu {
  _data;
  constructor() {
    this._data = {
      customId: "choiceFaculty",
    };
  }

  /**
   *
   * @param {Object} events
   * @param {Client} client
   * @param {Interaction} interaction
   */
  execute(events, client, interaction) {
    const faculty = interaction.values[0];

    interaction.member.setNickname(
      `${interaction.member.nickname} | ${faculty}`
    );
    interaction.reply({
      ephemeral: true,
      content:
        "Votre filière a était affecter, une demande de vérification à était envoyer !",
    });
  }
}
module.exports = Menu;
