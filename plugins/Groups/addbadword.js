import { badwordManage } from './antibadword.js';

export default {
    name: 'addbadword',
    aliases: ['flagword', 'abw', 'addword', 'newbadword'],
    description: 'أضف كلمة غير لائقة مخصّصة إلى هذه المجموعة. طريقة الاستخدام: .addbadword <word>',
    run: (context) => badwordManage(context, 'add')
};
