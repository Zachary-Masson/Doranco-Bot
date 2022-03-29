const { Client, Interaction } = require("discord.js");

class Events {
  _data;

  constructor() {
    this._data = {
      name: "interactionCreate",
    };
  }

  /**
   *
   * @param {Object} events
   * @param {Client} client
   * @param {Interaction} interaction
   */

  execute(events, client, interaction) {
    // Start interaction in var client "client.interaction['commands/menus/others']"
    if (interaction.isCommand()) {
      //console.log(interaction.member.permissions.has("ADMINISTRATOR"));
      const { commandName } = interaction;
      const command = client.interaction.commands.filter(
        (cmd) => cmd.data.name === commandName
      )[0];

      if (!command)
        return interaction.reply({
          ephemeral: true,
          content: `"${commandName}" n'existe pas !`,
        });
      events.emit(
        "client.debug.commands",
        commandName,
        interaction.member.user.tag
      );
      if (
        command.data["permissions"] &&
        !interaction.member.permissions.has(command.data["permissions"])
      )
        return interaction.reply({
          ephemeral: true,
          content: "Vous n'avez pas la permissions requise !",
        });
      else {
        command.execute(events, client, interaction);
      }
    } else if (interaction.isSelectMenu()) {
      const { customId } = interaction;
      const menu = client.interaction.menus.filter(
        (menu) => menu.data.customId === customId
      )[0];
      if (!menu) return;
      events.emit("client.debug.menus", customId, interaction.member.user.tag);
      menu.execute(events, client, interaction);
    }
  }
}

module.exports = Events;
