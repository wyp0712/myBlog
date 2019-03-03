const path = require('path');
const fs = require('fs');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({
  html: true,
  langPrefix: 'code-',
})
const swig = require('swig');
swig.setDefaults({
  cache: false
});
const rd = require('rd');

// 去掉文件名中的扩展名
function stripExtname(name) {
  let i = 0 - path.extname(name).length;
  if (i === 0) i = name.length;
  return name.slice(0, i)
}

// 将markdown转换为HTML
function markdownToHTML(content) {
  return md.render(content || '');
}

// 解析文章内容
function parseSourceContent(data) {
  let split = '---\n';
  let i = data.indexOf(split);
  let info = {};
  if (i !== -1) {
    let j = data.indexOf(split, i + split.length);
    if (j !== -1) {
      let str = data.slice(i + split.length, j).trim();
      data = data.slice(j + split.length);
      str.split('\n').forEach(function (line) {
        let i = line.indexOf(':');
        let name = line.slice(0, i).trim();
        let value = line.slice(i + 1).trim();
        info[name] = value;
      })
    }
  }
  info.source = data;
  return info;
}

// 渲染模版
function renderFile(file, data) {
  return swig.render(fs.readFileSync(file).toString(), {
    filename: file,
    autoescape: false,
    locals: data
  });
}

// 遍历所有文章
function eachSourceFile(sourceDir, callback) {
  rd.eachFileFilterSync(sourceDir, /\.md$/, callback);
}

// 渲染文章
function renderPost(dir, file) {
  const content = fs.readFileSync(file).toString();
  const post = parseSourceContent(content.toString());
  post.content = markdownToHTML(post.source);
  post.layout = post.layout || 'post';
  let config = loadConfig(dir);
  let layout = path.resolve(dir, '_layout', post.layout + '.html');

  let html = renderFile(layout, {
    config: config,
    post: post
  });
  return html;
}

// 渲染文章列表
function renderIndex(dir) {
  let list = [];
  let sourceDir = path.resolve(dir, '_posts');
  eachSourceFile(sourceDir, function(f, s) {
    let source = fs.readFileSync(f).toString();
    let post = parseSourceContent(source);
    post.timestamp = new Date(post.date);
    post.url = '/posts/' + stripExtname(f.slice(sourceDir.length + 1)) + '.html';
    list.push(post);
  });
  list.sort(function(a, b) {
    return b.timestamp - a.timestamp;
  })

  let config = loadConfig(dir);
  let layout = path.resolve(dir, '_layout', 'index.html');

  let html = renderFile(layout, {
    config: config,
    posts: list
  })
  return html;
}

// 读取配置文件
function loadConfig(dir) {
  let content = fs.readFileSync(path.resolve(dir, 'config.json')).toString();
  let data = JSON.parse(content);
  return data;
}

module.exports = {
  renderPost,
  renderIndex,
  stripExtname,
  eachSourceFile,
  loadConfig
}