# StelliaJS

## About

StelliaJS is built using Discord JS V14 and TypeScript. It allows you to quickly set up a new bot with a simple and complete architecture.
A CLI is currently being developed and will soon be available for even greater convenience.

## Architecture
Recommended architecture for StelliaJS project.
```
.
├── dist // Build folder
├── src/
│   ├── commands/
│   │   ├── contextMenus/
│   │   │   └── mute.ts
│   │   └── slash/
│   │       ├── moderation // You can create folders, everything is loaded recursively
│   │       │   ├── ban.ts
│   │       │   └── mute.ts
│   │       └── ping.ts
│   ├── events/
│   │   ├── ready.ts
│   │   └── interactionCreate.ts
│   ├── interactions/
│   │   ├── autoCompletes/
│   │   │   └── song.ts
│   │   ├── buttons/
│   │   │   └── colorChoice.ts
│   │   ├── modals/
│   │   │   └── form.ts
│   │   └── selectMenus/
│   │       └── settings.ts
│   ├── environment.d.ts
│   └── index.ts
├── .env
├── package.json
├── package-lock.json
└── tsconfig.json
```
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
        directoryPath: "./interactions/autoCompletes"
    },
    buttons: {
        directoryPath: "./interactions/buttons"
    },
    commands: {
        directoryPath: "./commands/slash"
    },
    contextMenus: {
        directoryPath: "./commands/contextMenus"
    },
    events: {
        directoryPath: "./events"
    },
    modals: {
        directoryPath: "./interactions/modals"
    },
    selectMenus: {
        directoryPath: "./interactions/selectMenus"
    }
});

await client.connect(process.env.TOKEN);
```

### Simple event

#### Ready event
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

#### InteractionCreate event
```js
import { type StelliaClient, type EventStructure } from "@stelliajs/framework";
import { Events, type Interaction } from "discord.js";

export default {
    data: {
        name: Events.InteractionCreate,
        once: false
    },
    async execute(client: StelliaClient<true>, interaction: Interaction) {
        if (interaction.inCachedGuild()) {
            await client.handleInteraction(interaction); // Automatic interaction handling
        }
    }
} as EventStructure;
```

### Simple command

```js
import { type CommandStructure, ephemeralFollowUpResponse, type StelliaClient } from "@stelliajs/framework";
import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("ping"),
    async execute(client: StelliaClient, interaction: ChatInputCommandInteraction<"cached">) { // All interactions are cached
        await ephemeralFollowUpResponse(interaction, "Pong!", true); // Response is ephemeral and deleted after 60 seconds
    }
} as CommandStructure;
```


## Help

If you need help with the framework you can open an issue.
