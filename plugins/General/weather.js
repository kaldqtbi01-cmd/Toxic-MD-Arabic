import axios from 'axios';
import { sendInteractive } from '../../lib/sendInteractive.js';

export default {
    name: 'weather',
    aliases: ['wthr', 'forecast', 'temp'],
    description: 'Get current weather for any city',
    run: async (context) => {
        const { client, m, text } = context;
        await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
        const city = (text || '').trim();
        if (!city) {
            return sendInteractive(client, m, `╭─❏ 「 الطقس 」
│
│ أدخل اسم مدينة.\n│ طريقة الاستخدام: .weather Nairobi\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
        try {
            await client.sendMessage(m.chat, { react: { text: '⌛', key: m.reactKey } });
            const res = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 });
            const w = res.data.current_condition?.[0];
            const area = res.data.nearest_area?.[0];
            if (!w) throw new Error('No data');
            const areaName = area?.areaName?.[0]?.value || city;
            const country = area?.country?.[0]?.value || '';
            const desc = w.weatherDesc?.[0]?.value || '';
            const tempC = w.temp_C || '?';
            const feelsC = w.FeelsLikeC || '?';
            const humidity = w.humidity || '?';
            const wind = w.windspeedKmph || '?';
            const visibility = w.visibility || '?';
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.reactKey } });
            return sendInteractive(client, m, `╭─❏ 「 Wᴇᴀᴛʜᴇʀ」
│
│ 📍 ${areaName}, ${country}\n│ ☁️ ${desc}\n│ 🌡️ Temp: ${tempC}°C (Feels ${feelsC}°C)\n│ 💧 Humidity: ${humidity}%\n│ 💨 Wind: ${wind} km/h\n│ 👁️ Visibility: ${visibility} km\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        } catch (e) {
            await client.sendMessage(m.chat, { react: { text: '❌', key: m.reactKey } });
            return sendInteractive(client, m, `╭─❏ 「 الطقس」
│
│ تواجه واجهة الطقس البرمجية مشكلة. يُرجى المحاولة مجددًا.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨𝐧`);
        }
    }
};
