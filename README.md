#前端开发流程以及文件组织

- 作者: WuNing
- 日期: 2013-10-09


##1.自动化流程

主要使用工具:[GruntJs][0]

*一个任务运行框架，框架已经提供多种前端开发使用插件工具，例如使用的[JsLint][1],[concat][2],[uglify][3],[cssmin][4]*

运行环境:[node][n]

###基本流程

- js语法检测,用于规范和优化js的代码书写
- 相关文件合并
- 压缩输出js

[0]:http://gruntjs.com/ "GruntJs"
[n]:http://nodejs.org/ "NodeJs"
[1]:http://jslinterrors.com/ "JSlint"
[2]:https://github.com/gruntjs/grunt-contrib-concat "concat"
[3]:https://github.com/gruntjs/grunt-contrib-uglify "uglify"
[4]:https://npmjs.org/package/grunt-contrib-cssmin "cssmin"


##2.开发流程


**中间的一个code**和其它的`*cookie*`其它的*例如强调*

>这是一个引用

	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

		jQuery.expr.attrHandle[ name ] = function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					// Temporarily disable this handler to check existence
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;

			// Restore handler
			jQuery.expr.attrHandle[ name ] = fn;

			return ret;
		};
	});


