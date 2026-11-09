import { getSettings, getSudoUsers, getBannedUsers } from '../../database/config.js';
import ownerMiddleware from '../../utils/botUtil/Ownermiddleware.js';
import { botname } from '../../config/settings.js';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
  name: 'settings',
  aliases: ['config', 'botsettings', 'mysettings', 'set'],
  description: 'Displays all bot settings with descriptions',
  run: async (context) => {
    await ownerMiddleware(context, async () => {
      const { client, m, prefix } = context;
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
      await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
      const bName = botname || 'Toxic-MD';

      const settings = await getSettings();
      const sudoUsers = await getSudoUsers();
      const bannedUsers = await getBannedUsers();
      let groupCount = 0;
      try { groupCount = Object.keys(await client.groupFetchAllParticipating()).length; } catch (e) {}

      const fmt = (name, desc, status, cmd, example) => {
        return `│ *${name}*\n│   ${desc}\n│   Status: ${status}\n│   Change: ${cmd}\n│   Example: ${example}\n│\n`;
      };

      const message =
        `*${bName} Settings*\n\n` +
        `╭─❏ 「 معلومات البوت」\n` +
        `│ Bot Name: ${bName}\n` +
        `│ Sudo Users: ${sudoUsers.length}\n` +
        `│ Banned Users: ${bannedUsers.length}\n` +
        `│ Total Groups: ${groupCount}\n` +
        `│\n` +
        `╭─❏ 「 جميع الإعدادات」\n│\n` +
        fmt(
          'Auto-Like Status',
          'Automatically reacts to contacts status updates with an emoji.',
          settings.autolike ? '✅ ON' : '❌ إيقاف',
          `${prefix}autolike on/off`,
          `${prefix}autolike on`
        ) +
        fmt(
          'Auto-View Status',
          'Automatically views/opens contacts status stories so they see your view.',
          settings.autoview ? '✅ ON' : '❌ إيقاف',
          `${prefix}autoview on/off`,
          `${prefix}autoview off`
        ) +
        fmt(
          'Auto-Read Messages',
          'Automatically reads incoming messages and shows blue ticks to senders.',
          settings.autoread ? '✅ ON' : '❌ إيقاف',
          `${prefix}autoread on/off`,
          `${prefix}autoread on`
        ) +
        fmt(
          'Status Reaction Emoji',
          'Sets which emoji is used when auto-liking status updates.',
          settings.autolikeemoji || '❤️',
          `${prefix}reaction <emoji>`,
          `${prefix}reaction 🔥`
        ) +
        fmt(
          'Bot Prefix',
          'The character used before commands to trigger the bot.',
          settings.prefix || '.',
          `${prefix}prefix <symbol>`,
          `${prefix}prefix !`
        ) +
        fmt(
          'Auto-Bio Update',
          'Automatically updates your WhatsApp bio with bot uptime info.',
          settings.autobio ? '✅ ON' : '❌ إيقاف',
          `${prefix}autobio on/off`,
          `${prefix}autobio on`
        ) +
        fmt(
          'Anti-Call Protection',
          'Automatically rejects and blocks users who call the bot number.',
          settings.anticall ? '✅ ON' : '❌ إيقاف',
          `${prefix}anticall on/off`,
          `${prefix}anticall on`
        ) +
        fmt(
          'الرد التلقائي لروبوت المحادثة (PM)',
          'Enables AI chatbot that auto-replies to private messages.',
          settings.chatbotpm ? '✅ ON' : '❌ إيقاف',
          `${prefix}chatbotpm on/off`,
          `${prefix}chatbotpm on`
        ) +
        fmt(
          'Bot Mode',
          'Public = everyone can use. Private = only owner/sudo can use.',
          settings.mode || 'public',
          `${prefix}mode <public/private>`,
          `${prefix}mode private`
        ) +
        fmt(
          'Presence Display',
          'تحكّم فيما يراه الآخرون: متصل، أو يكتب، أو يسجّل صوتًا.',
          settings.presence || 'online',
          `${prefix}presence <online/typing/recording>`,
          `${prefix}presence typing`
        ) +
        fmt(
          'Anti-Delete Recovery',
          'Recovers and forwards deleted messages to your DM.',
          settings.antidelete ? '✅ ON' : '❌ إيقاف',
          `${prefix}antidelete on/off`,
          `${prefix}antidelete on`
        ) +
        fmt(
          'Anti-Edit Tracker',
          'Catches edited messages and sends original + edited to your DM.',
          settings.antiedit ? '✅ ON' : '❌ إيقاف',
          `${prefix}antiedit on/off`,
          `${prefix}antiedit on`
        ) +
        fmt(
          'Sticker Pack Name',
          'Sets the pack name shown on stickers created by the bot.',
          settings.packname || 'Toxic-MD',
          `${prefix}stickerwm <name>`,
          `${prefix}stickerwm MyPack`
        ) +
        fmt(
          'Start Message',
          'Sends a welcome message when the bot connects successfully.',
          settings.startmessage ? '✅ ON' : '❌ إيقاف',
          `${prefix}startmessage on/off`,
          `${prefix}startmessage off`
        ) +
        fmt(
          'Multi-Prefix',
          'عند التفعيل، يستجيب البوت لأي رمز بادئة (. ! # / $ ? + - * ~)، أو حتى من دون بادئة.',
          settings.multiprefix === true || settings.multiprefix === 'true' ? '✅ ON' : '❌ إيقاف',
          `${prefix}multiprefix on/off`,
          `${prefix}multiprefix on`
        ) +
        fmt(
          'Auto AI',
          'Automatically replies to DMs and @mentions using an AI model.',
          settings.autoai === true || settings.autoai === 'true' ? '✅ ON' : '❌ إيقاف',
          `${prefix}autoai on/off`,
          `${prefix}autoai on`
        ) +
        fmt(
          'Anti-View-Once',
          'Saves view-once images/videos to your DM so they never disappear.',
          settings.antiviewonce ? '✅ ON' : '❌ إيقاف',
          `${prefix}antiviewonce on/off`,
          `${prefix}antiviewonce on`
        ) +
        fmt(
          'Stealth Mode',
          'Auto-deletes commands and bot replies 8 seconds after execution.',
          settings.stealth === true || settings.stealth === 'true' ? '✅ ON' : '❌ إيقاف',
          `${prefix}stealth on/off`,
          `${prefix}stealth on`
        ) +
        fmt(
          'Device Mode',
          'وضع عرض الأزرار: يستخدم android أزرار قوائم الاختيار، بينما يستخدم ios ردودًا نصية فقط.',
          settings.device || process.env.DEVICE || 'الافتراضي (android)',
          `${prefix}device android/ios/default`,
          `${prefix}device ios`
        ) +
        `╭─❏ 「 نصائح」\n` +
        `│ لا يمكن تغيير الإعدادات إلا للمالك أو sudo.\n` +
        `│ تُحفَظ الإعدادات فورًا في قاعدة البيانات.\n` +
        `╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

      await sendInteractive(client, m, message);
    });
  }
};
