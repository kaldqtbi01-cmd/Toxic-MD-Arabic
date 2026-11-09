import { addBannedGroup, removeBannedGroup, getBannedGroups } from '../../database/config.js';
import { seedBannedGroups } from '../../lib/settingsCache.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

const fmt = (title, msg) => `╭─❏ 「 ${title}」\n│ ${msg}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

const normalizeJid = (jid) => {
    if (!jid) return '';
    return jid.replace(/:(\d+)@/, '@').trim();
};

export default [
    {
        name: 'blockgc',
        aliases: ['bangc', 'silencegc', 'mutegc'],
        description: 'حظر البوت أو إسكاتُه في مجموعة (يتجاهل البوت جميع الرسائل الواردة من تلك المجموعة)',
        run: async (context) => {
            await ownerMiddleware(context, async () => {
                const { client, m, text, isGroup } = context;
                await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

                let targetJid = '';

                if (text && text.trim()) {
                    const t = text.trim();
                    if (t.endsWith('@g.us')) {
                        targetJid = normalizeJid(t);
                    } else if (/^\d+[-\d]*$/.test(t.replace('@g.us', ''))) {
                        targetJid = normalizeJid(t.includes('@g.us') ? t : t + '@g.us');
                    } else {
                        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                        return sendInteractive(client, m, fmt("BLOCKGC", "أدخل معرّف JID صالحًا للمجموعة (مثل 1234567890-12345@g.us)، أو أدخل المعرّف الرقمي فقط."));
                    }
                } else if (isGroup) {
                    targetJid = normalizeJid(m.chat);
                } else {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return sendInteractive(client, m, fmt("BLOCKGC", "أدخل JID المجموعة، أو نفّذ هذا الأمر داخل المجموعة التي تريد حظرها."));
                }

                const raw = await getBannedGroups();
                const banned = raw.map(normalizeJid);
                if (banned.includes(targetJid)) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return sendInteractive(client, m, fmt("BLOCKGC", `Group \`${targetJid}\` is already blocked.`));
                }

                await addBannedGroup(targetJid);
                seedBannedGroups([...banned, targetJid]);
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return sendInteractive(client, m, fmt("BLOCKGC", `Group blocked: \`${targetJid}\`\n│ Bot will ignore all messages from that group.`));
            });
        }
    },
    {
        name: 'unblockgc',
        aliases: ['ungc', 'unbangc', 'unsilencegc'],
        description: 'Unblock/unsilence the bot in a previously blocked group',
        run: async (context) => {
            await ownerMiddleware(context, async () => {
                const { client, m, text, isGroup } = context;
                await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

                let targetJid = '';

                if (text && text.trim()) {
                    const t = text.trim();
                    if (t.endsWith('@g.us')) {
                        targetJid = normalizeJid(t);
                    } else if (/^\d+[-\d]*$/.test(t.replace('@g.us', ''))) {
                        targetJid = normalizeJid(t.includes('@g.us') ? t : t + '@g.us');
                    } else {
                        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                        return sendInteractive(client, m, fmt("UNBLOCKGC", "Provide a valid group JID or numeric ID."));
                    }
                } else if (isGroup) {
                    targetJid = normalizeJid(m.chat);
                } else {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return sendInteractive(client, m, fmt("UNBLOCKGC", "أدخل معرّف المجموعة (JID)، أو نفّذ الأمر من داخل المجموعة."));
                }

                const raw = await getBannedGroups();
                const normalized = raw.map(normalizeJid);
                const idx = normalized.indexOf(targetJid);
                if (idx === -1) {
                    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
                    return sendInteractive(client, m, fmt("UNBLOCKGC", `Group \`${targetJid}\` is not blocked.`));
                }

                await removeBannedGroup(raw[idx]);
                seedBannedGroups(normalized.filter(j => j !== targetJid));
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return sendInteractive(client, m, fmt("UNBLOCKGC", `Group unblocked: \`${targetJid}\`\n│ Bot will resume responding in that group.`));
            });
        }
    },
    {
        name: 'blockedgcs',
        aliases: ['listblockedgc', 'bannedgcs', 'blockedgroups'],
        description: 'List all blocked/silenced groups',
        run: async (context) => {
            await ownerMiddleware(context, async () => {
                const { client, m } = context;
                await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
                const banned = await getBannedGroups();
                if (!banned || banned.length === 0) {
                    await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                    return sendInteractive(client, m, fmt("BLOCKED GCS", "No groups are currently blocked."));
                }
                const list = banned.map((jid, i) => `${i + 1}. \`${jid}\``).join('\n│ ');
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
                return sendInteractive(client, m, fmt("BLOCKED GCS", `${banned.length} blocked group(s):\n│ ${list}`));
            });
        }
    }
];
