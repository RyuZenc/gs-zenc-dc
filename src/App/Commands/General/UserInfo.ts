import { Message, EmbedBuilder, PresenceStatus, TextChannel } from 'discord.js'
import Command from '../../Command'
import Client from '../../Client'
import Moment from 'moment'

export default class UserInfo extends Command {
  constructor() {
    super({
      name: ['userinfo', 'uinfo'],
      description: 'Liat informasi dari user yang dituju/user kamu.',
      args: [
        { name: 'uID|mention', require: true, type: 'BLOCK' }
      ],
      example: 'userinfo <@!709668494563868695>'
    })
  }

  private setColorPresence(presence: PresenceStatus) {
    const ret = { color: 0, pretty: '' }
    switch (presence) {
      case 'online':
        ret.color = 0x00ff00
        ret.pretty = 'Online'
        break
      case 'offline':
        ret.color = 0x858585
        ret.pretty = 'Offline'
        break
      case 'idle':
        ret.color = 0xffff00
        ret.pretty = 'AFK'
        break
      case 'dnd':
        ret.color = 0xff0000
        ret.pretty = 'Sibuk'
        break
    }
    return ret
  }

  public async run(client: Client, message: Message, args: string[]): Promise<any> {
    const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author
    if (!user) return client.constant.usage(message, this.options.name, this.options.args)
    const member = message.guild.members.cache.get(user.id)
    if (!member) return message.reply('member tidak ditemukan!')

    const presenceStatus = member.presence ? member.presence.status : 'offline'
    const embed = new EmbedBuilder()
      .setColor(this.setColorPresence(presenceStatus).color)
      .setTimestamp()
      .setFooter({ text: `Direquest oleh ${message.author.username}`, iconURL: client.user.displayAvatarURL() })
      .setThumbnail(member.user.displayAvatarURL())
      .setTitle(`${member.user.username} [${member.id}]`)
      .addFields([
        {
          name: 'Panggilan',
          value: member.nickname || 'Tidak ada panggilan',
          inline: false
        },
        {
          name: 'Status',
          value: `${this.setColorPresence(presenceStatus).pretty}` +
            `${!member.voice.channelId ? '' : ` (Sedang ngobrol di ${!member.voice.channel ? 'server lain.' : member.voice.channel.name})`}`,
          inline: true
        },
        {
          name: 'Role Tertinggi',
          value: `<@&${member.roles.highest.id}>`,
          inline: true
        },
        {
          name: 'Akun Dibuat',
          value: Moment(member.user.createdAt).utcOffset('+08:00').format('dddd, DD MMMM YYYY (HH:mm:ss [WITA])'),
          inline: false
        },
        {
          name: `Masuk di ${message.guild.name}`,
          value: Moment(member.joinedAt).utcOffset('+08:00').format('dddd, DD MMMM YYYY (HH:mm:ss [WITA])'),
          inline: false
        }
      ])

    const channel = message.channel as TextChannel
    channel.send({ content: `<@!${message.author.id}>`, embeds: [embed] })
  }
}
