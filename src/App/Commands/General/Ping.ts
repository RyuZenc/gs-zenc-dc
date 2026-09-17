import { Message, TextChannel, EmbedBuilder } from 'discord.js'
import Command from '../../Command'
import Client from '../../Client'
import { checkConnection } from '../../Models/_Connection'

export default class Ping extends Command {
  constructor() {
    super({
      name: ['ping', 'p'],
      description: 'Ping'
    })
  }

  private async getDatabaseLatency() {
    const now = Date.now()
    await checkConnection()
    return Date.now() - now
  }

  private embed(client: Client, description: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(client.config.botColor)
      .setDescription(description)
  }

  public async run(client: Client, message: Message, _args: string[]): Promise<any> {
    const now = Date.now()
    const channel = message.channel as TextChannel
    channel.send({ embeds: [this.embed(client, ':ping_pong: Tunggu sebentar...')] })
      .then(async message => {
        if (!message) return
        const diff = Date.now() - now
        await message.edit({
          embeds: [
            this.embed(client, `:ping_pong: Pong!\nLatency: ${diff} ms\nWebSocket: ${client.ws.ping} ms\nDatabase: ${await this.getDatabaseLatency()} ms`)
          ]
        })
      })
  }
}