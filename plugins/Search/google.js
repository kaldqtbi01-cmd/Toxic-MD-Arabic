import { sendInteractive } from '../../lib/sendInteractive.js';
  import axios from 'axios';
export default async (context) => {
  const { client, m, text } = context;
  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  if (!text) {
    sendInteractive(client, m, 
      "╭─❏ 「 الاستخدام 」\n│ 🚫 يُرجى إدخال مصطلح للبحث!\n│ مثال: .google ما هي الخيانة؟\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧"
    );
    return;
  }

  try {
    let { data } = await axios.get(
      `https://www.googleapis.com/customsearch/v1?q=${text}&key=AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI&cx=baf9bdb0c631236e5`
    );

    if (data.items.length == 0) {
      sendInteractive(client, m, 
        "╭─❏ 「 ERROR 」\n│ ❌ Unable to find any results\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧"
      );
      return;
    }

    let tex = "";
    tex += "╭─❏ 「 بحث Google 」\n";
    tex += "│ 🔍 عبارة البحث: " + text + "\n";
    tex += "";

    for (let i = 0; i < data.items.length; i++) {
      tex += "│ النتيجة " + (i + 1) + "\n";
      tex += "│ 🪧 العنوان: " + data.items[i].title + "\n";
      tex += "│ 📝 الوصف: " + data.items[i].snippet + "\n";
      tex += "│ 🌐 الرابط: " + data.items[i].link + "\n";
      tex += "";
    }

    sendInteractive(client, m, tex);
  } catch (e) {
    sendInteractive(client, m, 
      "╭─❏ 「 خطأ 」\n│ ❌ حدث خطأ: " + e.message + "\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧"
    );
  }
};