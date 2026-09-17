import { REST, Routes, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js'
import Client from '../App/Client'
import { sanitizeArgName } from '../App/Module/Command/SlashMessageBridge'

export default async (client: Client): Promise<void> => {
  const builders = client.command.map(command => {
    const builder = new SlashCommandBuilder()
    const name = typeof command.options.name !== 'string'
      ? command.options.name[0]
      : command.options.name
    builder
      .setName(name.toLowerCase())
      .setDescription((command.options.description || 'No description').slice(0, 100))

    const options = (command.options.args || []).map(arg => {
      const option = new SlashCommandStringOption()
        .setName(sanitizeArgName(arg.name))
        .setDescription(arg.name.slice(0, 100))
      if (arg.type === 'BLOCK' && arg.require) option.setRequired(true)
      return option
    })
    options.sort((a, b) => (a.required ? 0 : 1) - (b.required ? 0 : 1))
    for (const option of options) builder.addStringOption(option)
    return builder.toJSON()
  })

  const token = process.env.PRODUCTION === 'DEV' ? process.env.TOKEN_DEV : process.env.TOKEN
  const rest = new REST({ version: '10' }).setToken(token)

  const guildId = process.env.GUILD_ID
  const route = guildId
    ? Routes.applicationGuildCommands(client.user.id, guildId)
    : Routes.applicationCommands(client.user.id)

  console.log(`Registering ${builders.length} slash command${builders.length > 1 ? 's' : ''} against ${guildId ? 'guild ' + guildId : 'global'} scope...`)
  try {
    await rest.put(route, { body: builders })
    console.log('Slash commands registered successfully!')
  } catch (error) {
    console.error(error)
  }
}