import fetch from 'node-fetch';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'boobs',
    aliases: ['tits', 'boobies'],
    description: 'احصل على صور للثديين (للبالغين فقط)',
    run: async (context) => {
        const { client, m } = context;

        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            const res = await fetch('https://nekobot.xyz/api/image?type=boobs');
            if (!res.ok) throw new Error(`API returned ${res.status}`);
            const data = await res.json();

            if (!data.success || !data.message) throw new Error('No image URL returned');

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

            await client.sendMessage(m.chat, {
                image: { url: data.message },
                caption: `╭─❏ 「 محتوى للبالغين」
│ إليك الصورة التي طلبتها.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            });

        } catch (error) {
            console.error('Boobs error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            await sendInteractive(client, m, `╭─❏ 「 خطأ 」
│ تعذّر جلب الصورة المطلوبة.\n│ يُرجى المحاولة مجددًا لاحقًا.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    }
};
