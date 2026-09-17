import Client from '../Client'
import Events from '../Events'
import { ActivityType } from 'discord.js'

export default class EngineStatusGame extends Events {
  constructor() {
    super('clientReady')
  }

  public async run(client: Client): Promise<any> {
    setInterval(() => {
      const state = client.state
      if (state.presence.status) {
        const msg = state.presence.message[Math.floor(Math.random() * state.presence.message.length)]
        if (client.user) {
          client.user.setPresence({
            activities: [{
              name: `${client.config.botPrefix}help | ${msg}`,
              type: ActivityType.Playing
            }]
          })
        }
      }
    }, client.state.presence.interval)
  }
}
