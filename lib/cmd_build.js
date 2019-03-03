const path = require('path');
const utils = require('./utils.js');
const fse = require('fs-extra');

module.exports = function(dir, options) {
		dir =  dir || '.';
		let outputDir = path.resolve(options.output || dir);

		// 写入文件
		function outputFile(file, content) {
				console.log('生成页面： %s', file.slice(outputDir.length + 1));
				fse.outputFileSync(file, content);
		}   
		
		// 生成文章内容页面
		let sourceDir = path.resolve(dir, '_posts');
		utils.eachSourceFile(sourceDir, function(f, s) {
			let html = utils.renderPost(dir, f);
			let relativeFile = utils.stripExtname(f.slice(sourceDir.length + 1)) + '.html';
			let file = path.resolve(outputDir, 'posts', relativeFile);
			outputFile(file, html)
		})

		// 生成首页
		let htmlIndex = utils.renderIndex(dir);
		let fileIndex = path.resolve(outputDir, 'index.html');
		outputFile(fileIndex, htmlIndex);
}