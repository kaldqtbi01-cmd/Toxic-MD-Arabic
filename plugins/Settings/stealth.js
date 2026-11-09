import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import { getSettings, updateSetting } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { getDeviceMode } from '../../lib/deviceMode.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, args, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const fmt = (msg) => `╭─❏ 「 STEALTH 」\n│ ${msg}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        try {
            const settings = await getSettings();
            const isEnabled = settings.stealth === 'true' || settings.stealth === true;
            const value = args[0]?.toLowerCase();

            const _ON  = new Set(['on','enable','enabled','activate','activated','true','1','yes','start']);
            const _OFF = new Set(['off','disable','disabled','deactivate','deactivated','false','0','no','stop']);

            if (_ON.has(value)) {
                if (isEnabled) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return await client.sendMessage(m.chat, { text: fmt('وضع التخفي مفعّل بالفعل. 👻 يحذف البوت الأوامر والردود تلقائيًا بعد 3 ثوانٍ.') });
                }
                await updateSetting('stealth', true);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return await client.sendMessage(m.chat, { text: fmt('وضع التخفي: *مفعّل 👻* — تختفي الأوامر بعد 3 ثوانٍ. تم تفعيل وضع الشبح.') });
            }

            if (_OFF.has(value)) {
                if (!isEnabled) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return await client.sendMessage(m.chat, { text: fmt('وضع التخفي مُعطّل بالفعل. 💡 ستبقى الرسائل.') });
                }
                await updateSetting('stealth', false);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return await client.sendMessage(m.chat, { text: fmt('وضع التخفي: *متوقف 💡* — ستبقى الرسائل ظاهرة.') });
            }

          await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } });
          await sendInteractive(client, m, `╭─❏ 「 STEALTH」
│ Status: ${settings.stealth ? 'ON ✅' : 'إيقاف ❌'}\n│ \n│ Options:\n│ ${prefix}stealth on\n│ ${prefix}stealth off\n╰───────────────`);

        } catch (err) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await client.sendMessage(m.chat, { text: fmt(`Crashed. 💀 Error: ${err.message}`) });
        }
    });
};
