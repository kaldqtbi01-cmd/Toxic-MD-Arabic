import middleware from '../../utils/botUtil/middleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'pin',
    aliases: ['pinmsg', 'unpin'],
    description: 'Pin or unpin a message in a group',
    run: async (context) => {
        await middleware(context, async () => {
            const { client, m, args } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            if (!m.quoted) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, '╭─❏ 「 تثبيت 」\n│ \n│ أرسل ردًا على رسالة لتثبيتها.\n╰───────────────\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            }

            const isUnpin = (args[0] || '').toLowerCase() === 'unpin';

            const messageKey = {
                id: m.quoted.id,
                remoteJid: m.chat,
                participant: m.quoted.sender
            };

            try {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                await client.pinMessage(m.chat, messageKey, isUnpin ? 0 : 1);
                await sendInteractive(client, m, `╭─❏ 「 PIN 」
╭─❏ 「 ${isUnpin ? 'UNPINNED' : 'PINNED'} 」\n│ \n│ Message ${isUnpin ? 'unpinned' : 'pinned'} successfully.\n╰───────────────\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
            } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                console.error('[خطأ PIN]', error?.message || error);
                const msg = error?.message || String(error);
                const isAuth = msg.includes('forbidden') || msg.includes('not-authorized') || msg.includes('403');
                if (isAuth) {
                    await sendInteractive(client, m, '╭─❏ 「 خطأ 」\n│ \n│ تعذّر التثبيت. تأكّد من أنني مشرف.\n╰───────────────\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
                } else {
                    await sendInteractive(client, m, '╭─❏ 「 خطأ 」\n│ \n│ تعذر التثبيت: ' + msg.slice(0, 80) + '\n╰───────────────\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
                }
            }
        });
    }
};
