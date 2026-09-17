import { Message, ChannelType, PermissionFlagsBits, TextChannel } from 'discord.js'
import Command from '../../Command'
import Client from '../../Client'
import { ifStaff as IfStaff } from '../../Module/Moderation/StaffList'

export default class Prune extends Command {
  constructor() {
    super({
      name: 'prune',
      description: 'Prune message dalam channel.',
      args: [
        { name: 'amount', require: true, type: 'BLOCK' }
      ],
      example: 'prune 20'
    })
  }

  public async run(client: Client, message: Message, args: string[]): Promise<any> {
    const executor = await message.guild.members.fetch(message.author.id)
    const amount = parseInt(args[0])
    if (!amount) return client.constant.usage(message, this.options.name, this.options.args)

    const ifStaff = await IfStaff(executor)
    if (!ifStaff) {
      if (!executor.permissions.has(PermissionFlagsBits.Administrator)) {
        return message.reply('anda tidak memiliki ijin untuk menggunakan command ini!')
      }
    }

    await message.delete()
    const channel = message.channel as TextChannel
    if (channel.type !== ChannelType.GuildText) return message.reply('perintah ini hanya dapat digunakan di Text Channel server.')
    try {
      await channel.bulkDelete(amount)
      const feedback = await channel.send(`Berhasil menghapus pesan sebanyak ${amount} pesan.`)
      setTimeout(() => feedback.delete().catch(() => undefined), 3000)
    } catch (error) {
      channel.send(client.constant.errReason(error)).catch(() => undefined)
    }
  }
}
