import Client from '../Client'
import Events from '../Events'
import { Message, EmbedBuilder, TextChannel, ChannelType } from 'discord.js'

export default class GSPMessageDelete extends Events {
  constructor() {
    super('messageDelete')
  }

  public async run(client: Client, message: Message): Promise<any> {
    if (message.channel.type !== ChannelType.GuildText) return
    if (message.author.bot) return
    if (message.guild.id !== '302655971946135554') return

    const guild = client.guilds.cache.get('302655971946135554')
    if (!guild) return
    const channel = guild.channels.cache.get('714821103360409631') as TextChannel
    if (!channel) return
    if (channel.type !== ChannelType.GuildText) return

    const embed = new EmbedBuilder()
      .setAuthor({ name: `${message.author.username} [${message.author.id}]`, iconURL: message.author.displayAvatarURL() })
      .addFields([
        { name: 'Channel', value: `<#${message.channel.id}>`, inline: false },
        { name: 'Content', value: message.content.length > 0 ? message.content : 'Tidak ada konten', inline: false }
      ])
      .setTimestamp()

    const mentioned = []
    message.mentions.members.forEach(men => mentioned.push(`<@!${men.id}>`))
    message.mentions.roles.forEach(men => mentioned.push(`<@&${men.id}>`))

    channel.send({ content: mentioned.length > 0 ? `Mentioned: ${mentioned.join(' | ')}` : '', embeds: [embed] })
  }
}
