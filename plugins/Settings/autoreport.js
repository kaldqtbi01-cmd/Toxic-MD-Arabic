import { sendInteractive } from '../../lib/sendInteractive.js';
import { generateAndSendReport } from '../../features/autoreport.js';
import { getGroupSettings, updateGroupSetting } from '../../database/config.js';

const _intervals = new Map();
const _lastReportTimes = new Map();

const REPORT_INTERVAL = 24 * 60 * 60 * 1000;

const fmt = (msg) => `╭─❏ 「 AUTOREPORT」\n│ ${msg}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

async function runReport(client, jid) {
    const result = await generateAndSendReport(client, jid);
    _lastReportTimes.set(jid, Date.now());
    return result;
}

function startAutoReport(client, jid) {
    if (_intervals.has(jid)) clearInterval(_intervals.get(jid));
    const id = setInterval(async () => {
        try {
            await generateAndSendReport(client, jid);
            _lastReportTimes.set(jid, Date.now());
        } catch (e) {
            console.error('[AUTOREPORT] scheduled report failed:', e.message);
        }
    }, REPORT_INTERVAL);
    _intervals.set(jid, id);
}

function stopAutoReport(jid) {
    if (_intervals.has(jid)) {
        clearInterval(_intervals.get(jid));
        _intervals.delete(jid);
    }
}

export default {
    name: 'autoreport',
    aliases: ['autorp', 'arp', 'dailyreport'],
    description: 'Toggle automatic daily group stats report to group status. Admins only.',
    run: async (context) => {
        const { client, m, args, isAdmin, isDev, Owner, prefix } = context;

        if (!m.isGroup) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, fmt('Groups only. This is a group feature.'));
        }

        if (!isAdmin && !isDev && !Owner) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return sendInteractive(client, m, fmt("هذا الأمر مخصص للمشرفين فقط."));
        }

        const arg = (args[0] || '').toLowerCase().trim();

        if (arg === 'now' || arg === 'send' || arg === 'force') {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const ok = await runReport(client, m.chat);
            if (ok) {
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return sendInteractive(client, m, fmt('تم نشر التقرير اليومي في حالة المجموعة!\n│ سيصدر التقرير التلقائي التالي بعد 24 ساعة.\n│ \n│ يمكنك إيقافه في أي وقت: ' + (prefix || '.') + 'autoreport off'));
            } else {
                await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                return sendInteractive(client, m, fmt('Failed to generate report. Not enough chat data yet.'));
            }
        }

        if (['on', 'enable', 'start', 'true'].includes(arg)) {
            try {
                await updateGroupSetting(m.chat, 'autoreport', 1);
            } catch {}
            startAutoReport(client, m.chat);
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return sendInteractive(client, m, fmt('تم تفعيل التقرير التلقائي!\n│ سأنشر إحصاءات المجموعة في الحالة كل 24 ساعة.\n│ \n│ لإيقافه: ' + (prefix || '.') + 'autoreport off'));
        }

        if (['off', 'disable', 'stop', 'false'].includes(arg)) {
            try {
                await updateGroupSetting(m.chat, 'autoreport', 0);
            } catch {}
            stopAutoReport(m.chat);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return sendInteractive(client, m, fmt('تم تعطيل Auto-report.\n│ لن تُرسل بعد الآن رسائل يومية متكررة إلى حالة مجموعتك.'));
        }

        const gs = await getGroupSettings(m.chat);
        const isEnabled = gs?.autoreport === true || gs?.autoreport === 1;
        const lastTime = _lastReportTimes.get(m.chat) || 0;
        const timeSinceLast = Date.now() - lastTime;
        const timeStr = lastTime > 0
            ? `${Math.floor(timeSinceLast / 3600000)}h ago`
            : 'Never';

        await client.sendMessage(m.chat, { react: { text: '📋', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, fmt(`Auto-report is currently *${isEnabled ? 'ON' : 'OFF'}*\n│ Last report: ${timeStr}\n│ \n│ الاستخدام:\n│ ${(prefix || '.')}autoreport on — enable daily reports\n│ ${(prefix || '.')}autoreport off — disable\n│ ${(prefix || '.')}autoreport now — post report immediately\n│ \n│ Aliases: ${(prefix || '.')}autorp, ${(prefix || '.')}arp`));
    }
};

export { startAutoReport, stopAutoReport };
