import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';
import { setLanguage, getLanguage, getSupportedLanguages } from '../../lib/language.js';

export default {
    name: 'language',
    aliases: ['lang', 'setlang', 'setlanguage'],
    description: 'تغيير لغة ردود البوت. للمالك فقط.',
    run: async (context) => {
        await ownerMiddleware(context, async () => {
            const { client, m, text, prefix } = context;
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            const fmt = (msg) => `╭─❏ 「 اللغة 」\n│ ${msg}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
            const langs = getSupportedLanguages();

            if (!text || !text.trim()) {
                const current = getLanguage();
                const list = Object.entries(langs).map(([code, name]) => `│ ${code.toUpperCase().padEnd(5)} — ${name}${code === current ? ' *[current]*' : ''}`).join('\n');
                await client.sendMessage(m.chat, { react: { text: '🌐', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, fmt(`اللغة الحالية: *${langs[current] || current}* (${current.toUpperCase()})\n│ \n│ اللغة المدعومة:\n${list}\n│ \n│ طريقة الاستخدام: ${prefix}language <code>\n│ مثال: ${prefix}language ar`));
            }

            const code = text.trim().toLowerCase();
            if (code === 'list' || code === 'help') {
                const current = getLanguage();
                const list = Object.entries(langs).map(([c, name]) => `│ ${c.toUpperCase().padEnd(5)} — ${name}${c === current ? ' *[current]*' : ''}`).join('\n');
                return sendInteractive(client, m, fmt(`اللغة الحالية: *${langs[current] || current}* (${current.toUpperCase()})\n│ \n│ ${list}`));
            }

            if (!langs[code]) {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, fmt(`اللغة "${code}" غير مدعومة.\n│ استخدم ${prefix}language to see all supported languages.`));
            }

            const ok = setLanguage(code);
            if (ok) {
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return sendInteractive(client, m, fmt(`تم ضبط اللغة على *${langs[code]}* (${code.toUpperCase()})!`));
            } else {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, fmt(`تعذر ضبط اللغة. حاول مرة أخرى.`));
            }
        });
    }
};
