import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { sendInteractive } from '../../lib/sendInteractive.js';

const execAsync = promisify(exec);

export default async (context) => {
    await ownerMiddleware(context, async () => {
        const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const cmd = (text || (m.quoted && (m.quoted.text || m.quoted.caption)) || '').trim();

        if (!cmd) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return sendInteractive(client, m, `╭─❏ 「 EXEC 」\n│ لم يتم إدخال أي أمر. أدخل أمرًا\n│ صالحًا في shell.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }

        try {
            const { stdout, stderr } = await execAsync(cmd, { timeout: 30000 });
            const output = stdout || stderr || '(لا توجد مخرجات)';
            await client.sendMessage(m.chat, { react: { text: stderr && !stdout ? '❌' : '✅', key: m.reactKey } });
            await sendInteractive(client, m, `╭─❏ 「 SHELL OUTPUT」\n${output.split('\n').map(l => `│ ${l}`).join('\n')}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        } catch (error) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `╭─❏ 「 SHELL ERROR」\n│ ${error.message}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    });
};
