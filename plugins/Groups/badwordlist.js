import { badwordManage } from './antibadword.js';

export default {
    name: 'badwordlist',
    aliases: ['badwords', 'listbadwords', 'bwlist'],
    description: 'اعرض الكلمات المحظورة المخصّصة لهذه المجموعة.',
    run: (context) => badwordManage(context, 'list')
};
