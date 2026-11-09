const Ownermiddleware = async (context, next) => {
    const { m, Owner } = context;

    if (!Owner) {
        return m.reply(`╭─❏ 「 Aᴄᴄᴇss Dᴇɴɪᴇᴅ」
│ عذرًا، هذا الأمر مخصّص للمالك.\n│ لا تملك الصلاحية اللازمة لاستخدامه.\n╰───────────────\n> ©𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 𝐱𝐡_𝐜𝐥𝐢𝐧𝐭𝐨ɴ`);
    }

    await next();
};

export default Ownermiddleware;
