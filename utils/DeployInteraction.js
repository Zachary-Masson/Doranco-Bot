const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const ENV = require("dotenv").config().parsed;
const rest = new REST({ version: "9" }).setToken(ENV.BOT_TOKEN);

class DeployInteraction {
  _client;
  _events;

  constructor(client, events) {
    this._client = client;
    this._events = events;
    this.execute();
  }

  async execute() {
    const Commands = new Array();

    this._client.interaction.commands.map((cmd) => Commands.push(cmd.data));
    await (async () => {
      try {
        this._events.emit("client.debug.title", "DeployCommands");
        this._events.emit(
          "client.debug",
          "   [\x1b[32mDEBUG\x1b[0m] Lancement du deploiment des commandes."
        );
        await rest.put(Routes.applicationCommands(this._client.user.id), {
          body: Commands,
        });

        this._events.emit(
          "client.debug",
          "   [\x1b[32mDEBUG\x1b[0m] Le deploiment des commandes ce sont fais avec succès.\n"
        );
      } catch (error) {
        console.log(error);
        console.log(
          "[\x1b[31mERROR\x1b[0m] Une erreur est survenue pendant le deploiment des commandes."
        );
        process.exit(1);
      }
    })();
  }
}

module.exports = DeployInteraction;
