import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    name: 'help',
    aliases: ['h', 'usage', 'howto'],
    description: 'Shows help and usage for a specific command',
    run: async (context) => {
        const { client, m, args, prefix } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const effectivePrefix = prefix || '.';

        const fmt = (title, body) =>
            `╭─❏ 「 ${title}」
${body}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;

        if (!args || args.length === 0) {
            const pluginsDir = path.join(__dirname, '..');
            const categories = fs.readdirSync(pluginsDir).filter(f => fs.statSync(path.join(pluginsDir, f)).isDirectory());
            let allCommands = [];
            for (const cat of categories) {
                const files = fs.readdirSync(path.join(pluginsDir, cat)).filter(f => f.endsWith('.js'));
                for (const file of files) {
                    allCommands.push(file.replace('.js', ''));
                }
            }
            allCommands.sort();

            const body = allCommands.map(cmd => `│ *${effectivePrefix}${cmd}*`).join('\n');
            await client.sendMessage(m.chat, {
                text: fmt('ALL COMMANDS', `│ Total: ${allCommands.length} commands\n│ Use *${effectivePrefix}help <command>* for full usage + description\n│ \n${body}`)
            });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});
            return;
        }

        const cmdName = args[0].toLowerCase().replace(/^\./, '');

        const helpData = {
            waifu: { usage: `${effectivePrefix}waifu`, desc: 'احصل على صورة عشوائية لشخصية أنمي نسائية. الأسماء البديلة: animegirl, waifupic' },
            neko: { usage: `${effectivePrefix}neko`, desc: 'احصل على صورة عشوائية لشخصية فتاة قطة. الأسماء البديلة: catgirl, nekopic' },
            husbando: { usage: `${effectivePrefix}husbando`, desc: 'احصل على صورة عشوائية لشخصية أنمي رجالية. الأسماء البديلة: animeguy, husbandopic' },
            maid: { usage: `${effectivePrefix}maid`, desc: 'Get a random anime maid image.' },
            uniform: { usage: `${effectivePrefix}uniform`, desc: 'Get a random anime uniform image.' },
            glossysilver: { usage: `${effectivePrefix}glossysilver <text>`, desc: 'أنشئ نصًا فضيًا لامعًا بتأثير ثلاثي الأبعاد (بحد أقصى 50 حرفًا).' },
            glitchtext: { usage: `${effectivePrefix}glitchtext <text>`, desc: 'Generate digital glitch text effect.' },
            advancedglow: { usage: `${effectivePrefix}advancedglow <text>`, desc: 'Generate advanced glowing text.' },
            neonglitch: { usage: `${effectivePrefix}neonglitch <text>`, desc: 'Generate neon glitch text effect.' },
            gradienttext: { usage: `${effectivePrefix}gradienttext <text>`, desc: 'Generate 3D gradient text.' },
            glowingtext: { usage: `${effectivePrefix}glowingtext <text>`, desc: 'Generate glowing text effect.' },
            luxurygold: { usage: `${effectivePrefix}luxurygold <text>`, desc: 'Generate luxury gold text.' },
            multicolored: { usage: `${effectivePrefix}multicolored <text>`, desc: 'Generate multicolored neon text.' },
            galaxytext: { usage: `${effectivePrefix}galaxytext <text>`, desc: 'Generate galaxy style text wallpaper.' },
            makingneon: { usage: `${effectivePrefix}makingneon <text>`, desc: 'Generate royal neon text.' },
            writetext: { usage: `${effectivePrefix}writetext <text>`, desc: 'Generate wet glass text effect.' },
            underwater: { usage: `${effectivePrefix}underwater <text>`, desc: 'Generate 3D underwater text.' },
            pixelglitch: { usage: `${effectivePrefix}pixelglitch <text>`, desc: 'Generate pixel glitch text.' },
            summerbeach: { usage: `${effectivePrefix}summerbeach <text>`, desc: 'Generate summer beach text.' },
            papercut: { usage: `${effectivePrefix}papercut <text>`, desc: 'Generate 3D paper cut text.' },
            cloudtext: { usage: `${effectivePrefix}cloudtext <text>`, desc: 'Generate text in clouds effect.' },
            gradientlogo: { usage: `${effectivePrefix}gradientlogo <text>`, desc: 'Generate 3D gradient logo.' },
            galaxylogo: { usage: `${effectivePrefix}galaxylogo <text>`, desc: 'Generate galaxy style logo.' },
            colorfulneon: { usage: `${effectivePrefix}colorfulneon <text>`, desc: 'Generate colorful neon text.' },
            greenneon: { usage: `${effectivePrefix}greenneon <text>`, desc: 'Generate green neon text.' },
            '1917text': { usage: `${effectivePrefix}1917text <text>`, desc: 'Generate 1917 war style text.' },
            texteffect: { usage: `${effectivePrefix}texteffect <text>`, desc: 'Generate 3D hologram text effect.' },
            lighteffect: { usage: `${effectivePrefix}lighteffect <text>`, desc: 'Generate green light effect text.' },
            bearlogo: { usage: `${effectivePrefix}bearlogo <text>`, desc: 'Generate a bear mascot logo.' },
            typography: { usage: `${effectivePrefix}typography <text>`, desc: 'Generate typography pavement text.' },
            hackerneon: { usage: `${effectivePrefix}hackerneon <text>`, desc: 'Generate hacker cyan neon text.' },
            blackpinklogo: { usage: `${effectivePrefix}blackpinklogo <text>`, desc: 'Generate Blackpink style logo.' },
            blackpinkstyle: { usage: `${effectivePrefix}blackpinkstyle <text>`, desc: 'Generate Blackpink style text.' },
            erasertext: { usage: `${effectivePrefix}erasertext <text>`, desc: 'Generate eraser deleting text effect.' },
            cartoonstyle: { usage: `${effectivePrefix}cartoonstyle <text>`, desc: 'Generate cartoon graffiti text.' },
            sora: { usage: `${effectivePrefix}sora <description>`, desc: 'أنشئ مشهدًا سينمائيًا باستخدام الذكاء الاصطناعي. الأسماء البديلة: soraai, aifilm' },
            menu: { usage: `${effectivePrefix}menu`, desc: 'Shows the main interactive menu with all categories.' },
            fullmenu: { usage: `${effectivePrefix}fullmenu`, desc: 'Shows all commands listed by category.' },
            help: { usage: `${effectivePrefix}help [command]`, desc: 'Shows help/usage for all or a specific command.' },
            ping: { usage: `${effectivePrefix}ping`, desc: 'Check the bot response speed/latency.' },
            alive: { usage: `${effectivePrefix}alive`, desc: 'Check if the bot is online and running.' },
            uptime: { usage: `${effectivePrefix}uptime`, desc: 'Shows how long the bot has been running.' },
            settings: { usage: `${effectivePrefix}settings`, desc: 'View current bot settings.' },
            mode: { usage: `${effectivePrefix}mode <public|private|sudo>`, desc: 'تغيير وضع البوت. Public = للجميع، Private = للمالك فقط، Sudo = لمستخدمي sudo أيضًا.' },
            prefix: { usage: `${effectivePrefix}prefix <newprefix>`, desc: 'Change the command prefix.' },
            presence: { usage: `${effectivePrefix}presence <online|offline|typing|recording>`, desc: 'Set the bot presence status in private chats.' },
            autoread: { usage: `${effectivePrefix}autoread <on|off>`, desc: 'Auto read private messages.' },
            autoview: { usage: `${effectivePrefix}autoview <on|off>`, desc: 'Auto view status updates.' },
            autolike: { usage: `${effectivePrefix}autolike <on|off>`, desc: 'Auto like/react to status updates.' },
            autobio: { usage: `${effectivePrefix}autobio <on|off>`, desc: 'Auto update bio with current time.' },
            anticall: { usage: `${effectivePrefix}anticall <on|off>`, desc: 'Auto reject incoming calls and ban caller.' },
            antilink: { usage: `${effectivePrefix}antilink <delete|remove|off>`, desc: 'تفعيل antilink لكل مجموعة. delete = التحذير والحذف، remove = طرد المرسل، off = تعطيل الميزة. يجب أن تكون في مجموعة.' },
            antitag: { usage: `${effectivePrefix}antitag <on|off>`, desc: 'Per-group antitag. Removes members who mass-tag others. Must be in a group.' },
            antistatusmention: { usage: `${effectivePrefix}antistatusmention <delete|remove|off>`, desc: 'إعداد مكافحة الإشارة لكل مجموعة. delete = حذف وإرسال تحذير، remove = طرد، off = إيقاف. يجب استخدامه داخل مجموعة.' },
            antidelete: { usage: `${effectivePrefix}antidelete <on|off>`, desc: 'Forward deleted messages to your DM.' },
            antiedit: { usage: `${effectivePrefix}antiedit <on|off>`, desc: 'Forward original message when someone edits.' },
            antidemote: { usage: `${effectivePrefix}antidemote <on|off>`, desc: 'Per-group: re-promote admins if someone demotes them.' },
            antipromote: { usage: `${effectivePrefix}antipromote <on|off>`, desc: 'Per-group: prevent unauthorized promotions.' },
            antiforeign: { usage: `${effectivePrefix}antiforeign <on|off>`, desc: 'Remove non-local phone numbers from the group.' },
            autoai: { usage: `${effectivePrefix}autoai <on|off>`, desc: 'Enable AI auto-reply in DMs and when mentioned in groups. AI can also execute bot commands intelligently.' },
            chatbotpm: { usage: `${effectivePrefix}chatbotpm <on|off>`, desc: 'فعّل روبوت المحادثة بالذكاء الاصطناعي في الرسائل الخاصة (مثل autoai).' },
            toxicai: { usage: `${effectivePrefix}toxicai <on|off>`, desc: 'فعّل ToxicAgent (مساعد الذكاء الاصطناعي من GitHub) للمطوّر.' },
            gcpresence: { usage: `${effectivePrefix}gcpresence <on|off>`, desc: 'Set typing/recording presence in groups.' },
            events: { usage: `${effectivePrefix}events <on|off>`, desc: 'Toggle group join/leave event messages.' },
            stickerwm: { usage: `${effectivePrefix}stickerwm <packname>`, desc: 'Set custom sticker watermark/packname.' },
            ban: { usage: `${effectivePrefix}ban @user`, desc: 'Ban a user from using the bot.' },
            unban: { usage: `${effectivePrefix}unban @user`, desc: 'Unban a previously banned user.' },
            banlist: { usage: `${effectivePrefix}banlist`, desc: 'View all banned users.' },
            addsudo: { usage: `${effectivePrefix}addsudo @user`, desc: 'Add a sudo/trusted user.' },
            delsudo: { usage: `${effectivePrefix}delsudo @user`, desc: 'Remove a sudo user.' },
            checksudo: { usage: `${effectivePrefix}checksudo`, desc: 'List all sudo users.' },
            sticker: { usage: `${effectivePrefix}sticker`, desc: 'Convert image/video/gif to sticker. Reply to media.' },
            toimg: { usage: `${effectivePrefix}toimg`, desc: 'Convert sticker to image. Reply to sticker.' },
            tovid: { usage: `${effectivePrefix}tovid`, desc: 'Convert sticker/gif to video. Reply to media.' },
            togif: { usage: `${effectivePrefix}togif`, desc: 'Convert video to GIF.' },
            tts: { usage: `${effectivePrefix}tts <text>`, desc: 'Convert text to speech audio.' },
            tr: { usage: `${effectivePrefix}tr <lang> <text>`, desc: 'Translate text. Example: .tr es Hello World' },
            ytmp3: { usage: `${effectivePrefix}ytmp3 <url|title>`, desc: 'Download YouTube audio as MP3.' },
            ytmp4: { usage: `${effectivePrefix}ytmp4 <url|title>`, desc: 'Download YouTube video as MP4.' },
            yts: { usage: `${effectivePrefix}yts <query>`, desc: 'Search YouTube for videos.' },
            tikdl: { usage: `${effectivePrefix}tikdl <url>`, desc: 'Download TikTok video without watermark.' },
            tikaudio: { usage: `${effectivePrefix}tikaudio <url>`, desc: 'Download TikTok audio.' },
            igdl: { usage: `${effectivePrefix}igdl <url>`, desc: 'Download Instagram post/reel.' },
            fbdl: { usage: `${effectivePrefix}fbdl <url>`, desc: 'Download Facebook video.' },
            twtdl: { usage: `${effectivePrefix}twtdl <url>`, desc: 'Download Twitter/X video.' },
            spotify: { usage: `${effectivePrefix}spotify <song name>`, desc: 'Search and download Spotify track.' },
            alldl: { usage: `${effectivePrefix}alldl <url>`, desc: 'Universal media downloader.' },
            play: { usage: `${effectivePrefix}play <song name>`, desc: 'Search and play a song.' },
            song: { usage: `${effectivePrefix}song <title>`, desc: 'Download a song by title.' },
            image: { usage: `${effectivePrefix}image <query>`, desc: 'Search for images.' },
            video: { usage: `${effectivePrefix}video <query>`, desc: 'Search for videos.' },
            gpt: { usage: `${effectivePrefix}gpt <prompt>`, desc: 'Chat with GPT AI.' },
            gemini: { usage: `${effectivePrefix}gemini <prompt>`, desc: 'Chat with Google Gemini AI.' },
            groq: { usage: `${effectivePrefix}groq <prompt>`, desc: 'تحدّث مع Groq AI (سريع).' },
            darkgpt: { usage: `${effectivePrefix}darkgpt <prompt>`, desc: 'تحدّث مع DarkGPT (من دون قيود).' },
            imagine: { usage: `${effectivePrefix}imagine <prompt>`, desc: 'Generate AI images from text.' },
            sora: { usage: `${effectivePrefix}sora <prompt>`, desc: 'Generate AI video from text.' },
            remini: { usage: `${effectivePrefix}remini`, desc: 'Enhance/upscale an image. Reply to image.' },
            vision: { usage: `${effectivePrefix}vision <question>`, desc: 'Ask AI about an image. Reply to image with question.' },
            transcribe: { usage: `${effectivePrefix}transcribe`, desc: 'Transcribe audio to text. Reply to audio.' },
            tagall: { usage: `${effectivePrefix}tagall [message]`, desc: 'Tag all group members with optional message.' },
            hidetag: { usage: `${effectivePrefix}hidetag [message]`, desc: 'الإشارة إلى جميع الأعضاء بصمت (إشارة مخفية).' },
            promote: { usage: `${effectivePrefix}promote @user`, desc: 'Make a group member admin.' },
            demote: { usage: `${effectivePrefix}demote @user`, desc: 'Remove admin from a group member.' },
            remove: { usage: `${effectivePrefix}remove @user`, desc: 'Remove/kick a member from the group.' },
            add: { usage: `${effectivePrefix}add <number>`, desc: 'Add a member to the group.' },
            open: { usage: `${effectivePrefix}open`, desc: 'Open the group to all members.' },
            close: { usage: `${effectivePrefix}close`, desc: 'أغلق المجموعة (للمشرفين فقط).' },
            link: { usage: `${effectivePrefix}link`, desc: 'Get the group invite link.' },
            revoke: { usage: `${effectivePrefix}revoke`, desc: 'Reset the group invite link.' },
            groupmeta: { usage: `${effectivePrefix}groupmeta`, desc: 'Show group metadata/info.' },
            gpp: { usage: `${effectivePrefix}gpp`, desc: 'Get group profile picture.' },
            gstatus: { usage: `${effectivePrefix}gstatus <text>`, desc: 'Set group description.' },
            listonline: { usage: `${effectivePrefix}listonline`, desc: 'List online members in group.' },
            requests: { usage: `${effectivePrefix}requests`, desc: 'View pending join requests.' },
            'approve-all': { usage: `${effectivePrefix}approve-all`, desc: 'Approve all pending join requests.' },
            'reject-all': { usage: `${effectivePrefix}reject-all`, desc: 'Reject all pending join requests.' },
            foreigners: { usage: `${effectivePrefix}foreigners`, desc: 'List non-local phone numbers in group.' },
            xkill: { usage: `${effectivePrefix}xkill`, desc: 'Kick all non-admin members from the group.' },
            google: { usage: `${effectivePrefix}google <query>`, desc: 'Search Google.' },
            wiki: { usage: `${effectivePrefix}wiki <query>`, desc: 'Search Wikipedia.' },
            github: { usage: `${effectivePrefix}github <username>`, desc: 'Get GitHub user profile.' },
            lyrics: { usage: `${effectivePrefix}lyrics <song name>`, desc: 'Get song lyrics.' },
            movie: { usage: `${effectivePrefix}movie <title>`, desc: 'Get movie info.' },
            npm: { usage: `${effectivePrefix}npm <package>`, desc: 'Get NPM package info.' },
            wallpaper: { usage: `${effectivePrefix}wallpaper <query>`, desc: 'Search wallpapers.' },
            stickersearch: { usage: `${effectivePrefix}stickersearch <query>`, desc: 'Search sticker packs.' },
            weather: { usage: `${effectivePrefix}weather <city>`, desc: 'Get weather info for a city.' },
            dev: { usage: `${effectivePrefix}dev`, desc: 'Get developer contact info.' },
            support: { usage: `${effectivePrefix}support`, desc: 'Get support group link.' },
            script: { usage: `${effectivePrefix}script`, desc: 'Get the bot script/source code link.' },
            credits: { usage: `${effectivePrefix}credits`, desc: 'Show bot credits.' },
            pair: { usage: `${effectivePrefix}pair <number>`, desc: 'Pair bot with a WhatsApp number.' },
            update: { usage: `${effectivePrefix}update`, desc: 'Check for bot updates on Heroku.' },
            setvar: { usage: `${effectivePrefix}setvar <KEY> <VALUE>`, desc: 'Set a Heroku config var.' },
            getvar: { usage: `${effectivePrefix}getvar <KEY>`, desc: 'Get a Heroku config var.' },
            allvar: { usage: `${effectivePrefix}allvar`, desc: 'List all Heroku config vars.' },
            eval: { usage: `${effectivePrefix}eval <code>`, desc: 'نفّذ شيفرة JavaScript (للمالك فقط).' },
            shell: { usage: `${effectivePrefix}shell <command>`, desc: 'نفّذ أوامر shell (للمالك فقط).' },
            restart: { usage: `${effectivePrefix}restart`, desc: 'أعِد تشغيل البوت (للمالك فقط).' },
            broadcast: { usage: `${effectivePrefix}broadcast <message>`, desc: 'Broadcast a message to all chats.' },
            botgc: { usage: `${effectivePrefix}botgc`, desc: 'List all groups the bot is in.' },
            joingc: { usage: `${effectivePrefix}joingc <link>`, desc: 'Make bot join a group via invite link.' },
            leavegc: { usage: `${effectivePrefix}leavegc`, desc: 'Make bot leave the current group.' },
            block: { usage: `${effectivePrefix}block @user`, desc: 'Block a user.' },
            unblock: { usage: `${effectivePrefix}unblock @user`, desc: 'Unblock a user.' },
            profile: { usage: `${effectivePrefix}profile @user`, desc: 'View a user profile/info.' },
            screenshot: { usage: `${effectivePrefix}screenshot <url>`, desc: 'Take a screenshot of a website.' },
            shorten: { usage: `${effectivePrefix}shorten <url>`, desc: 'Shorten a long URL.' },
            tinyurl: { usage: `${effectivePrefix}tinyurl <url>`, desc: 'Shorten URL using TinyURL.' },
            checkid: { usage: `${effectivePrefix}checkid <group link|channel link>`, desc: 'Get the ID from a group or channel link.' },
            privacy: { usage: `${effectivePrefix}privacy <setting> <value>`, desc: 'Manage WhatsApp privacy settings.' },
            lastseen: { usage: `${effectivePrefix}lastseen <on|off>`, desc: 'Toggle last seen visibility.' },
            mypp: { usage: `${effectivePrefix}mypp`, desc: 'View your own profile picture.' },
            mystatus: { usage: `${effectivePrefix}mystatus <text>`, desc: 'Set your WhatsApp status/about.' },
            online: { usage: `${effectivePrefix}online <on|off>`, desc: 'Toggle online status.' },
            groupadd: { usage: `${effectivePrefix}groupadd <on|off>`, desc: 'Control who can add the bot to groups.' },
            del: { usage: `${effectivePrefix}del`, desc: 'Delete a message. Reply to the message to delete.' },
            retrieve: { usage: `${effectivePrefix}retrieve`, desc: 'Retrieve/reveal a view-once message.' },
            fetch: { usage: `${effectivePrefix}fetch <url>`, desc: 'Fetch data from a URL.' },
            upload: { usage: `${effectivePrefix}upload`, desc: 'Upload media to get a URL. Reply to media.' },
            mediafire: { usage: `${effectivePrefix}mediafire <url>`, desc: 'Download from Mediafire.' },
            apk: { usage: `${effectivePrefix}apk <app name>`, desc: 'Download an APK.' },
            gitclone: { usage: `${effectivePrefix}gitclone <url>`, desc: 'Clone a GitHub repository.' },
            pinterest: { usage: `${effectivePrefix}pinterest <query>`, desc: 'Search Pinterest images.' },
            shazam: { usage: `${effectivePrefix}shazam`, desc: 'Identify a song from audio. Reply to audio.' },
            carbon: { usage: `${effectivePrefix}carbon <code>`, desc: 'Generate a Carbon code image.' },
            encrypt: { usage: `${effectivePrefix}encrypt <text>`, desc: 'Encrypt text.' },
            'run-js': { usage: `${effectivePrefix}run-js <code>`, desc: 'Run JavaScript code.' },
            'run-py': { usage: `${effectivePrefix}run-py <code>`, desc: 'Run Python code.' },
            hentai: { usage: `${effectivePrefix}hentai`, desc: 'محتوى للبالغين (للمجموعات المخصصة لمن هم فوق 18 عامًا فقط).' },
            xvideos: { usage: `${effectivePrefix}xvideos <query>`, desc: 'البحث عن محتوى غير ملائم للعمل (للمجموعات المخصصة لمن هم فوق 18 عامًا فقط).' },
            vvx: { usage: `${effectivePrefix}vvx`, desc: 'View view-once messages. Reply to view-once.' },
            hug: { usage: `${effectivePrefix}hug @user`, desc: 'Send a hug anime GIF to a user.' },
            kiss: { usage: `${effectivePrefix}kiss @user`, desc: 'Send a kiss anime GIF to a user.' },
            slap: { usage: `${effectivePrefix}slap @user`, desc: 'Send a slap anime GIF to a user.' },
            pat: { usage: `${effectivePrefix}pat @user`, desc: 'Send a pat anime GIF to a user.' },
            blush: { usage: `${effectivePrefix}blush`, desc: 'Send a blushing anime image.' },
            smug: { usage: `${effectivePrefix}smug`, desc: 'Send a smug anime image.' },
            shinobu: { usage: `${effectivePrefix}shinobu`, desc: 'Get a random Shinobu image.' },
            miko: { usage: `${effectivePrefix}miko`, desc: 'Get a random miko anime image.' },
            kitsune: { usage: `${effectivePrefix}kitsune`, desc: 'Get a random kitsune anime image.' },
            oppai: { usage: `${effectivePrefix}oppai`, desc: 'NSFW: صورة عشوائية لأوبي (للمجموعات المخصّصة لمن هم فوق 18 عامًا فقط).' },
            waifu: { usage: `${effectivePrefix}waifu`, desc: 'Get a random anime waifu image.' },
            neko: { usage: `${effectivePrefix}neko`, desc: 'احصل على صورة عشوائية لنيكو (فتاة بملامح قطط).' },
            husbando: { usage: `${effectivePrefix}husbando`, desc: 'Get a random husbando image.' },
            maid: { usage: `${effectivePrefix}maid`, desc: 'Get a random anime maid image.' },
            uniform: { usage: `${effectivePrefix}uniform`, desc: 'Get a random anime uniform image.' },
            advice: { usage: `${effectivePrefix}advice`, desc: 'Get a random piece of advice.' },
            catfact: { usage: `${effectivePrefix}catfact`, desc: 'Get a random cat fact.' },
            fact: { usage: `${effectivePrefix}fact`, desc: 'Get a random fact.' },
            quote: { usage: `${effectivePrefix}quote`, desc: 'Get a random inspirational quote.' },
            joke: { usage: `${effectivePrefix}joke`, desc: 'Get a random joke.' },
            coinflip: { usage: `${effectivePrefix}coinflip`, desc: 'اقلب قطعة نقدية — صورة أم كتابة.' },
            dice: { usage: `${effectivePrefix}dice`, desc: 'Roll a dice.' },
            calc: { usage: `${effectivePrefix}calc <expression>`, desc: 'احسب تعبيرًا رياضيًا. مثال: .calc 2+2*5' },
            country: { usage: `${effectivePrefix}country <name>`, desc: 'Get info about a country.' },
            alay: { usage: `${effectivePrefix}alay <text>`, desc: 'Convert text to alay style.' },
            afk: { usage: `${effectivePrefix}afk [reason]`, desc: 'Set AFK status. Bot will auto-reply when someone mentions you.' },
            warn: { usage: `${effectivePrefix}warn @user`, desc: 'Warn a group member. Removes them on reaching warn limit.' },
            poll: { usage: `${effectivePrefix}poll <question|option1|option2>`, desc: 'Create a poll in the group.' },
            pin: { usage: `${effectivePrefix}pin`, desc: 'Pin a message. Reply to the message to pin.' },
            xkill: { usage: `${effectivePrefix}xkill`, desc: 'أخرج جميع أعضاء المجموعة غير المشرفين (للمالك فقط).' },
            foreigners: { usage: `${effectivePrefix}foreigners`, desc: 'List members with non-local phone numbers in group.' },
            gstatus: { usage: `${effectivePrefix}gstatus <text>`, desc: 'Set the group description/status.' },
            qr: { usage: `${effectivePrefix}qr <text>`, desc: 'Generate a QR code from text or URL.' },
            password: { usage: `${effectivePrefix}password <length>`, desc: 'Generate a random secure password.' },
            base64: { usage: `${effectivePrefix}base64 <text>`, desc: 'Encode text to Base64.' },
            stt: { usage: `${effectivePrefix}stt`, desc: 'Speech to text. Reply to a voice note to transcribe it.' },
            telesticker: { usage: `${effectivePrefix}telesticker`, desc: 'Download a Telegram sticker pack.' },
            bilibili: { usage: `${effectivePrefix}bilibili <url>`, desc: 'Download video from Bilibili.' },
            capcut: { usage: `${effectivePrefix}capcut <url>`, desc: 'Download a CapCut template video.' },
            snackvideo: { usage: `${effectivePrefix}snackvideo <url>`, desc: 'Download from Snack Video.' },
            soundcloud: { usage: `${effectivePrefix}soundcloud <query>`, desc: 'Search and download from SoundCloud.' },
            threads: { usage: `${effectivePrefix}threads <url>`, desc: 'نزّل فيديو أو صورة من Threads (Meta).' },
            video: { usage: `${effectivePrefix}video <query>`, desc: 'Search and send a YouTube video.' },
            yt: { usage: `${effectivePrefix}yt <query>`, desc: 'YouTube search. Alias for yts.' },
            reaction: { usage: `${effectivePrefix}reaction <on|off>`, desc: 'Toggle auto reactions to messages.' },
            multiprefix: { usage: `${effectivePrefix}multiprefix <on|off>`, desc: 'تفعيل بادئات متعددة للأوامر (مثل . و! و# و/ وغيرها).' },
            startmessage: { usage: `${effectivePrefix}startmessage <on|off>`, desc: 'Toggle the bot greeting message on start.' },
            stealth: { usage: `${effectivePrefix}stealth <on|off>`, desc: 'وضع التخفي — لا يستجيب البوت إلا للمالك، ويختفي عن الجميع سواه.' },
            toanime: { usage: `${effectivePrefix}toanime`, desc: 'Convert an image to anime art style. Reply to image.' },
            aicode: { usage: `${effectivePrefix}aicode <lang> <prompt>`, desc: 'Generate code using AI. Example: .aicode python fibonacci' },
            codegen: { usage: `${effectivePrefix}codegen <description>`, desc: 'Generate code from a description using AI.' },
            darkgpt: { usage: `${effectivePrefix}darkgpt <prompt>`, desc: 'دردشة ذكاء اصطناعي غير مقيّدة (DarkGPT). استخدمها بمسؤولية.' },
            sora: { usage: `${effectivePrefix}sora <description>`, desc: 'Generate an AI scene/image from a cinematic description.' },
            logogen: { usage: `${effectivePrefix}logogen <title|idea|slogan>`, desc: 'Generate a logo image using AI.' },
            rip: { usage: `${effectivePrefix}rip`, desc: 'Generate a RIP/tombstone image. Reply to a user or image.' },
            trigger: { usage: `${effectivePrefix}trigger`, desc: 'أنشئ صورة ميم بعنوان "TRIGGERED". ردّ على صورة.' },
            trash: { usage: `${effectivePrefix}trash`, desc: 'Put someone in the trash. Reply to image or user.' },
            wanted: { usage: `${effectivePrefix}wanted`, desc: 'Generate a wanted poster. Reply to image.' },
            wasted: { usage: `${effectivePrefix}wasted`, desc: 'Generate a GTA wasted screen. Reply to image.' },
            emix: { usage: `${effectivePrefix}emix <emoji>`, desc: 'Mix two emojis together.' },
            removebg: { usage: `${effectivePrefix}removebg`, desc: 'Remove background from an image. Reply to image.' },
            brat: { usage: `${effectivePrefix}brat <text>`, desc: 'Generate a brat-style text image.' },
            bratvid: { usage: `${effectivePrefix}bratvid <text>`, desc: 'Generate a brat-style text video.' },
            inspectweb: { usage: `${effectivePrefix}inspectweb <url>`, desc: 'Inspect/analyze a website URL.' },
            broadcast: { usage: `${effectivePrefix}broadcast <message>`, desc: 'أرسل رسالة إلى جميع الدردشات (للمالك فقط).' },
            autolikeemoji: { usage: `${effectivePrefix}autolikeemoji <emoji|random>`, desc: 'Set the emoji used for auto-liking statuses.' },
            requests: { usage: `${effectivePrefix}requests`, desc: 'View pending join requests in the group.' },
            'approve-all': { usage: `${effectivePrefix}approve-all`, desc: 'Approve all pending join requests.' },
            'reject-all': { usage: `${effectivePrefix}reject-all`, desc: 'Reject all pending join requests.' },
              canvas: { usage: `${effectivePrefix}canvas Title | type | text | watermark`, desc: 'أنشئ بطاقة canvas بتصميم مميز انطلاقًا من صورة تم الرد عليها. الأنواع: spotify, youtube, google, tiktok, duckduckgo, brave, applemusic, soundcloud, pinterest, playstore, happymod, apkpure, unsplash, wallpaper, wattpad, weather, sticker, lyrics, shazam, web, image. الأسماء البديلة: canvascard, spotifycard, youtubecard, tiktokcard' },
              canvascard: { usage: `${effectivePrefix}canvas Title | type | text | watermark`, desc: 'اسم مستعار لـ canvas — أداة لإنشاء بطاقات canvas بتصاميم متنوعة.' },
              spotifycard: { usage: `${effectivePrefix}canvas Title | spotify | text | watermark`, desc: 'Alias for canvas with spotify type.' },
              remini: { usage: `${effectivePrefix}remini`, desc: 'حسّن الصورة التي ترد عليها وارفع دقتها باستخدام الذكاء الاصطناعي. أرسل ردًا على صورة. الأسماء البديلة: hd, enhance, upscale' },
              hd: { usage: `${effectivePrefix}hd`, desc: 'اسم بديل لـ remini — لتحسين الصور بالذكاء الاصطناعي.' },
              enhance: { usage: `${effectivePrefix}enhance`, desc: 'اسم بديل لـ remini — لتحسين الصور بالذكاء الاصطناعي.' },
              upscale: { usage: `${effectivePrefix}upscale`, desc: 'اسم بديل لـ remini — تحسين دقة الصور بالذكاء الاصطناعي.' },
              imgedit: { usage: `${effectivePrefix}imgedit <prompt>`, desc: 'عدّل صورة رُدّ عليها باستخدام وصف نصي. مثال: .imgedit اجعلها تبدو بأسلوب الأنمي. الأسماء البديلة: imageedit, aiedit, editimg' },
              imageedit: { usage: `${effectivePrefix}imgedit <prompt>`, desc: 'اسم مستعار لـ imgedit — تعديل الصور بالذكاء الاصطناعي باستخدام وصف نصي.' },
              aiedit: { usage: `${effectivePrefix}aiedit <prompt>`, desc: 'اختصار لـ imgedit — تعديل الصور بالذكاء الاصطناعي.' },
              rc: { usage: `${effectivePrefix}rc <prompt>`, desc: 'أنشئ صورة بالذكاء الاصطناعي باستخدام وصف نصي. مثال: .rc a futuristic city at night. الأسماء البديلة: imagine, texttoimage, tti' },
              imagine: { usage: `${effectivePrefix}imagine <prompt>`, desc: 'اختصار لـ rc — إنشاء الصور بالذكاء الاصطناعي.' },
              tti: { usage: `${effectivePrefix}tti <prompt>`, desc: 'اختصار لـ rc — تحويل النص إلى صورة.' },
              aisong: { usage: `${effectivePrefix}aisong <description>`, desc: 'أنشئ أغنية باستخدام الذكاء الاصطناعي انطلاقًا من وصف. مثال: .aisong أغنية lofi حزينة عن الوحدة. الأسماء البديلة: gensong, makesong' },
              gensong: { usage: `${effectivePrefix}gensong <description>`, desc: 'اسم بديل لـ aisong — إنشاء الأغاني بالذكاء الاصطناعي.' },
              makesong: { usage: `${effectivePrefix}makesong <description>`, desc: 'اختصار لـ aisong — إنشاء الأغاني بالذكاء الاصطناعي.' },
              allow: { usage: `${effectivePrefix}allow add|remove|list [@user]`, desc: 'للمالك فقط. أدر قائمة المستخدمين المسموح لهم باستخدام البوت. الأوامر الفرعية: add @user — إضافة مستخدم إلى القائمة، remove @user — إزالته، list — عرض جميع المستخدمين المسموح لهم.' },
            device: { usage: `${effectivePrefix}device <android|ios|default>`, desc: 'حدّد نمط عرض الأزرار. android/default = أزرار على هيئة قائمة اختيار؛ ios = ردود نصية فقط (من دون أزرار). للمالك فقط.' },
            setdevice: { usage: `${effectivePrefix}setdevice <android|ios|default>`, desc: 'اسم بديل للجهاز — يحدّد وضع عرض الأزرار.' },
            devicemode: { usage: `${effectivePrefix}devicemode <android|ios|default>`, desc: 'اسم بديل للجهاز — يحدّد وضع عرض الأزرار.' },
            platform: { usage: `${effectivePrefix}platform <android|ios|default>`, desc: 'اسم بديل للجهاز — يحدّد وضع عرض الأزرار.' },
            script: { usage: `${effectivePrefix}script`, desc: 'يعرض رابط مستودع البوت على GitHub. الأسماء البديلة: repo, source, github-src' },
            repo: { usage: `${effectivePrefix}repo`, desc: 'اسم بديل للأمر script — يعرض رابط مستودع GitHub.' },
            up: { usage: `${effectivePrefix}up`, desc: 'اسم بديل لأمر uptime — للتحقّق من مدة تشغيل البوت.' },
            p: { usage: `${effectivePrefix}p`, desc: 'اسم بديل للأمر ping — يتحقق من سرعة استجابة البوت.' },
            m: { usage: `${effectivePrefix}m`, desc: 'اسم بديل للقائمة — يعرض قائمة الأوامر التفاعلية.' },
            h: { usage: `${effectivePrefix}h [command]`, desc: 'اسم بديل لأمر help — يعرض المساعدة لجميع الأوامر أو لأمر محدد.' },
            logomenu: { usage: `${effectivePrefix}logomenu`, desc: 'يعرض جميع أوامر النصوص المتاحة للشعارات والتأثيرات. الأسماء البديلة: effectsmenu, effectslist, logolist' },
            effectsmenu: { usage: `${effectivePrefix}effectsmenu`, desc: 'اسم مستعار لـ logomenu — يعرض جميع أوامر التأثيرات.' },
            autolikeemoji: { usage: `${effectivePrefix}autolikeemoji <emoji|random>`, desc: 'Set which emoji is used when auto-liking status updates.' },
            promoteall: { usage: `${effectivePrefix}promoteall`, desc: 'رقِّ جميع أعضاء المجموعة إلى مشرفين دفعة واحدة (للمالك فقط).' },
            demoteall: { usage: `${effectivePrefix}demoteall`, desc: 'اخفض رتبة جميع مشرفي المجموعة (للمالك فقط).' },
            listonline: { usage: `${effectivePrefix}listonline`, desc: 'اعرض جميع الأعضاء المتصلين حاليًا في المجموعة. الأسماء البديلة: whoonline, activemembers' },
            hidetag: { usage: `${effectivePrefix}hidetag [message]`, desc: 'Tag all members silently with a hidden mention. No one sees the tag bubble.' },
            blocklist: { usage: `${effectivePrefix}blocklist`, desc: 'اعرض جميع جهات الاتصال المحظورة. الأسماء المستعارة: listblock, lb' },
            dev: { usage: `${effectivePrefix}dev`, desc: 'Shows developer info and contact.' },
            credits: { usage: `${effectivePrefix}credits`, desc: 'Shows bot credits and contributors.' },
            listactive: { usage: `${effectivePrefix}listactive`, desc: 'أكثر 10 مستخدمين نشاطًا في المجموعة حسب عدد الرسائل (الإشارات فقط). الأسماء البديلة: activelist, aet, activeusers, topactive, active' },
            liststicker: { usage: `${effectivePrefix}liststicker`, desc: 'اعرض عدد الملصقات لكل مستخدم في هذه المجموعة (المنشنات فقط). الأسماء البديلة: sl, totalsticker, stickert, stickerlist, stickercount' },
            antilinkgc: { usage: `${effectivePrefix}antilinkgc <off|on|delete|warn|kick>`, desc: 'حظر روابط الدعوة إلى مجموعات وقنوات WhatsApp فقط. on/delete = الحذف فقط. الأسماء البديلة: antlinkgc, nolinkgc' },
            antilink: { usage: `${effectivePrefix}antilink <off|on|delete|warn|kick>`, desc: 'حظر جميع الروابط. on/delete = الحذف فقط، warn = الحذف مع التحذير، kick = الطرد فورًا.' },
            antigroupstatus: { usage: `${effectivePrefix}antigroupstatus <off|on|delete|warn|kick>`, desc: 'Punish non-admins who post group status. on maps to delete.' },
            antisticker: { usage: `${effectivePrefix}antisticker <off|on|delete|warn|kick>`, desc: 'Block stickers. on/delete = delete only.' },
            stealth: { usage: `${effectivePrefix}stealth <on|off>`, desc: 'عند تفعيله، يواصل الروبوت الاستجابة، لكن تُحذف رسائله تلقائيًا بعد 3 ثوانٍ. ويُحفَظ هذا الإعداد في قاعدة البيانات.' },
            setwelcome: { usage: `${effectivePrefix}setwelcome image <url>|off`, desc: 'تعيين رابط صورة ترحيب مخصص يُستخدم عند انضمام عضو (يتطلب تفعيل الترحيب).' },
            fancy: { usage: `${effectivePrefix}fancy <number> <text>`, desc: 'حوّل النص إلى نمط Unicode مميّز (من 1 إلى عدد الأنماط المتاحة).' },
            gstatus: { usage: `${effectivePrefix}gstatus [all|link|jid] [caption]`, desc: 'Post media or text as group status. Reply to image/video/audio/text or provide caption. all = every group.' } };

        if (helpData[cmdName]) {
            const info = helpData[cmdName];
            const body = `│ 📌 *Command:* ${cmdName}\n│ 📖 *Usage:* ${info.usage}\n│ ℹ️ *Description:*\n│ ${info.desc}`;
            await client.sendMessage(m.chat, { text: fmt(`HELP: ${cmdName.toUpperCase()}`, body) });
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});
            return;
        }

        const pluginsDir = path.join(__dirname, '..');
        const categories = fs.readdirSync(pluginsDir).filter(f => fs.statSync(path.join(pluginsDir, f)).isDirectory());
        let found = false;
        for (const cat of categories) {
            const files = fs.readdirSync(path.join(pluginsDir, cat)).filter(f => f.endsWith('.js'));
            if (files.includes(cmdName + '.js')) {
                found = true;
                const body = `│ 📌 *Command:* ${cmdName}\n│ 📁 *Category:* ${cat}\n│ 📖 *Usage:* ${effectivePrefix}${cmdName}\n│ ℹ️ No detailed help available for this command yet.`;
                await client.sendMessage(m.chat, { text: fmt(`HELP: ${cmdName.toUpperCase()}`, body) });
                await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});
                return;
            }
        }

        if (!found) {
            await client.sendMessage(m.chat, {
                text: fmt('HELP', `│ ❌ Command "*${cmdName}*" not found.\n│ Use *${effectivePrefix}help* to list all commands.`)
            });
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } }).catch(() => {});
            return;
        }
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } }).catch(() => {});
    }
};
