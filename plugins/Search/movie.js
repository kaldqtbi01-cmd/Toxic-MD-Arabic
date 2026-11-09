import { sendInteractive } from '../../lib/sendInteractive.js';
  import axios from 'axios';
export default async (context) => {
  const { client, m, text } = context;
  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  if (!text) {
      await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      return sendInteractive(client, m, "🚫 يُرجى إدخال اسم فيلم أو مسلسل تلفزيوني");
  }

  try {
    let fids = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${text}&plot=full`);
    let imdbt = "";

    imdbt += `╭─❏ 「 MOVIE SEARCH 」
`;
    imdbt += "│ 🎬 العنوان     : " + fids.data.Title + "\n";
    imdbt += "│ 📅 السنة       : " + fids.data.Year + "\n";
    imdbt += "│ ⭐ التقييم     : " + fids.data.Rated + "\n";
    imdbt += "│ 📆 تاريخ الإصدار: " + fids.data.Released + "\n";
    imdbt += "│ ⏳ مدة التشغيل : " + fids.data.Runtime + "\n";
    imdbt += "│ 🌀 النوع       : " + fids.data.Genre + "\n";
    imdbt += "│ 👨‍💼 المخرج     : " + fids.data.Director + "\n";
    imdbt += "│ ✍️ الكاتب      : " + fids.data.Writer + "\n";
    imdbt += "│ 👥 الممثلون    : " + fids.data.Actors + "\n";
    imdbt += "│ 📜 الحبكة      : " + fids.data.Plot + "\n";
    imdbt += "│ 🌐 اللغة       : " + fids.data.Language + "\n";
    imdbt += "│ 🌍 البلد       : " + fids.data.Country + "\n";
    imdbt += "│ 🏆 الجوائز     : " + fids.data.Awards + "\n";
    imdbt += "│ 💰 شباك التذاكر: " + fids.data.BoxOffice + "\n";
    imdbt += "│ 🏭 الإنتاج     : " + fids.data.Production + "\n";
    imdbt += "│ 🌟 تقييم IMDb  : " + fids.data.imdbRating + "\n";
    imdbt += "│ 🗳️ أصوات IMDb  : " + fids.data.imdbVotes + "\n";
    imdbt += "╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧";

    await client.sendMessage(
      m.chat,
      {
        image: {
          url: fids.data.Poster },
        caption: imdbt }
    );
  } catch (e) {
    sendInteractive(client, m, "❌ لم أتمكن من العثور على هذا الفيلم\n\n" + e);
  }
};