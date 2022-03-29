const {
  Client,
  Interaction,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

class Commands {
  _data;
  constructor() {
    this._data = {
      name: "connect",
      description: "Commande pour se connecter",
      options: [
        {
          type: 3,
          name: "surname",
          description: "Votre nom de famille",
          required: true,
        },
        {
          type: 3,
          name: "name",
          description: "Votre prénom",
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
  execute(events, client, interaction) {
    const { options } = interaction;
    const surname = options.getString("surname");
    const name = options.getString("name");

    if (interaction.member.permissions.has("ADMINISTRATOR"))
      return interaction.reply({
        ephemeral: true,
        content:
          "Vous avez une permissions trop importante pour que je puisse changer votre pseudo !",
      });
    interaction.member.setNickname(`${surname} ${name}`);

    const menu = new MessageSelectMenu()
      .setCustomId("choiceFaculty")
      .addOptions({
        label: "DAM = Développeur d'Applications Multimédia",
        value: "DAM",
      })
      .addOptions({
        label: "CDA = Concepteur Développeur d'Applications",
        value: "CDA",
      })
      .addOptions({
        label: "CPW = Chef de Projet Web option DEV",
        value: "CPW",
      })
      .addOptions({
        label: "WD = Web Designer",
        value: "WD",
      })
      .addOptions({
        label: "IMEP = Infographiste Metteur En Page",
        value: "IMEP",
      });

    interaction.reply({
      ephemeral: true,
      content: "Veuillez choisir votre filière !",
      components: [new MessageActionRow().addComponents(menu)],
    });
  }
}
module.exports = Commands;
