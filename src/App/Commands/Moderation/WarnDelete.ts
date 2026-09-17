import { Message, PermissionFlagsBits } from 'discord.js'
import Command from '../../Command'
import Client from '../../Client'
import MWarnList from '../../Models/WarnList'
import { ifStaff as IfStaff } from '../../Module/Moderation/StaffList'

export default class WarnDelete extends Command {
  constructor() {
    super({
      name: 'warndelete',
      description: 'Hapus warnlistnya.',
      args: [
        { name: 'userID|mention', require: false, type: 'BLOCK' }
      ],
      example: 'warnlist 709668494563868695'
    })
  }

  public async run(client: Client, message: Message, args: string[]): Promise<any> {
    const _member = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author
    const member = message.guild.members.cache.get(_member.id)
    const momod = await message.guild.members.fetch(message.author.id)

    const ifStaff = await IfStaff(momod)
    if (!ifStaff) {
      if (!momod.permissions.has(PermissionFlagsBits.Administrator)) {
        return message.reply('anda tidak memiliki ijin untuk menggunakan command ini!')
      }
    }

    try {
      const data = await MWarnList.destroy({
        where: {
          serverID: member.guild.id,
          memberID: member.id
        }
      })
      await message.reply(
        data
          ? `warn untuk <@!${member.id}> berhasil dihapus!`
          : `warn untuk <@!${member.id}> masih kosong!`
      )
    } catch (error) {
      message.reply(client.constant.errReason(error))
    }
  }
}
