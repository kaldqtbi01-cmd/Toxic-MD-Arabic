import { sendInteractive } from '../../lib/sendInteractive.js';
export default async (context) => {
  const { client, m, chatUpdate, store, isBotAdmin, isAdmin } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

  if (!m.isGroup) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `╭─❏ 「 خطأ 」
│ هذا الأمر مخصّص للمجموعات فقط.\n│ يُرجى استخدامه في مجموعة.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }

  if (!isAdmin) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `╭─❏ 「 خطأ 」
│ لا يمكنك تنفيذ ذلك إلا بصلاحيات\n│ المشرف.\n│ يُرجى طلب المساعدة من أحد المشرفين.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }

  if (!isBotAdmin) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `╭─❏ 「 خطأ」
│ لا أملك صلاحيات المشرف.\n│ امنحني صلاحيات المشرف أو أوقف\n│ محاولة تنفيذ هذا الأمر.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }

  const responseList = await client.groupRequestParticipantsList(m.chat);

  if (responseList.length === 0) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
    return sendInteractive(client, m, `╭─❏ 「 لا توجد طلبات」
│ يا للمفاجأة، لا أحد يطلب\n│ الانضمام إلى هذه المجموعة.\n│ لا توجد طلبات معلّقة.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
  }

  await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });

  for (const participant of responseList) {
    try {
      const response = await client.groupRequestParticipantsUpdate(
        m.chat,
        [participant.jid],
        "approve"
      );
      console.log(response);
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      console.error('Error approving participant:', error);
      return sendInteractive(client, m, `╭─❏ 「 ERROR」
│ Shit hit the fan, couldn't approve\n│ @${participant.jid.split('@')[0]}.\n│ Fix your group, dumbass.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`, { mentions: [participant.jid] });
    }
  }

  sendInteractive(client, m, `╭─❏ 「 تمت الموافقة」
│ حسنًا، تمت الموافقة على جميع\n│ طلبات الانضمام.\n│ هل أنت راضٍ الآن؟\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
};
