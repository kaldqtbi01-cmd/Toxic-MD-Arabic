import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text, args, Owner, botname } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        if (!botname) {
            console.error(`Join-Error: botname missing in context.`);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, 
                `╭─❏ 「 JOINGC 」
│ \n│ حدث خلل في البوت: اسم البوت غير موجود في السياق.\n│ يُرجى إبلاغ المطوّر بهذه المشكلة.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }

        if (!Owner) {
            console.error(`Join-Error: Owner missing in context.`);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, 
                `╭─❏ 「 JOINGC 」
│ \n│ حدث خلل في البوت. لا يوجد مالك ضمن السياق.\n│ يُرجى التواصل مع المطوّر.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }

        let raw = (text && text.trim()) || (m.quoted && ((m.quoted.text) || (m.quoted && m.quoted.caption))) || "";
        raw = String(raw || "").trim();

        if (!raw) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, 
                `╭─❏ 「 USAGE」
│ Provide a real group invite link\n│ or reply to one.\n│ مثال: *${args && args[0] ? args[0] : '.join https://chat.whatsapp.com/abcdef...'}*\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }

        const urlRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/([A-Za-z0-9_-]+)/i;
        const match = raw.match(urlRegex);
        let inviteCode = match ? match[1] : null;

        if (!inviteCode) {
            const token = raw.split(/\s+/)[0];
            if (/^[A-Za-z0-9_-]{8 }$/.test(token)) {
                inviteCode = token;
            }
        }

        if (!inviteCode) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, 
                `╭─❏ 「 الانضمام إلى المجموعة 」
│ \n│ هذا الرابط أو رمز الدعوة غير صالح.\n│ يُرجى إدخال بيانات صحيحة.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }

        inviteCode = inviteCode.replace(/\?.*$/, '').trim();

        try {
            const info = await client.groupGetInviteInfo(inviteCode);
            const subject = info?.subject || info?.groupMetadata?.subject || "Unknown Group";

            await client.groupAcceptInvite(inviteCode);
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return sendInteractive(client, m, 
                `╭─❏ 「 JOINED」
│ Joined: *${subject}*\n│ Don't spam, or I'll ghost you.\n│ — ${botname}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            console.error(`[JOIN-ERROR] invite=${inviteCode}`, error && (error.stack || error));

            const status =
                (error && error.output && error.output.statusCode) ||
                error?.statusCode ||
                error?.status ||
                (error?.data && (error.data.status || error.data)) ||
                (error?.response && error.response.status) ||
                null;

            if (status === 400 || status === 404) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, 
                    `╭─❏ 「 JOINGC 」
│ \n│ المجموعة غير موجودة أو أن الرابط\n│ غير صالح. يُرجى إرسال رابط صحيح.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                );
            }
            if (status === 401) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, 
                    `╭─❏ 「 JOINGC 」
│ \n│ سبق أن أُزيلت من تلك المجموعة،\n│ ولا يمكنني الانضمام إليها مجددًا باستخدام هذا الرابط.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                );
            }
            if (status === 409) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, 
                    `╭─❏ 「 الانضمام إلى المجموعة 」
│ \n│ أنا عضو في هذه المجموعة بالفعل.\n│ هل تحاول إرباكي؟\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                );
            }
            if (status === 410) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, 
                    `╭─❏ 「 الانضمام إلى المجموعة 」
│ \n│ أُعيد تعيين رابط الدعوة. احصل على\n│ رابط جديد ثم حاول مجددًا.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                );
            }
            if (status === 403) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, 
                    `╭─❏ 「 JOINGC 」
│ \n│ لا أملك صلاحية الانضمام إلى\n│ تلك المجموعة. قد تكون خاصة.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                );
            }
            if (status === 500) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, 
                    `╭─❏ 「 JOINGC 」
│ \n│ المجموعة ممتلئة أو حدث خطأ في الخادم.\n│ يُرجى المحاولة لاحقًا أو التحقق من الرابط.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
                );
            }

            const shortMsg = (error && (error.message || (typeof error === 'string' ? error : 'Unknown error'))) || 'Unknown error';
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, 
                `╭─❏ 「 FAILED」
│ Failed to join: ${shortMsg}\n│ Check the link or try again.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            );
        }
    });
};
