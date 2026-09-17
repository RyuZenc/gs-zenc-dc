import { ChatInputCommandInteraction, Message } from 'discord.js'
import Client from '../Client'
import Events from '../Events'
import SlashMessageBridge, { buildSlashArgs } from '../Module/Command/SlashMessageBridge'
import Cooldown from '../Module/Command/Cooldown'

export default class InteractionCreate extends Events {
  constructor() {
    super('interactionCreate')
  }

  public async run(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    if (!interaction.isChatInputCommand()) return

    const command = client.command.get(interaction.commandName) ||
      client.command.get(client.alias.get(interaction.commandName))

    if (!command) {
      return interaction.reply('command tidak ditemukan.')
    }

    if (!interaction.inCachedGuild()) {
      return interaction.reply('perintah ini hanya bisa digunakan di dalam server!')
    }

    await interaction.deferReply()

    const bridge = await SlashMessageBridge.from(client, interaction)
    const commandName = typeof command.options.name !== 'string'
      ? command.options.name[0]
      : command.options.name

    const isStillCooldown = Cooldown(client, bridge as unknown as Message, command)
    if (isStillCooldown.result && !client.config.owner.includes(interaction.user.id)) {
      return bridge.reply(`please wait until ${isStillCooldown.diff} seconds.`)
    }

    if (command.options.ownerOnly && !client.config.owner.includes(interaction.user.id)) {
      return bridge.reply('this command for owner only.')
    }

    try {
      const args = buildSlashArgs(command, interaction)
      await command.run(client, bridge as unknown as Message, args)
    } catch (error) {
      console.error(error)
      bridge.reply('something wrong with server. Try again later.').catch(_err => undefined)
    } finally {
      if (interaction.deferred && !bridge.responded) {
        interaction.deleteReply().catch(_err => undefined)
      }
      console.log(
        `${interaction.user.username} [${interaction.user.id}] executing "/${commandName}" in <${interaction.guild.name}|${bridge.channel.id}> server.`
      )
    }
  }
}