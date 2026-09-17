import { Message, EmbedBuilder, TextChannel } from 'discord.js'
import Command from '../../Command'
import Client from '../../Client'
import { IMenu } from '../../../@Types/Moderation/Punishment'

export default class PunishmentList extends Command {
  constructor() {
    super({
      name: 'listpunishment',
      description: 'Daftar Punishment yang mungkin kalian tidak tau di server ini.',
      args: [
        { name: 'menu', require: false, type: 'BLOCK' }
      ],
      example: 'listpunishment warn'
    })
  }

  private menu: { [key: string]: IMenu } = {
    warn: {
      description: 'Hukuman ini kamu dapatkan dikarenakan melanggar suatu peraturan/mengganggu member lain di server ini.',
      whyGetPunishment: 'Diberikan oleh staff secara langsung atau dari laporan member.',
      counting: [
        { counter: 3, fallback: '3 jam mute/bungkam' },
        { counter: 4, fallback: '1 hari mute/bungkam' },
        { counter: 5, fallback: 'Kick/tendang' },
        { counter: 7, fallback: 'Banned' },
        { counter: 9, fallback: 'Banned' }
      ]
    },
    badword: {
      description: 'Hukuman ini kamu dapatkan dikarenakan memakai badword yang berlebihan.',
      whyGetPunishment: 'Autowarn.',
      counting: [
        { counter: 3, fallback: '1 jam mute/bungkam' },
        { counter: 5, fallback: '5 jam mute/bungkam' },
        { counter: 7, fallback: '12 jam mute/bungkam' },
        { counter: 9, fallback: '1 hari mute/bungkam' },
        { counter: 10, fallback: '3 hari mute/bungkam dan seterusnya' },
      ]
    },
    invite: {
      description: 'Hukuman ini kamu dapatkan dikarenakan mengirimkan Discord Invite Link.',
      whyGetPunishment: 'Anti Discord Link.',
      counting: [
        { counter: 1, fallback: '2 jam mute/bungkam dan seterusnya' }
      ]
    }
  }

  public async run(client: Client, message: Message, args: string[]): Promise<any> {
    const plMenu = args[0]
    const categoryMenu = Object.keys(this.menu)
    const embed = new EmbedBuilder()
      .setColor(client.config.botColor)
      .setTimestamp()
      .setFooter({ text: `Diminta oleh ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
      .setThumbnail(client.user.displayAvatarURL())

    if (!plMenu) {
      embed
        .setTitle('Librari Punishment/Hukuman')
        .setDescription(
          `Librari ini berisi bagaimana efek dari sebuah hukuman di server ini, silahkan memilih menu di bawah ini dengan cara \`${client.config.botPrefix}${this.options.name as string} [menu]\`.`
        )
        .addFields([{ name: 'Menu', value: `\`${categoryMenu.join('`, `')}\``, inline: false }])
    } else {
      const menu = plMenu.toLowerCase()
      if (!categoryMenu.includes(menu)) return message.reply('menu tidak valid.')
      const list = this.menu[menu]

      embed
        .setTitle(`Deskripsi hukuman untuk ${menu}`)
        .setDescription(list.description)
        .addFields([
          { name: 'Mengapa kamu mendapatkannya', value: list.whyGetPunishment, inline: false },
          { name: 'Hitungannya', value: list.counting.map(c => `Ke-${c.counter}: ${c.fallback}`).join('\n'), inline: false }
        ])
    }

    await (message.channel as TextChannel).send({ content: `<@!${message.author.id}>`, embeds: [embed] })
  }
}
