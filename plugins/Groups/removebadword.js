import { badwordManage } from './antibadword.js';

export default {
    name: 'removebadword',
    aliases: ['unflagword', 'rbw', 'removeword', 'delbadword'],
    description: 'إزالة كلمة مسيئة مخصّصة من هذه المجموعة. طريقة الاستخدام: .removebadword <word>',
    run: (context) => badwordManage(context, 'remove')
};
