import Client from '../Client'
import Events from '../Events'
import RegisterSlashCommands from '../../Engine/RegisterSlashCommands'

export default class EngineReady extends Events {
  constructor() {
    super('clientReady')
  }

  public async run(client: Client): Promise<any> {
    console.log('Gateway opened!')

    if (client.user) RegisterSlashCommands(client)

    if (process.env.PRODUCTION === 'DEV') {
      console.log(client.command)
      console.log(client.help)
    }
  }
}
