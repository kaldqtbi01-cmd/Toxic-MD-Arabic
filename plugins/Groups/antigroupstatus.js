import { getGroupSettings, updateGroupSetting, getGroupSettingsFresh, getWarnLimit } from '../../database/config.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const fmt = (msg) => `╭─❏ 「 ANTIGROUPSTATUS」\n│ ${msg}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

const validModes = ['off', 'warn', 'kick', 'delete'];

export default {
    name: 'antigroupstatus',
    aliases: ['antigcstatus', 'ags', 'nogroupstatus', 'blockgcstatus'],
    description: 'فعّل أو عطّل الحماية من حالات المجموعات. طريقة الاستخدام: .antigroupstatus warn|kick|delete|off',
    run: async (context) => {
        const { client, m, args, prefix } = context;
        if (!m.chat?.endsWith('@g.us')) {
            return sendInteractive(client, m, fmt('This command is for groups only.'));
        }
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const val = (args[0] || '').toLowerCase();
        const gs = await getGroupSettings(m.chat);
        const current = gs?.antigroupstatus || 'off';

        const normalised =
            val === 'on' || val === 'enable' || val === 'enabled' || val === 'activate' || val === 'true' || val === '1' || val === 'yes' ? 'delete' :
            val === 'disable' || val === 'disabled' || val === 'deactivate' || val === 'false' || val === '0' || val === 'no' || val === 'stop' ? 'off' :
            val;

        if (!normalised) {
            const modeLabel =
                current === 'warn'   ? 'تحذير ⚠️'   :
                current === 'kick'   ? 'طرد 🚫'   :
                current === 'delete' ? 'حذف 🗑️' : 'إيقاف ❌';
            await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, fmt(
                `Status: *${modeLabel}*\n│ \n│ Detects messages posted as a "group\n│ status" via ${prefix}gstatus and\n│ punishes non-admins who post one.\n│ \n│ الاستخدام:\n│ *${prefix}antigroupstatus warn*   → warn first, kick on repeat\n│ *${prefix}antigroupstatus kick*   → delete + instant kick\n│ *${prefix}antigroupstatus delete* → delete only, no punishment\n│ *${prefix}antigroupstatus off*    → disable`
            ));
        }

        if (!validModes.includes(normalised)) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, fmt(`Invalid option: *${val}*\n│ Use: *warn*, *kick*, *delete*, or *off*`));
        }

        if (current === normalised) {
            await client.sendMessage(m.chat, { react: { text: '⚠️', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, fmt(`Antigroupstatus is already *${normalised.toUpperCase()}*. Pay attention.`));
        }

        await updateGroupSetting(m.chat, 'antigroupstatus', normalised);
        await getGroupSettingsFresh(m.chat);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});

        const warnLimit = await getWarnLimit(m.chat);
        const desc =
            normalised === 'off'    ? 'حالة Anti-Group *معطّلة ❌*\n│ أصبحت حالات المجموعات مسموحًا بها الآن.' :
            normalised === 'warn'   ? `Anti-Group Status set to *تحذير ⚠️*\n│ Message deleted + sender warned.\n│ At *${warnLimit}* warns they're auto-kicked.` :
            normalised === 'kick'   ? 'حالة مكافحة رسائل غير المشرفين مضبوطة على *الطرد 🚫*\n│ نشر غير المشرفين = طرد فوري.' :
                                     'تم ضبط حالة مكافحة المجموعة على *حذف 🗑️*\n│ تُحذف الرسالة دون تحذير أو طرد.';
        return sendInteractive(client, m, fmt(desc));
    }
};
