import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getSettings, banUser, getBannedUsers, getSudoUsers } from '../../database/config.js';
import { resolveTargetJid } from '../../lib/lidResolver.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        let settings = await getSettings();
        if (!settings) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `╭─❏ 「 BAN」
│ Settings not found, you broke something.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        const sudoUsers = await getSudoUsers();

        let freshParticipants = [];
        if (m.chat && m.chat.endsWith('@g.us')) {
            try {
                const freshMeta = await client.groupMetadata(m.chat);
                freshParticipants = freshMeta.participants || [];
            } catch {}
        }
        if (!freshParticipants.length) freshParticipants = context.participants || [];

        let numberToBan;
        let resolvedJid;

        if (m.quoted) {
            resolvedJid = resolveTargetJid(m.quoted.sender, freshParticipants);
            numberToBan = resolvedJid ? resolvedJid.split('@')[0].replace(/\D/g, '') : null;
        } else if (m.mentionedJid && m.mentionedJid.length > 0) {
            resolvedJid = resolveTargetJid(m.mentionedJid[0], freshParticipants);
            numberToBan = resolvedJid ? resolvedJid.split('@')[0].replace(/\D/g, '') : null;
        } else {
            numberToBan = (args[0] || '').replace(/[^0-9]/g, '');
        }

        if (!numberToBan) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `╭─❏ 「 حظر」
│ يُرجى إدخال رقم صحيح أو الرد على رسالة المستخدم المطلوب حظره.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        if (numberToBan.length > 15) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `╭─❏ 「 حظر」
│ تعذّر تحديد رقم هاتف هذا المستخدم (عنوان LID).\n│ اطلب منه إرسال رسالة أولًا حتى يتمكن البوت من تحديد هويته.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        const _devNum = '254114885159';
        const _botNum = (context.client?.user?.id || '').split(':')[0].split('@')[0].replace(/\D/g, '');
        if (numberToBan === _devNum || (_botNum && numberToBan === _botNum)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `╭─❏ 「 حظر 」
│ لا يمكن استخدام هذا الأمر على المطوّر أو البوت.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        if (sudoUsers.includes(numberToBan)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `╭─❏ 「 حظر 」
│ لا يمكنك حظر مستخدم Sudo.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        const bannedUsers = await getBannedUsers();

        if (bannedUsers.includes(numberToBan)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `╭─❏ 「 الحظر」
│ هذا المستخدم محظور بالفعل.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        await banUser(numberToBan);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
        await sendInteractive(client, m, `╭─❏ 「 BAN」
│ ${numberToBan} has been banned. Get wrecked!\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    });
};
