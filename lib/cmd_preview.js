const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const utils = require('./utils.js');
const open = require('open');

console.log(utils, 'utils')


module.exports = function (dir) {
  dir =  dir || '.';

  // 初始化Express
  const app = express();
  const router = express.Router();

  app.use('/assets', serveStatic(path.resolve(dir, 'assets')));
  app.use(router);

  // 渲染文章
  router.get('/posts/*', function (req, res, next) {
    // res.end(req.params[0]);
    let name = utils.stripExtname(req.params[0]);
    let file = path.resolve(dir, '_posts', name + '.md');
    let html = utils.renderPost(dir, file);
    res.end(html);
  })

  // 渲染列表
  router.get('/', function (req, res, next) {

    let html = utils.renderIndex(dir);
    res.end(html);
  })
  // app.listen(3000, function () {
  //   console.log('服务器端口为：3000')
  // });

  const config = utils.loadConfig(dir);
  const port = config.port || 3000;
  const url = 'http://127.0.0.1:' + port;
  app.listen(port, function() {
    console.log('服务器端口：'+ port)
  })
  open(url);
}