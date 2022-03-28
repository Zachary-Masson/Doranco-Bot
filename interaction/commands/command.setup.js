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
      name: "setupmenu",
      description: "Commande pour setup le menu pour choisir sa filière !",
      permissions: "ADMINISTRATOR",
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
  execute(events, client, interaction) {
    const { options } = interaction;
    const channel = options.getChannel("channel");
    if (!channel || channel.type !== "GUILD_TEXT")
      return interaction.reply({
        content: "Le Salon choisie n'est pas un salon de type Text !",
        ephemeral: true,
      });

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

    channel.send({
      components: [new MessageActionRow().addComponents(menu)],
    });

    interaction.reply({
      ephemeral: true,
      content: "Le menu a correctement était envoyer !",
    });
  }
}
module.exports = Commands;
