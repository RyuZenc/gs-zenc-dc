import {
  ChatInputCommandInteraction,
  Collection,
  Guild,
  GuildChannel,
  GuildMember,
  User,
  Role,
  TextChannel,
InteractionEditReplyOptions
} from 'discord.js'
import Client from '../../Client'
import Command from '../../Command'

export const sanitizeArgName = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 32)

export const buildSlashArgs = (command: Command, interaction: ChatInputCommandInteraction): string[] => {
  const args: string[] = []
  if (!command.options.args) return args
  for (const arg of command.options.args) {
    const value = interaction.options.getString(sanitizeArgName(arg.name))
    if (value === null) continue
    args.push(arg.type === 'FLAG' ? `--${arg.name}=${value}` : value)
  }
  return args
}

export default class SlashMessageBridge {
  public readonly interaction: ChatInputCommandInteraction
  public readonly guild: Guild
  public readonly author: User
  public readonly id: string
  public readonly createdTimestamp: number
  public content: string
  public responded = false
  public mentions = {
    users: new Collection<string, User>(),
    members: new Collection<string, GuildMember>(),
    channels: new Collection<string, GuildChannel>(),
    roles: new Collection<string, Role>()
  }
  private readonly client: Client

  private constructor(client: Client, interaction: ChatInputCommandInteraction) {
    this.client = client
    this.interaction = interaction
    this.guild = interaction.guild
    this.author = interaction.user
    this.id = interaction.id
    this.createdTimestamp = interaction.createdTimestamp
    this.content = [
      interaction.commandName,
      ...interaction.options.data.map(option => option.value ?? '').filter(value => value !== '')
    ].join(' ')
  }

  public static async from(client: Client, interaction: ChatInputCommandInteraction): Promise<SlashMessageBridge> {
    const bridge = new SlashMessageBridge(client, interaction)
    await bridge.resolveMentions()
    return bridge
  }

  get channel(): TextChannel {
    return this.interaction.channel as TextChannel
  }

  public async reply(payload: string | InteractionEditReplyOptions): Promise<void> {
    this.responded = true
    await this.interaction.editReply(payload).catch(err => this.swallow(err))
  }

  public async react(emoji: any): Promise<void> {
    this.responded = true
    await this.interaction.followUp(String(emoji)).catch(err => this.swallow(err))
  }

  public async delete(): Promise<void> {
    this.responded = true
    await this.interaction.deleteReply().catch(err => this.swallow(err))
  }

  private swallow(error: any): void {
    if (error && typeof error.code === 'number' && (error.code === 10008 || error.code === 10062)) {
      return
    }
    console.error(error)
  }

  private async resolveMentions(): Promise<void> {
    const guild = this.guild
    if (!guild) return

    const values = this.interaction.options.data.map(option => option.value).filter(value => typeof value === 'string') as string[]

    for (const value of values) {
      const userMatch = /<@!?(\d+)>/.exec(value)
      const roleMatch = /<@&(\d+)>/.exec(value)
      const channelMatch = /<#(\d+)>/.exec(value)
      const plainId = /^\d+$/.test(value.trim()) ? value.trim() : undefined

      if (userMatch) {
        await this.resolveUser(userMatch[1])
        await this.resolveMember(userMatch[1])
      } else if (plainId) {
        await this.resolveUser(plainId)
        await this.resolveMember(plainId)
      }

      if (roleMatch) await this.resolveRole(roleMatch[1])
      if (channelMatch) await this.resolveChannel(channelMatch[1])
    }
  }

  private async resolveUser(id: string): Promise<void> {
    const user = this.client.users.cache.get(id) || await this.client.users.fetch(id).catch(() => null)
    if (user) this.mentions.users.set(id, user)
  }

  private async resolveMember(id: string): Promise<void> {
    const member = this.guild.members.cache.get(id) || await this.guild.members.fetch(id).catch(() => null)
    if (member) this.mentions.members.set(id, member)
  }

  private async resolveRole(id: string): Promise<void> {
    const role = this.guild.roles.cache.get(id) || await this.guild.roles.fetch(id).catch(() => null)
    if (role) this.mentions.roles.set(id, role)
  }

  private async resolveChannel(id: string): Promise<void> {
    const channel = this.guild.channels.cache.get(id) || await this.guild.channels.fetch(id).catch(() => null)
    if (channel) this.mentions.channels.set(id, channel)
  }
}