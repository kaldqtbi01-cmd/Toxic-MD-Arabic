import axios from 'axios';

export default {
    name: 'tinyurl',
    aliases: ['shortlink', 'short'],
    description: 'Shorten URLs with TinyURL',
    run: async (context) => {
        const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

        const formatStylishReply = (message) => {
            return `╭─❏ 「 TINYURL 」\n│ ${message}\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`;
        };

        if (!text) {
            return client.sendMessage(m.chat, {
                text: formatStylishReply("لقد نسيت الرابط. 🤦🏻\nمثال: .shorten https://github.com/xhclintohn/Toxic-MD")
            });
        }

        let url = text.trim();
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });

            const encodedUrl = encodeURIComponent(url);
            const apiUrl = `https://api.nekolabs.web.id/tools/shortlink/tinyurl?url=${encodedUrl}`;

            const response = await axios.get(apiUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'application/json'
                },
                timeout: 10000
            });

            if (!response.data?.success || !response.data?.result) {
                throw new Error('API returned invalid response');
            }

            const shortUrl = response.data.result;
            const responseTime = response.data.responseTime || 'N/A';

            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });

            await client.sendMessage(m.chat, {
                interactiveMessage: {
                    header: `✅ تم اختصار الرابط بنجاح`,
                    title: `Original URL:\n${url}\n\nShortened URL:\n${shortUrl}\n\nResponse Time: ${responseTime}`,
                    buttons: [
                        {
                            name: "cta_copy",
                            buttonParamsJson: JSON.stringify({
                                display_text: "📋 نسخ الرابط المختصر",
                                id: "copy_shorturl",
                                copy_code: shortUrl
                            })
                        },
                        {
                            name: "cta_copy",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🌐 فتح في المتصفح",
                                id: "open_url",
                                copy_code: shortUrl
                            })
                        }
                    ]
                }
            });

        } catch (error) {
            console.error('Shorten error:', error);
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });

            let errorMessage = "تعذّر اختصار الرابط. يُرجى التحقق من صلاحيته. ";
            
            if (error.response?.status === 400) {
                errorMessage += "تنسيق URL غير صالح. 🔗";
            } else if (error.response?.status === 429) {
                errorMessage += "تم تجاوز حد الطلبات. يُرجى المحاولة لاحقًا. ⏳";
            } else if (error.message.includes('timeout')) {
                errorMessage += "انتهت مهلة API؛ يبدو أن الرابط كبير جدًا. ⏱️";
            } else if (error.message.includes('ENOTFOUND')) {
                errorMessage += "تعذّر الوصول إلى خادم API. 🌐";
            } else if (error.message.includes('Invalid response')) {
                errorMessage += "أعادت واجهة API بيانات غير صالحة. 🗑️";
            } else {
                errorMessage += `Error: ${error.message}`;
            }

            await client.sendMessage(m.chat, {
                text: formatStylishReply(errorMessage)
            });
        }
    } };