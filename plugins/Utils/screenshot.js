import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {

const { client, m, text, botname } = context;
await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });



try {
let cap = `╭─❏ 「 SCREENSHOT」
│ Screenshot by ${botname}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`

if (!text) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `╭─❏ 「 طريقة الاستخدام 」
│ أرسل رابط موقع إلكتروني لالتقاط صورة للشاشة.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`)
}

const url = /^https?:\/\//i.test(text) ? text : `https://${text}`;
const image = `https://image.thum.io/get/fullpage/${url}`

await client.sendMessage(m.chat, { image: { url: image }, caption: cap});


} catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});

sendInteractive(client, m, `╭─❏ 「 خطأ 」
│ تعذّر التقاط لقطة الشاشة. يُرجّح أن الرابط غير صالح.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`)

}

}
