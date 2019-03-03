const path = require('path');
const utils = require('./utils.js');
const fse = require('fs-extra');
const moment = require('moment');

module.exports = function(dir) {
    dir = dir || '.';

    // 创建基本目录
    fse.mkdirSync(path.resolve(dir, '_layout'));
    fse.mkdirSync(path.resolve(dir, '_posts'));
    fse.mkdirSync(path.resolve(dir, 'assets'));
    fse.mkdirSync(path.resolve(dir, 'posts'));
    
    // 复制模版文件
    let tplDir = path.resolve(__dirname, '../tpl');
    fse.copySync(tplDir, dir);

    // 创建第一篇文章
    newPost(dir, 'hello, world', '这是我的第一遍文章');

    console.log('ok');
}

function newPost(dir, title, content) {
    let data = [
        '---',
        'title:' + title,
        'date:' + moment().format('YYYY-MM-DD'),
        '---',
        '',
        content  
    ].join('\n');
    let name = moment().format('YYYY-MM') + '/hello-world.md';
    let file = path.resolve(dir, '_posts', name);
    fse.outputFileSync(file, data);
}