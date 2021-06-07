"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Command_1 = tslib_1.__importDefault(require("../../Command"));
const captcha_canvas_1 = require("captcha-canvas");
const StaffList_1 = require("../../Module/Moderation/StaffList");
const RegisterRole_1 = tslib_1.__importDefault(require("../../Models/RegisterRole"));
class Register extends Command_1.default {
    constructor() {
        super({
            name: 'register',
            description: 'Dapatkan role Membermu di sini!'
        });
    }
    run(client, message, args) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const libraryString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
            const sizeCaptcha = 6;
            let generateCaptchaString = '';
            for (let i = 0; i < sizeCaptcha; i++) {
                generateCaptchaString += libraryString[Math.floor(Math.random() * libraryString.length)];
            }
            const captchaString = generateCaptchaString.toLowerCase();
            const captcha = new captcha_canvas_1.CaptchaGenerator()
                .setDimension(150, 450)
                .setCaptcha({ size: 60, color: 'deeppink', text: generateCaptchaString })
                .setDecoy({ opacity: 0.85, size: 55 })
                .setTrace({ color: 'deeppink' });
            if (args.length > 0) {
                const role = message.guild.roles.cache.get(args[0]);
                if (!role)
                    return;
                const momod = yield message.guild.members.fetch(message.author.id);
                if (!momod)
                    return;
                const ifStaff = yield StaffList_1.ifStaff(momod);
                if (!ifStaff) {
                    if (!momod.hasPermission('ADMINISTRATOR')) {
                        return message.reply('anda tidak memiliki ijin untuk menggunakan command ini!');
                    }
                }
                RegisterRole_1.default.findOne({
                    where: { serverID: message.guild.id }
                })
                    .then((regist) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (!regist) {
                        yield RegisterRole_1.default.create({
                            serverID: message.guild.id,
                            roleID: role.id
                        });
                        client.state.register.set(message.guild.id, role.id);
                    }
                    else {
                        yield RegisterRole_1.default.update({ roleID: role.id }, {
                            where: { serverID: message.guild.id }
                        });
                        client.state.register.delete(message.guild.id);
                        client.state.register.set(message.guild.id, role.id);
                    }
                    message.reply(`**${role.name}** berhasil dijadikan role Member!`);
                }));
            }
            else {
                const _role = client.state.register.get(message.guild.id);
                if (!_role)
                    return;
                const role = message.guild.roles.cache.get(_role);
                if (!role)
                    return;
                const member = message.guild.members.cache.get(message.author.id);
                if (!member)
                    return;
                if (member.roles.cache.filter(r => r.id === role.id).size > 0)
                    return message.reply('anda sudah terregistrasi!');
                yield message.reply('cek DM kamu sekarang!');
                yield message.author.send('Kamu memiliki waktu 1 menit untuk menyelesaikan tantangan ini.\nSilahkan ketik kode di bawah ini untuk menyelesaikannya!', {
                    files: [{
                            attachment: captcha.generateSync()
                        }]
                })
                    .then(_msg => {
                    message.author.createDM()
                        .then(dmchannel => {
                        dmchannel.awaitMessages((respone) => respone.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] })
                            .then(collection => {
                            const code = collection.first().content;
                            const trigger = code.toLowerCase() === captchaString;
                            dmchannel.send(`Kode keamanan ${trigger ? 'benar. Selamat datang!' : 'salah. Silahkan ulangi kembali.'}`);
                            if (trigger) {
                                const member = message.guild.members.cache.get(message.author.id);
                                if (!member)
                                    return;
                                member.roles.add(role);
                            }
                        })
                            .catch(_err => {
                            message.channel.send('Waktu habis! Silahkan request kembali.');
                        });
                    });
                })
                    .catch(_err => {
                    message.reply('izinkan saya untuk dapat meng-DM kamu terlebih dahulu sebelum menggunakan perintah ini.');
                });
            }
        });
    }
}
exports.default = Register;
//# sourceMappingURL=Register.js.map