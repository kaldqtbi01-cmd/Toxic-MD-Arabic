import { getGroupSettings } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m } = context;

        const jid = m.chat;

        if (!jid.endsWith('@g.us')) {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `╭─❏ 「 GCSETTINGS 」
│ هذا الأمر مخصّص للمجموعات فقط.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
        let groupSettings = await getGroupSettings(jid);

        if (!groupSettings) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return await sendInteractive(client, m, `╭─❏ 「 GCSETTINGS 」
│ لم يتم العثور على إعدادات للمجموعة. اضبط بعض الإعدادات أولًا!\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        const on = (v) => (v ? '✅ ON' : '❌ إيقاف');
        const mode = (v) => (!v || v === 'off' ? '❌ إيقاف' : `✅ ${String(v).toUpperCase()}`);
        let response = `╭─❏ 「 GROUP SETTINGS」
`;
        response += `│ Antilink: ${mode(groupSettings.antilink)}\n`;
        response += `│ Antidelete: ${on(groupSettings.antidelete)}\n`;
        response += `│ Events: ${on(groupSettings.events)}\n`;
        response += `│ Antitag: ${on(groupSettings.antitag)}\n`;
        response += `│ GCPresence: ${on(groupSettings.gcpresence)}\n`;
        response += `│ Antiforeign: ${on(groupSettings.antiforeign)}\n`;
        response += `│ Antidemote: ${on(groupSettings.antidemote)}\n`;
        response += `│ Antipromote: ${on(groupSettings.antipromote)}\n`;
        response += `│ Welcome: ${on(groupSettings.welcome)}\n`;
        response += `│ Goodbye: ${on(groupSettings.goodbye)}\n`;
        response += `│ Antibadword: ${mode(groupSettings.antibadword)}\n`;
        response += `│ Antigroupstatus: ${mode(groupSettings.antigroupstatus)}\n`;
        response += `╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        await sendInteractive(client, m, response);
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
    });
};
