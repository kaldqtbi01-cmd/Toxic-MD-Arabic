import { sendInteractive } from '../../lib/sendInteractive.js';
export default {
  name: 'gaycheck',
  aliases: ['gaymeter', 'gcheck', 'howgay'],
  description: 'يفحص نسبة الميول المثلية، مع تعليقات ساخرة وحادة.',
  run: async (context) => {
    const { client, m } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

    try {
    
      let targetUser = null;
      let targetNumber = null;

     
      console.log(`Message context: isGroup=${m.isGroup}, mentionedJid=${JSON.stringify(m.mentionedJid)}, quotedSender=${m.quoted?.sender || 'none'}`);

      if (m.isGroup && m.mentionedJid && m.mentionedJid.length > 0) {
        console.log(`Tagged JIDs: ${JSON.stringify(m.mentionedJid)}`);
        targetUser = m.mentionedJid[0];
      } else if (m.quoted && m.quoted.sender) {
        console.log(`Quoted sender: ${m.quoted.sender}`);
        targetUser = m.quoted.sender;
      } else {
        console.log(`No tags or quoted message, using sender: ${m.sender}`);
        targetUser = m.sender;
      }

      if (
        !targetUser ||
        typeof targetUser !== 'string' ||
        (!targetUser.includes('@s.whatsapp.net') && !targetUser.includes('@lid'))
      ) {
        console.error(`Invalid target user: ${JSON.stringify(targetUser)}`);
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `╭─❏ 「 Eʀʀᴏʀ」
│ Who the fuck am I torching?\n│ Tag someone or I'll roast your\n│ sorry ass to ashes!\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }

      targetNumber = targetUser.split('@')[0];
      if (!targetNumber) {
        console.error(`Failed to extract target number from JID: ${targetUser}`);
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
        return sendInteractive(client, m, `╭─❏ 「 خطأ 」
│ معرّف هذا المستخدم غير صالح.\n│ يُرجى المحاولة مجددًا.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
      }

    
      const checkingMsg = await client.sendMessage(
        m.chat,
        {
          text: `╭─❏ 「 Sᴄᴀɴɴɪɴɢ」
│ Cracking open @${targetNumber}'s soul\n│ for gay vibes...\n│ This is gonna hurt like hell,\n│ you weakling!\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`,
          mentions: [targetUser] }
      );

     
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

     
      const percentage = Math.floor(Math.random() * 101);

     
      let roast;
      let emoji;

      if (percentage === 0) {
        roast = "أكثر استقامة من مسطرة! أنت هادئ إلى درجة تجعل قطعة الكرتون تبدو مثيرة للاهتمام!";
        emoji = "🚫🏳️‍🌈";
      } else if (percentage <= 2) {
        roast = "لا أثر للميول المثلية! أنت مستقيم تمامًا، حتى إنك قد تضلّ طريقك في مسيرة فخر، يا لك من شخص شديد الحيرة!";
        emoji = "📏";
      } else if (percentage <= 4) {
        roast = "لا توجد أي شرارات! يبدو أن الحماس غائب تمامًا.";
        emoji = "😴";
      } else if (percentage <= 6) {
        roast = "الإشارة ضعيفة جدًا! يبدو أنك تفضّل البقاء بعيدًا عن الأضواء؛ لا بأس، فلكل شخص طابعه الخاص!";
        emoji = "🪨";
      } else if (percentage <= 8) {
        roast = "لمحة فضول عابرة! ألقيت نظرة على شخص ما مرة ثم ارتبكت؛ يبدو أن الفضول باغتك!";
        emoji = "👀";
      } else if (percentage <= 10) {
        roast = "لمحة بسيطة! فكرتَ «يا له من خط فكّ جميل»، ثم شعرت بالضيق حيال ذلك. ربما تحاول كبت مشاعرك!";
        emoji = "💡";
      } else if (percentage <= 12) {
        roast = "اهتزاز طفيف! أطلت النظر قليلًا إلى عضلات أحدهم، يا لك من متسلل ماكر!";
        emoji = "🤫";
      } else if (percentage <= 14) {
        roast = "مؤشرات بسيطة! قد تتأثر بقصة حب مثلية، ثم تنسب دموعك إلى الحساسية!";
        emoji = "😢";
      } else if (percentage <= 16) {
        roast = "تبدو مرتابًا! لقد بحثت في Google عن «ماذا لو لم أكن مغايرًا؟»، يا لك من شخص كثير القلق!";
        emoji = "🧐";
      } else if (percentage <= 18) {
        roast = "انكشف أمرك تمامًا! تدّعي أن الأمر مجرد «أجواء»، لكننا نعرف الحقيقة!";
        emoji = "📸";
      } else if (percentage <= 20) {
        roast = "على وشك اكتشاف مشاعرك! لا يفصلك عن الحيرة التامة بشأن هويتك سوى فيلم كوميدي رومانسي واحد، يا لك من شخص فوضوي!";
        emoji = "🧭";
      } else if (percentage <= 22) {
        roast = "رُصد غبار قوس قزح! جرّبتَ بريق شخص ما وأعجبك، يا لك من شخص ماكر!";
        emoji = "✨";
      } else if (percentage <= 24) {
        roast = "أنت في منتصف الطريق نحو التألق! تخوض التجربة بحذر، لكنك لم تحسم قرارك بعد.";
        emoji = "🏊";
      } else if (percentage <= 26) {
        roast = "فوضى الفضول العاطفي! أنت على بُعد جرعة تيكيلا واحدة من تقبيل صديقك المقرّب، يا مغامر جريء!";
        emoji = "🍹";
      } else if (percentage <= 28) {
        roast = "إشارات مبهجة! يبدو أن لديك الكثير من اللمعان؛ شارك بعضًا منه مع الآخرين!";
        emoji = "🚨";
      } else if (percentage <= 30) {
        roast = "أنت منسجم تمامًا! لديك لوحة سرية على Pinterest للأولاد ذوي المظهر «الجمالي»، يا لك من شخص غامض!";
        emoji = "📌";
      } else if (percentage <= 32) {
        roast = "ميول قوس قزح! تقول إن الأمر مجرد «ذوق في الموضة»، يا صاحبة الحضور المتألقة!";
        emoji = "🌈";
      } else if (percentage <= 34) {
        roast = "ما زلت مترددًا! يبدو أنك محتار في اختيار فريقك ولا تستطيع اتخاذ قرار!";
        emoji = "⚖️";
      } else if (percentage <= 36) {
        roast = "الأجواء الكويرية تتصاعد! لم يبقَ لك سوى راية فخر لتكتمل إطلالتك، يا نجمة واعدة!";
        emoji = "🏳️‍🌈";
      } else if (percentage <= 38) {
        roast = "لا تحاول إخفاء ذلك حتى! تلاشت محاولتك للظهور بمظهر المستقيم، وكأنك تخوض تجربة تمثيل غير موفقة!";
        emoji = "🎭";
      } else if (percentage <= 40) {
        roast = "طاقة قوس قزح متألقة! توزّع الغمزات على الجميع، يا صاحب الغزل المرح!";
        emoji = "😉";
      } else if (percentage <= 42) {
        roast = "رادار التألق لديك في أقصى درجاته! أجواؤك أقوى من ختام عرض استعراضي، يا مصدر البهجة!";
        emoji = "🔊";
      } else if (percentage <= 44) {
        roast = "لن تخدعنا! خزانة ملابسك من زجاج، لذا يسهل رؤية ما بداخلها!";
        emoji = "🪞";
      } else if (percentage <= 46) {
        roast = "قوس قزح في طور التدريب! تتدرّب على خطواتك استعدادًا للاستعراض، يا أيقونة المستقبل!";
        emoji = "🚶‍♂️";
      } else if (percentage <= 48) {
        roast = "أوشكت على بلوغ قمة التألق! لمسة أخيرة تفصلك عن الإبهار، يا ملكة الأناقة!";
        emoji = "💄";
      } else if (percentage <= 50) {
        roast = "مزيج متوازن تمامًا! أنت 50/50 وتنشر الفوضى في كل مكان، يا لك من شخصية ثنائية الميول ومفعمة بالحيوية!";
        emoji = "⚖️";
      } else if (percentage <= 52) {
        roast = "تميل نحو المثلية! تميل بقوة حتى تكاد تسقط وسط قوس قزح، يا لك من شخص كثير الحماس!";
        emoji = "🌈";
      } else if (percentage <= 54) {
        roast = "تأكدت الأجواء! تخطف القلوب ثم تنكر ذلك، يا لك من شخص ماكر!";
        emoji = "💖";
      } else if (percentage <= 56) {
        roast = "وضع الفخر بأقصى طاقته! تلوّح بالراية وتقول إنها منشفة، يا صاحبة الحضور المتألقة!";
        emoji = "🏳️‍🌈";
      } else if (percentage <= 58) {
        roast = "البريق يجري في عروقك! تألّقك يفوق أروع أحلام يونيكورن، يا نجمًا متلألئًا!";
        emoji = "🦄";
      } else if (percentage <= 60) {
        roast = "يا نجم قوس قزح! أنت تتألق في أوساط الكويريين بثقة لا تعرف التردد، يا صاحب الحضور المهيب!";
        emoji = "👑";
      } else if (percentage <= 62) {
        roast = "متألق ومفعم بالحيوية! حضورك الأخّاذ يجعل ألوان قوس قزح تبدو عادية، يا أيقونة الفوضى الجميلة!";
        emoji = "🌈🔥";
      } else if (percentage <= 64) {
        roast = "تتألق ككرة الديسكو! بريقك ساطع للغاية، يا لك من نجم لامع!";
        emoji = "🪩";
      } else if (percentage <= 66) {
        roast = "قائد موكب الفخر! تقود المسيرة بمدافع اللمعان، يا ملكة الشجاعة!";
        emoji = "🎉";
      } else if (percentage <= 68) {
        roast = "ميول مثلية في أقصى درجاتها! أنت تعيد تعريف الروعة بطريقتك الخاصة، يا لك من شخصية أسطورية!";
        emoji = "⚡";
      } else if (percentage <= 70) {
        roast = "يا محارب قوس قزح! تتألق مع كل خطوة، يا نجمة لا تُقهَر!";
        emoji = "🗡️";
      } else if (percentage <= 72) {
        roast = "أيقونة كويرية قيد الإعداد! لم يبقَ لك سوى ارتداء شعر مستعار لتخطف الأضواء، يا نجمًا صاعدًا!";
        emoji = "🌟";
      } else if (percentage <= 74) {
        roast = "تألقك يفوق الوصف! أجواؤك الاحتفالية لا تُضاهى، يا أيقونة مميزة!";
        emoji = "🍾";
      } else if (percentage <= 76) {
        roast = "أجواء أسطورة متألقة! سحرك يجعل قوس قزح يغار منك، يا صاحب الإشراق!";
        emoji = "🏳️‍🌈🔥";
      } else if (percentage <= 78) {
        roast = "يا لك من أيقونة رائعة! تبدع ألوانًا جديدة من التألق، يا صاحب الحضور المميز!";
        emoji = "✨";
      } else if (percentage <= 80) {
        roast = "قوس قزح في أبهى صوره! حضورك المميّز يضفي على الكون سحرًا خاصًا!";
        emoji = "🌌";
      } else if (percentage <= 82) {
        roast = "أجواء كويرية في أوجها! أنت أكثر تألقًا من عربة استعراض مضيئة في موكب الفخر، يا قوة لا تُوقَف!";
        emoji = "🔥🏳️‍🌈";
      } else if (percentage <= 84) {
        roast = "تألّق كويري استثنائي! حضورك يعيد رسم الطيف بأكمله، يا أسطورة آسرة!";
        emoji = "🪐";
      } else if (percentage <= 86) {
        roast = "تألق يفوق كل المقاييس! أنت عاصفة فخر نابضة بالحياة، يا مدهشًا متألقًا!";
        emoji = "💥";
      } else if (percentage <= 88) {
        roast = "تحققت التفردية المثلية! بلغت من الاعتزاز بهويتك حدّ انهيار الكون المغاير، يا نجمة كونية!";
        emoji = "🌠";
      } else if (percentage <= 90) {
        roast = "سيّد قوس قزح! أنت تحكم عالمًا متعددًا ملوّنًا ببريقك وتألقك!";
        emoji = "👑🌈";
      } else if (percentage <= 92) {
        roast = "مكانة إلهية في التألق! روعة حضورك تعيد كتابة قصة الخلق، يا أيقونة استثنائية!";
        emoji = "🛐";
      } else if (percentage <= 94) {
        roast = "روعة لا تُضاهى! تألّقك يفوق ألوان قوس قزح، يا أيقونة سماوية!";
        emoji = "🌟🏳️‍🌈";
      } else if (percentage <= 96) {
        roast = "إطلاق نهاية العالم للمثلية! أنت تنهي مفهوم الاستقامة إلى الأبد، يا لك من شخصية أسطورية!";
        emoji = "🌈💥";
      } else if (percentage <= 98) {
        roast = "عملاق المثلية الأسمى! أنت تعيد صياغة الواقع بطريقتك، يا لك من شخصية استثنائية!";
        emoji = "🪐🔥";
      } else {
        roast = "إمبراطور كوني متألق! لقد تجاوزت كل التصنيفات المعروفة وأبدعت آفاقًا جديدة من التألق، يا رمز الفخر الذي لا يُقهَر!";
        emoji = "🌌👑💥";
      }

      let insult = "";
      if (percentage < 20) {
        insult = " يُرجى تجنّب إرسال رسائل مسيئة أو غير لائقة.";
      } else if (percentage > 80) {
        insult = " ينحني الكون أمام روعتك، يا أيقونة قوس قزح التي لا تُضاهى!";
      } else {
        const insults = [
          " أنت تتسبب في كثير من الفوضى!",
          " يبدو أن الأمور لم تسر على ما يرام إطلاقًا!",
          "حتى ظلك يبدو غير مقتنع!",
          "لديك حضور لا يُنسى، وإن لم يكن للأسباب المعتادة!",
          " شخصيتك تحتاج إلى بعض الترتيب!",
          " يبدو أنك بحاجة إلى بعض الانتعاش!",
          " وجودك أشبه بخطأ مطبعي كوني!",
          " أجواؤك هادئة لدرجة أن اللون البيج يبدو مثيرًا!",
          " توحي أجواؤك بأنك تمر بلحظات عاطفية في مواقف السيارات!",
          " تبدو مختلفًا تمامًا عن المعتاد!",
          " Your life's a bigger mess than a clown's makeup!",
          " حتى قراراتك غير الموفقة تبدو وكأنها عمل فني!",
          "يوحي حضورك بأنك ما زلت تحنّ إلى أيام الطفولة!",
          " يبدو أنك تجعل المحادثات الجماعية أقل حيوية!",
          " ذوقك الجمالي يثير الجدل!",
          "لنضف قليلًا من الحيوية إلى الأمر!",
          " يبدو أن أسلوبك بأكمله يعاني من خطأ 404!",
          "بفضلك، تبدو موسيقى المصاعد مشوّقة!",
          "تبدو حياتك مليئة بالتحديات أكثر من مسلسل درامي!",
          " يبدو أنك تفتقر إلى الحيوية!",
        ];
        insult = insults[Math.floor(Math.random() * insults.length)];
      }

      const resultMsg = `╭─❏ 「 GAY METER」
│ *TARGET:* @${targetNumber}
│ *GAY PERCENTAGE:* ${percentage}% ${emoji}
│ 
│ *VERDICT:* ${roast}${insult}
│ 
│ *DISCLAIMER:* This is 100% accurate
│ and scientific, you sensitive
│ snowflake! Cry about it!
╰───────────────
> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

      await client.sendMessage(
        m.chat,
        {
          text: resultMsg,
          mentions: [targetUser] }
      );

      if (checkingMsg && checkingMsg.key) {
        try {
          await client.sendMessage(m.chat, {
            delete: checkingMsg.key });
        } catch (deleteError) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
          console.error(`Failed to delete checking message: ${deleteError.stack}`);
        }
      }
    } catch (error) {
    await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
      console.error(`Gaycheck command detonated: ${error.stack}`);
      await sendInteractive(client, m, `╭─❏ 「 Cʀᴀsʜᴇᴅ」
│ This shit blew up harder than your\n│ ego! Can't check gay levels now,\n│ you doomed idiot!\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
    }
  } };
