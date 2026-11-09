import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js'; 
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, Owner, participants, botname } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!botname) {
            console.error(`لم يتم تعيين اسم البوت. يُرجى ضبطه.`);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `╭─❏ 「 LEAVEGC 」
│ \n│ حدث خلل في البوت: اسم البوت غير موجود في السياق.\n│ يُرجى إبلاغ المطوّر بهذه المشكلة.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        if (!Owner) {
            console.error(`لم يتم تعيين المالك.`);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `╭─❏ 「 مغادرة المجموعة 」
│ \n│ حدث خلل في البوت. لا توجد معلومات عن المالك.\n│ يُرجى التواصل مع المطوّر.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        if (!m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, `╭─❏ 「 LEAVEGC 」
│ \n│ You think I'm bailing on your\n│ pathetic DMs? This is for groups,\n│ you idiot.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        try {
            const maxMentions = 50;
            const mentions = participants.slice(0, maxMentions).map(a => a.id);
            await client.sendMessage(m.chat, { 
                text: `╭─❏ 「 LEAVING」
│ Fuck this shithole ${botname} is OUT!\n│ Good luck rotting without me,\n│ you nobodies. ${mentions.length < participants.length ? 'Too many losers to tag, pathetic.' : ''}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`, 
                mentions 
            });
            console.log(`[LEAVE-DEBUG] Leaving group ${m.chat}, mentioned ${mentions.length} participants`);
            await client.groupLeave(m.chat);
        } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            console.error(`[LEAVE-ERROR] Couldn't ditch the group: ${error.stack}`);
            await sendInteractive(client, m, `╭─❏ 「 ERROR」
│ Shit broke, @${m.sender.split('@')[0].split(':')[0]}!\n│ Can't escape this dumpster fire:\n│ ${error.message}. Try again, loser.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });
};
