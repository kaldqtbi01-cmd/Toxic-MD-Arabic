import { getAnime } from '../../lib/toxicApi.js';

const ROASTS = [
    "يُحتمل أن كلمة مرور WiFi لديك هي 'password123'. يُرجى اختيار كلمة مرور أقوى.",
    "تُكتب عبارة «ضع الشامبو، واشطفه، وكرّر» على العبوات لتوضيح التعليمات التي قد يحتاج بعض الأشخاص إلى تكرارها.",
    "حتى رمية العملة قد تؤدي إلى قرارات أفضل.",
    "You type with one finger. That explains everything.",
    "Your personality has the energy of a dead phone battery.",
    "حتى Google لن تجد سببًا يدعو إلى الانبهار بذلك.",
    "يبدو أن تنفيذ طلبك يستغرق وقتًا طويلًا؛ يُرجى الانتظار.",
    "يصفّق لك الناس ببطء على سبيل السخرية، بينما تظنّ أن تصفيقهم حقيقي.",
    "ربما كانت أفضل لحظاتك عند الولادة، وحتى هذا قابل للنقاش.",
    "يبدو أن حسّك السليم في وضع الطيران — وربما بصورة دائمة.",
    "You could get lost in a one-room apartment.",
    "Your brain cells have a restraining order against each other.",
    "هذا لا يفيد كثيرًا في هذا السياق.",
    "You think 'lol' is a proper response to everything. Tragic.",
    "قد تكتفي بالرد بحرف واحد وتظن أن ذلك يوحي بالعمق.",
    "لو كان للتصرفات غير المدروسة تميمة، لاعتذرت عن الحضور وأرسلت شخصًا آخر بدلًا منك.",
    "تبدو وكأنك بطل المشهد، لكن المشهد محذوف.",
    "Your confidence is impressive considering your track record.",
    "لديك إمكانات لم تستثمرها بعد.",
    "Even autocorrect gave up on fixing your messages.",
];

export default {
    name: 'roast',
    aliases: ['insult', 'savage', 'toxicroast', 'flame'],
    description: 'أطلق تعليقًا ساخرًا على شخص ما (أو على نفسك).',
    run: async (context) => {
        const { client, m, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const mentioned = m.mentionedJid?.length ? m.mentionedJid[0]
            : m.quoted?.sender ? m.quoted.sender
            : m.sender;
        const target = `@${mentioned.split('@')[0].split(':')[0]}`;
        const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)];

        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '🔥', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});
        await client.sendMessage(m.chat, {
            text: `╭─❏ 「 Rᴏᴀsᴛ」
│ 🎯 Target: ${target}\n│ \n│ ${roast}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
            mentions: [mentioned]
        });
    }
};
