import { Message, EmbedBuilder, GuildVerificationLevel, ChannelType, TextChannel } from 'discord.js'
import Command from '../../Command'
import Client from '../../Client'
import Moment from 'moment'

export default class ServerInfo extends Command {
  constructor() {
    super({
      name: ['serverinfo', 'server'],
      description: 'Liat informasi dari server ini.'
    })
  }

  private verificationLevel(guild: GuildVerificationLevel): string {
    let ret = ''
    switch (guild) {
      case GuildVerificationLevel.None:
        ret = 'Tidak ada verifikasi.'
        break
      case GuildVerificationLevel.Low:
        ret = 'Rendah (Verifikasi email Discord).'
        break
      case GuildVerificationLevel.Medium:
        ret = 'Menengah (Terdaftar di Discord selama 5 menit).'
        break
      case GuildVerificationLevel.High:
        ret = 'Tinggi (Menjadi member server selama 10 menit).'
        break
      case GuildVerificationLevel.VeryHigh:
        ret = 'Sangat Tinggi (Harus verifikasi nomor telepon di Discord).'
        break
    }
    return ret
  }

  public async run(client: Client, message: Message, _args: string[]): Promise<any> {
    const guild = message.guild
    
    const embed = new EmbedBuilder()
      .setColor(client.config.botColor)
      .setTimestamp()
      .setFooter({ text: `Direquest oleh ${message.author.username}`, iconURL: client.user.displayAvatarURL() })
      .setThumbnail(guild.iconURL())
      .setTitle(`[${guild.nameAcronym}] ${guild.name}`)

      .addFields([
        {
          name: 'Level Verifikasi',
          value: this.verificationLevel(guild.verificationLevel),
          inline: false
        },
        {
          name: 'Lokasi',
          value: guild.preferredLocale,
          inline: true
        },
        {
          name: 'Anggota Server',
          value: `${guild.members.cache.size} orang`,
          inline: true
        },
        {
          name: `Kanal [${guild.channels.cache.size}]`,
          value: `${guild.channels.cache.filter(g => g.type === ChannelType.GuildCategory).size} Kategori\n` +
            `${guild.channels.cache.filter(g => g.type === ChannelType.GuildText).size} Kanal Teks\n` +
            `${guild.channels.cache.filter(g => g.type === ChannelType.GuildVoice).size} Kanal Suara`,
          inline: true
        },
        {
          name: `Pemilik Server`,
          value: `<@!${guild.ownerId}>`,
          inline: true
        },
        {
          name: `Tanggal Dibuat`,
          value: Moment(guild.createdAt).utcOffset('+08:00').format('dddd, DD MMMM YYYY (HH:mm:ss [WITA])'),
          inline: false
        }
      ])

    const channel = message.channel as TextChannel
    channel.send({ content: `<@!${message.author.id}>`, embeds: [embed] })
  }
}
