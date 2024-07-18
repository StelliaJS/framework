# StelliaJS

## About

StelliaJS is built using Discord JS V14 and TypeScript. It allows you to quickly set up a new bot with a simple and complete architecture.
A CLI is currently being developed and will soon be available for even greater convenience.

## Examples

### Simple client

```js
import { StelliaClient } from "@stelliajs/framework";
import { GatewayIntentBits } from "discord-api-types/v10";
import { Partials } from "discord.js";

const client = new StelliaClient({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Message, Partials.GuildMember]
}, {
    autoCompletes: {
        directoryPath: "./src/interactions/autoCompletes"
    },
    buttons: {
        directoryPath: "./src/interactions/buttons"
    },
    commands: {
        directoryPath: "./src/commands/slash"
    },
    contextMenus: {
        directoryPath: "./src/commands/contextMenus"
    },
    events: {
        directoryPath: "./src/events"
    },
    modals: {
        directoryPath: "./src/interactions/modals"
    },
    selectMenus: {
        directoryPath: "./src/interactions/selectMenus"
    }
});

await client.connect(process.env.TOKEN);
```

### Simple event

```js
import { type StelliaClient, type EventStructure } from "@stelliajs/framework";
import { Events } from "discord.js";

export default {
    data: {
        name: Events.ClientReady,
        once: true
    },
    async execute(client: StelliaClient<true>) { // <true> ensures that the client is Ready
        console.log(`Logged in as ${client.user.tag}`);
        await client.initializeCommands(); // Used to initialise registered commands
    }
} as EventStructure;
```

### Simple command

```js
import { type CommandStructure, type StelliaClient } from "@stelliajs/framework";
import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping"),
    async execute(client: StelliaClient, interaction: ChatInputCommandInteraction<"cached">) { // All interactions are cached
        await interaction.reply("Pong!");
    }
} as CommandStructure;
```


## Help

If you need help with the framework you can open an issue.
