import Client from './App/Client'
import LoadEvents from './Engine/LoadEvents'
import LoadCommand from './Engine/LoadCommand'
import ConsoleStamp from 'console-stamp'
import Moment from 'moment'
import { GatewayIntentBits, Partials } from 'discord.js'
import 'dotenv/config'

ConsoleStamp(console)

Moment.locale('id')

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.User, Partials.GuildMember]
})

LoadEvents(client)
LoadCommand(client)

client.login(process.env.PRODUCTION === 'DEV' ? process.env.TOKEN_DEV : process.env.TOKEN)
