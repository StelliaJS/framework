# StelliaJS

## About

StelliaJS is built using Discord JS V14 and TypeScript. It allows you to quickly set up a new bot with a simple and complete architecture.
A CLI is available to help you set up a project with StelliaJS : [link to the CLI](https://github.com/StelliaJS/cli)

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
│   ├── environments/
│   │   ├── environment.development.ts
│   │   ├── environment.model.ts
│   │   └── environment.ts
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
├── stellia.json
└── tsconfig.json
```

## Examples

### Simple client with environment

```js
import { StelliaClient } from "@stelliajs/framework";
import { GatewayIntentBits, Partials } from "discord.js";

const client = new StelliaClient({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Message, Partials.GuildMember]
}, {
    managers: {
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
    },
    environment: {
        isEnvironmentsEnabled: true
    }
});

await client.connect(process.env.TOKEN);
```

### Simple event

#### Ready event with environment
```js
import { type StelliaClient, type EventStructure } from "@stelliajs/framework";
import { Events } from "discord.js";
import { type CustomEnvironment } from "@environments/environment.model.ts";

export default {
    data: {
        name: Events.ClientReady,
        once: true
    },
    async execute(client: StelliaClient<true>, environment: CustomEnvironment) { // <true> ensures that the client is Ready
        console.log(`Logged in as ${client.user.tag}`);
        await client.initializeCommands(); // Used to initialise registered commands
    }
} as EventStructure;
```

#### InteractionCreate event with environment
```js
import { type StelliaClient, type EventStructure } from "@stelliajs/framework";
import { Events, type Interaction } from "discord.js";
import { type CustomEnvironment } from "@environments/environment.model.ts";

export default {
    data: {
        name: Events.InteractionCreate,
        once: false
    },
    async execute(client: StelliaClient<true>, environment: CustomEnvironment, interaction: Interaction) {
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
import { type CustomEnvironment } from "@environments/environment.model.ts";

export default {
    data: new SlashCommandBuilder()
        .setName("ping"),
    async execute(client: StelliaClient, environment: CustomEnvironment, interaction: ChatInputCommandInteraction<"cached">) { // All interactions are cached
        await ephemeralFollowUpResponse(interaction, "Pong!", true); // Response is ephemeral and deleted after 60 seconds
    }
} as CommandStructure;
```


## Help

If you need help with the framework you can open an issue.
