import {
  Message,
  PermissionFlagsBits,
  TextChannel,
  DMChannel,
  EmbedBuilder,
} from "discord.js";
import Command from "../../Command";
import Client from "../../Client";
import { CaptchaGenerator } from "captcha-canvas";
import { ifStaff as IfStaff } from "../../Module/Moderation/StaffList";
import MRegisterRole from "../../Models/RegisterRole";

export default class Register extends Command {
  constructor() {
    super({
      name: "register",
      description: "Dapatkan role Membermu di sini!",
      args: [{ name: "roleID", require: false, type: "BLOCK" }],
    });
  }

  private embed(client: Client, description: string): EmbedBuilder {
    return new EmbedBuilder()
      .setColor(client.config.botColor)
      .setDescription(description);
  }

  public async run(
    client: Client,
    message: Message,
    args: string[],
  ): Promise<any> {
    const libraryString = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".split("");
    const sizeCaptcha = 6;
    let generateCaptchaString = "";
    for (let i = 0; i < sizeCaptcha; i++) {
      generateCaptchaString +=
        libraryString[Math.floor(Math.random() * libraryString.length)];
    }
    const captchaString = generateCaptchaString.toLowerCase();
    const captcha = new CaptchaGenerator()
      .setDimension(300, 300)
      .setCaptcha({ size: 60, color: "deeppink", text: generateCaptchaString, skew: false })
      .setDecoy({ opacity: 0 })
      .setTrace({ opacity: 0 });

    if (args.length > 0) {
      const roleMatch = /<@&(\d+)>/.exec(args[0]);
      const role = message.guild.roles.cache.get(
        roleMatch ? roleMatch[1] : args[0],
      );
      if (!role)
        return message.reply({
          embeds: [this.embed(client, "role tidak ditemukan!")],
        });

      const momod = await message.guild.members.fetch(message.author.id);
      if (!momod)
        return message.reply({
          embeds: [this.embed(client, "gagal mengambil data member anda.")],
        });
      const ifStaff = await IfStaff(momod);
      if (!ifStaff) {
        if (!momod.permissions.has(PermissionFlagsBits.Administrator)) {
          return message.reply({
            embeds: [
              this.embed(
                client,
                "anda tidak memiliki ijin untuk menggunakan command ini!",
              ),
            ],
          });
        }
      }

      try {
        const regist = await MRegisterRole.findOne({
          where: { serverID: message.guild.id },
        });
        if (!regist) {
          await MRegisterRole.create({
            serverID: message.guild.id,
            roleID: role.id,
          });
          client.state.register.set(message.guild.id, role.id);
        } else {
          await MRegisterRole.update(
            { roleID: role.id },
            {
              where: { serverID: message.guild.id },
            },
          );
          client.state.register.delete(message.guild.id);
          client.state.register.set(message.guild.id, role.id);
        }
        await message.reply({
          embeds: [
            this.embed(
              client,
              `**${role.name}** berhasil dijadikan role Member!`,
            ),
          ],
        });
      } catch (error) {
        message.reply({
          embeds: [this.embed(client, client.constant.errReason(error))],
        });
      }
    } else {
      const _role = client.state.register.get(message.guild.id);
      if (!_role)
        return message.reply({
          embeds: [
            this.embed(
              client,
              "role Member belum diatur di server ini. Minta admin menjalankan `/register <roleID>` terlebih dahulu.",
            ),
          ],
        });
      const role = message.guild.roles.cache.get(_role);
      if (!role)
        return message.reply({
          embeds: [
            this.embed(
              client,
              "role Member yang diatur sudah tidak ada. Minta admin menjalankan `/register <roleID>` lagi.",
            ),
          ],
        });
      const member = message.guild.members.cache.get(message.author.id);
      if (!member)
        return message.reply({
          embeds: [this.embed(client, "gagal mengambil data member anda.")],
        });
      if (member.roles.cache.filter((r) => r.id === role.id).size > 0)
        return message.reply({
          embeds: [this.embed(client, "Anda sudah terregistrasi!")],
        });

      await message.reply({
        embeds: [this.embed(client, "cek DM kamu sekarang!")],
      });
      await message.author
        .send({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.botColor)
              .setDescription(
                "Kamu memiliki waktu 1 menit untuk menyelesaikan tantangan ini.\nSilahkan ketik kode di bawah ini untuk menyelesaikannya!",
              )
              .setImage("attachment://captcha.png"),
          ],
          files: [
            {
              attachment: captcha.generateSync(),
              name: "captcha.png",
            },
          ],
        })
        .then((_msg) => {
          const dmChannel = _msg.channel as DMChannel;
          dmChannel
            .awaitMessages({
              filter: (respone: Message) =>
                respone.author.id === message.author.id,
              max: 1,
              time: 60000,
              errors: ["time"],
            })
            .then((collection) => {
              const code = collection.first().content;
              const trigger = code.toLowerCase() === captchaString;
              dmChannel.send({
                embeds: [
                  this.embed(
                    client,
                    `Kode keamanan ${trigger ? "benar. Selamat datang!" : "salah. Silahkan ulangi kembali."}`,
                  ),
                ],
              });
              if (trigger) {
                const member = message.guild.members.cache.get(
                  message.author.id,
                );
                if (!member) {
                  dmChannel.send({
                    embeds: [
                      this.embed(client, "gagal mengambil data member anda."),
                    ],
                  });
                } else {
                  member.roles.add(role).catch((err) =>
                    dmChannel.send({
                      embeds: [
                        this.embed(
                          client,
                          `gagal memberikan role: \`${err.message}\``,
                        ),
                      ],
                    }),
                  );
                }
              }
            })
            .catch((_err) => {
              (message.channel as TextChannel).send({
                embeds: [
                  this.embed(client, "Waktu habis! Silahkan request kembali."),
                ],
              });
            });
        })
        .catch((_err) => {
          message.reply({
            embeds: [
              this.embed(
                client,
                "izinkan saya untuk dapat meng-DM kamu terlebih dahulu sebelum menggunakan perintah ini.",
              ),
            ],
          });
        });
    }
  }
}
