import fetch from 'node-fetch';
  import { sendInteractive } from '../../lib/sendInteractive.js';

  const HEADERS = {
      'User-Agent': 'Toxic-MD-Bot/2.0',
      'Accept': 'application/vnd.github.v3+json',
  };

  const fmt = (lines) => lines.join('\n') + '\n> ©𝒏𝒐𝒘𝒆𝒓𝒆𝒅 𝒁𝒚 𝒙𝒉_𝒄𝒍𝒎𝒗𝒘𝒐𝒗';

  export default async (context) => {
      const { client, m, text, prefix } = context;

      if (!text?.trim()) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return sendInteractive(client, m, fmt([
              '╭─❗ 「 متعقّب GitHub 」',
              '│ طريقة الاستخدام: ' + prefix + 'github <username>',
              '│ مثال: ' + prefix + 'github xhclintohn',
              '╰───────────────',
          ]));
      }

      const username = text.trim().replace(/^@/, '');
      await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } }).catch(() => {});

      try {
          const [userRes, reposRes] = await Promise.all([
              fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers: HEADERS }),
              fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=5`, { headers: HEADERS }),
          ]);

          if (!userRes.ok) {
              await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
              if (userRes.status === 404) return sendInteractive(client, m, fmt(['╭─❗ 「 GitHub 」', '│ لم يُعثر على المستخدم: ' + username, '╰───────────────']));
              if (userRes.status === 403) return sendInteractive(client, m, fmt(['╭─❗ 「 GitHub 」', '│ تم بلوغ حدّ الاستخدام. أعد المحاولة بعد دقيقة.', '╰───────────────']));
              throw new Error('GitHub API: ' + userRes.status);
          }

          const u = await userRes.json();
          const repos = reposRes.ok ? await reposRes.json() : [];

          const joined = new Date(u.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
          const updated = new Date(u.updated_at || u.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

          const lines = [
              '╭─❗ 「 👤 الملف الشخصي على GitHub 」',
              '│',
              '│ 👤 الاسم:       ' + (u.name || u.login),
              '│ 🔗 اسم المستخدم:  @' + u.login,
              '│ 📄 النبذة:        ' + (u.bio || 'No bio set'),
              '│ 📍 الموقع:  ' + (u.location || 'Unknown'),
              '│ 🌎 المدونة:       ' + (u.blog || 'None'),
              '│ 👀 الشركة:   ' + (u.company || 'None'),
              '│',
              '│ 📊 الإحصاءات',
              '│   • المستودعات:     ' + u.public_repos,
              '│   • المقتطفات:     ' + u.public_gists,
              '│   • المتابعون: ' + u.followers,
              '│   • يتابع: ' + u.following,
              '│',
              '│ 📅 تاريخ الانضمام:    ' + joined,
              '│ 🔄 آخر تحديث:   ' + updated,
          ];

          if (repos.length > 0) {
              lines.push('│');
              lines.push('│ 🗂️ المستودعات الأخيرة');
              repos.slice(0, 5).forEach((repo, i) => {
                  const stars = repo.stargazers_count > 0 ? ' ⭐' + repo.stargazers_count : '';
                  const lang = repo.language ? ' [' + repo.language + ']' : '';
                  lines.push(`│   ${i + 1}. ${repo.name}${lang}${stars}`);
              });
          }

          lines.push('│');
          lines.push('│ 🔗 ' + u.html_url);
          lines.push('╰───────────────');

          await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});

          // Send profile picture if available
          if (u.avatar_url) {
              try {
                  const imgRes = await fetch(u.avatar_url, { headers: { 'User-Agent': 'Toxic-MD-Bot/2.0' } });
                  if (imgRes.ok) {
                      const imgBuf = Buffer.from(await imgRes.arrayBuffer());
                      return client.sendMessage(m.chat, {
                          image: imgBuf,
                          caption: fmt(lines),
                      });
                  }
              } catch {}
          }
          return sendInteractive(client, m, fmt(lines));

      } catch (err) {
          await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          return sendInteractive(client, m, fmt([
              '╭─❗ 「 GitHub 」',
              '│ الخطأ: ' + (err.message || 'Unknown error'),
              '╰───────────────',
          ]));
      }
  };
  