import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'clearchat',
    aliases: ['wipe', 'clearview'],
    description: 'Clears all messages in a chat from the bot view',
    run: async (context) => {
        await ownerMiddleware(context, async () => {
            const { client, m } = context;

            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            try {
                await client.clearChatMessages(m.chat, m);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                await sendInteractive(client, m, '╭─❏ 「 تم المسح 」\n│ \n│ أُزيلت المحادثة من العرض لديّ.\n│ اختفت بالكامل. 🧹\n╰───────────────\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            } catch (error) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                await sendInteractive(client, m, '╭─❏ 「 خطأ 」\n│ \n│ تعذّر مسح هذه المحادثة.\n│ يرجى المحاولة مرة أخرى.\n╰───────────────\n> ©𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧');
            }
        });
    }
};
