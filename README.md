# StelliaJS

## Accbout

StelliaJS is built using Discord JS V14 and TypeScript. It allows you to quickly set up a new bot with a simple and complete architecture.
A CLI is available to help you set up a project with StelliaJS : [link to the CLI](https://github.com/StelliaJS/cli)

## Architecture

Recommended architecture for StelliaJS project.

```
.
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
├── pnpm-lock.yaml
├── stellia.json
└── tsconfig.json
```

## Examples

### Simple client with environment

#### Client initialization
```ts
import { StelliaClient } from "@stelliajs/framework";
import { GatewayIntentBits, Partials } from "discord.js";

(async () => {
    const client = new StelliaClient({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers
        ],
        partials: [Partials.Message, Partials.GuildMember]
    },
    {
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
            areGuildsConfigurationEnabled: true
        }
    });

    await client.connect(process.env.TOKEN);
})();
```

#### Environment model

```ts
import {
    BaseGeneralConfiguration,
    BaseGuildConfiguration,
    GuildConfiguration,
    GuildsConfiguration
} from "@stelliajs/framework";
import { Snowflake } from "discord.js";

interface MyBotGeneralConfiguration extends BaseGeneralConfiguration {
    botName: string;
}
interface MyBotSpecificGuildConfiguration extends BaseGuildConfiguration {
    channels: {
        logs: Snowflake;
        welcome: Snowflake;
    };
}

export interface MyBotGuildConfiguration extends GuildConfiguration {
    general: MyBotGeneralConfiguration;
    guild: MyBotSpecificGuildConfiguration;
}

export interface MyBotGuildsConfiguration extends GuildsConfiguration {
    general: MyBotGeneralConfiguration;
    guilds: {
        [guildId: Snowflake]: MyBotSpecificGuildConfiguration;
    };
}
```

### Interactions/Events with environment

#### Ready event

```ts
import { type EventStructure, type StelliaClient } from "@stelliajs/framework";
import { Events } from "discord.js";
import { type MyBotGuildsConfiguration } from "@environments/environment.model.ts";

export default {
    data: {
        name: Events.ClientReady,
        once: true
    },
    async execute(client: StelliaClient<true>, guildsConfiguration: MyBotGuildsConfiguration) { // <true> ensures that the client is Ready
        console.log(`Logged in as ${client.user.tag}`);
        await client.initializeCommands(); // Used to initialise registered commands
    }
} satisfies EventStructure;
```

#### InteractionCreate event

```ts
import { type StelliaClient, type EventStructure } from "@stelliajs/framework";
import { Events, type Interaction } from "discord.js";
import { type MyBotGuildConfiguration } from "@environments/environment.model.ts";

export default {
    data: {
        name: Events.InteractionCreate,
        once: false
    },
    async execute(client: StelliaClient<true>, guildConfiguration: MyBotGuildConfiguration, interaction: Interaction) {
        if (interaction.inCachedGuild()) {
            await client.handleInteraction(interaction); // Automatic interaction handling
        }
    }
} satisfies EventStructure;
```

#### Command interaction

```ts
import { type CommandStructure, type StelliaClient } from "@stelliajs/framework";
import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { type MyBotGuildConfiguration } from "@environments/environment.model.ts";

export default {
    data: {
        command: new SlashCommandBuilder()
            .setName("ping"),
        reply: {
            autoDefer: true, // Defer the reply to avoid the interaction failing after 3 seconds
            ephemeral: true, // The reply will be visible only by the user who triggered the interaction
        }
    },
    async execute(client: StelliaClient, guildConfiguration: MyBotGuildConfiguration, interaction: ChatInputCommandInteraction<"cached">) { // All interactions are cached
        await interaction.editReply("Pong!");
    }
} satisfies CommandStructure;
```

## Help

If you need help with the framework you can open an issue.
