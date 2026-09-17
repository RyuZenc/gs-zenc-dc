import { Message, PermissionFlagsBits } from 'discord.js'
import Command from '../../Command'
import Client from '../../Client'
import MStaffList from '../../Models/StaffList'

export default class AddStaff extends Command {
  constructor() {
    super({
      name: 'managestaff',
      description: 'Tambah/hapus role staff untuk mengeksekusi perintah moderasi.',
      args: [
        { name: 'add|remove', require: true, type: 'BLOCK' },
        { name: 'roleID', require: true, type: 'BLOCK' }
      ],
      example: 'managestaff add 709668494563868695'
    })
  }

  public async run(client: Client, message: Message, args: string[]): Promise<any> {
    const _mode = args[0]
    const roleID = args[1]
    if (!_mode || !roleID) return client.constant.usage(message, this.options.name, this.options.args)
    const mode = _mode.toLowerCase()
    if (!['add', 'remove'].includes(mode)) return client.constant.usage(message, this.options.name, this.options.args)

    const user = await message.guild.members.fetch(message.author.id)
    if (!user) return
    if (!user.permissions.has(PermissionFlagsBits.Administrator) && !client.config.owner.includes(user.id)) {
      return message.reply('hanya ADMIN yang bisa mengeksekusi perintah ini.')
    }

    const role = await message.guild.roles.fetch(roleID)
    if (!role) return message.reply('role tidak ditemukan!')

    // Nambah data
    if (mode === 'add') {
      try {
        const data = await MStaffList.findOne({ where: { serverID: message.guild.id, roleID: roleID } })
        data
          ? await data.update({ serverID: message.guild.id, roleID: roleID })
          : await MStaffList.create({ serverID: message.guild.id, roleID: roleID })
        await message.reply(`<@&${roleID}> berhasil ditambahkan!`)
      } catch (error) {
        message.reply(client.constant.errReason(error))
      }
    }
    // Hapus data
    if (mode === 'remove') {
      try {
        await MStaffList.destroy({
          where: { serverID: message.guild.id, roleID: roleID }
        })
        await message.reply(`<@&${roleID}> berhasil dihapus!`)
      } catch (error) {
        message.reply(client.constant.errReason(error))
      }
    }
  }
}
