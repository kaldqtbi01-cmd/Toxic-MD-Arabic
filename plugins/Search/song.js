import { sendInteractive } from '../../lib/sendInteractive.js';
  import yts from 'yt-search';
export default async (context) => {
  const { client, m, text } = context;
  await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  const formatStylishReply = (message) => {
    return `╭─❏ 「 الأغنية 」\n│ ${message}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
  };

  if (!text) {
    await client.sendMessage(m.chat, { react: { text:'❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, formatStylishReply("أدخل اسم أغنية من فضلك! 🎵"));
  }

  if (text.length > 100) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, formatStylishReply("ما هذا النص الطويل؟ اجعل اسم الأغنية قصيرًا، بحد أقصى 100 حرف."));
  }

  const { videos } = await yts(text);
  if (!videos || videos.length === 0) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, formatStylishReply("لم نعثر على أغانٍ. لعلّ ذوقك الموسيقي يحتاج إلى تغيير. 😕 جرّب شيئًا آخر."));
  }

  const song = videos[0];
  const title = song.title;
  const artist = song.author?.name || "Unknown Artist";
  const views = song.views?.toLocaleString() || "Unknown";
  const duration = song.duration?.toString() || "Unknown";
  const uploaded = song.ago || "Unknown";
  const thumbnail = song.thumbnail || "";
  const videoUrl = song.url;

  const response = `╭─❏ 「 الأغنية 」\n` +
                  `│ *${title}* found for @${m.sender.split('@')[0].split(':')[0]}! 🎶\n` +
                  `│🎤 *Artist*: ${artist}\n` +
                  `│👀 *Views*: ${views}\n` +
                  `│⏱ *Duration*: ${duration}\n` +
                  `│📅 *Uploaded*: ${uploaded}\n` +
                  (thumbnail ? `│🖼 *Thumbnail*: ${thumbnail}\n` : '') +
                  `│🔗 *Video*: ${videoUrl}\n` +
                  `╰───────────────
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧\n` +
                  `Powered by Toxic-MD`;

  await sendInteractive(client, m, formatStylishReply(response));
};