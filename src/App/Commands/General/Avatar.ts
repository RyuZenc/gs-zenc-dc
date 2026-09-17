import { Message, TextChannel } from 'discord.js'
import Command from '../../Command'
import Client from '../../Client'

export default class Avatar extends Command {
  constructor() {
    super({
      name: 'avatar',
      description: 'Liat avatar.',
      args: [
        { name: 'uID|mention', require: true, type: 'BLOCK' }
      ],
      example: 'userinfo <@!709668494563868695>'
    })
  }

  public async run(client: Client, message: Message, args: string[]): Promise<any> {
    const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]) || message.author
    if (!user) return client.constant.usage(message, this.options.name, this.options.args)
    const member = message.guild.members.cache.get(user.id)
    if (!member) return message.reply('member tidak ditemukan!')

    const channel = message.channel as TextChannel
    channel.send(`Link: ${member.user.displayAvatarURL({ extension: 'png' })}`)
  }
}
