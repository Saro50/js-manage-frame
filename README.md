#前端开发流程以及文件组织

- 作者: WuNing
- 日期: 2013-10-09


##1.工具简介

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


##2.目录结构

主要的3个文件

>Gruntfile.js

执行文件，所有的功能在此文件中实现，与此相关的是`helper.js`，包含一些简单工具函数的模块

>branches.json

分支路径说明文件，大致内容如下,属性为项目名称,对应值为绝对路径

	{
		"dld_ysh" : "D:/WN/svn/branch_ysh/",
		"dld_bug" : "D:/WN/svn/branch_bug/",
		"dld_turnk" : "D:/WN/svn/Turnk_dld/",
		"supermarket" : "D:/WN/svn/branch_supermarket/",
		"node" : "D:/WN/node/build"
	 	}

>taskJs.json

主要描述文件,用于描述前端所有的js文件以及其关系,数据格式如下，
*注:为了方便描述，在下列代码中打了注释，但是`json`格式文件实际上并不允许有注释出现*

	{	
		//便于记忆和描述的主项目名
 		"dld" : {
 			//子功能名称，例如子页名字叫meishi
			"meishi":{

				//描述型属性，这是个关键字，同时其下子属性也是关键字

				"description" : {

					//此功能包含依赖的js文件，(这个属性尚未使用到，暂时可有可无)

					"required" : ["#lib.mDLD#","#lib.MKPtool#" , "#lib.jQuery#"],

				    //用到这些文件的基本分支

				    "base" :["dld_ysh" , "dld_bug"]
					},

				//相对于每个基本分支的路径

				"static/js/test/Index.js":["#mDLD#","sea.js","jQuery.js","library.js","dialog.js","goble.js"]
			}， 	
 			//子功能名称
			"testIndex" : {
				 "description" : {
		 			"base" : [ "node" ] , 
		 			"required" : [ "#jQuery#" ]
		 			} ,
		    	"/_MKP.js":["src/intro.js","src/MKP_base.js","src/MKP.pager.js","src/outro.js"]
		    	},
		    //子功能名称
			"Index" : { 
				"description" : {
				    "required" : ["#lib.mDLD#","#lib.MKPtool#" , "#lib.jQuery#"],
				    "base" :["dld_ysh" , "dld_bug"]
				    },
				    "static/js/test/Index.js":["src/index.js"]
			    }
	
		}
	}


