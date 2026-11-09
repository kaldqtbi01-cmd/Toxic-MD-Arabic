import middleware from '../../utils/botUtil/middleware.js';
import { resolveTargetJid } from '../../lib/lidResolver.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await middleware(context, async () => {
        const { client, m, args, participants, mycode } = context;
        const fq = m;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const resolveParticipantJid = (p) => {
            if (p.pn) return String(p.pn).replace(/\D/g, '') + '@s.whatsapp.net';
            const base = p.jid || p.id || '';
            if (base && !base.endsWith('@lid')) return base.split(':')[0].split('@')[0].replace(/\D/g, '') + '@s.whatsapp.net';
            return resolveTargetJid(base, participants) || base;
        };

        const botJid = client.decodeJid(client.user.id);
        const foreignList = participants
            .filter(p => !p.admin)
            .map(p => resolveParticipantJid(p))
            .filter(jid => jid && !jid.startsWith(mycode) && jid !== botJid && jid !== client.decodeJid(client.user.id));

        if (!args || !args[0]) {
            if (foreignList.length === 0) {
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return sendInteractive(client, m, `╭─❏ 「 الغرباء」\n│ لم يتم رصد أي أشخاص من خارج المجموعة. المجموعة خالية منهم حاليًا.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            }
            let txt = `╭─❏ 「 FOREIGNERS」
│ Country code not matching: ${mycode}\n│ Found ${foreignList.length} unwanted guests:\n│ \n`;
            for (const jid of foreignList) txt += `╭─❏ 「 FOREIGNERS 」
│ @${jid.split('@')[0]}\n`;
            txt += `╭─❏ 「 الأعضاء من خارج البلد 」
│ \n│ أرسل .foreigners -x لإزالتهم جميعًا\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
            await client.sendMessage(m.chat, { text: txt, mentions: foreignList }, { quoted: m });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        } else if (args[0] === '-x') {
            await client.sendMessage(m.chat, {
                text: `╭─❏ 「 PURGE MODE」
│ Removing all ${foreignList.length} foreigners now.\n│ Goodbye losers, you won't be missed.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            }, { quoted: m });
            setTimeout(async () => {
                await client.groupParticipantsUpdate(m.chat, foreignList, 'remove');
                setTimeout(() => {
                    sendInteractive(client, m, `╭─❏ 「 الأعضاء من خارج البلد 」
│ أُزيل جميع الأعضاء من خارج البلد. نُظّفت المجموعة.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
                }, 1000);
            }, 1000);
        }
    });
};
