#前端开发流程以及文件组织

- 作者: WuNing
- 日期: 2013-10-09

###概述

这是一个尝试性的前端开发流程规范。

现阶段前端开发有诸多问题，例如，php将大部分文件拆散，以便代码复用，同时又采用按需加载js的方式，导致开发人员对单个页面没有一个整体的认识。经常会出现为了重复使用一个功能块，反复加载同一个js文件。这种方式前端文件管理非常杂乱，比较失控。

另外应减少直接在页面上的硬编码，这样不利于代码重用，当次文件被拆分时，之后利用此类型文件会有不可预估的bug产生,影响开发效率。

为了改善，我想到的一个简单快捷的方式，用一个结构描述文件来描述前端所有文件之间关系，然后通过这个结构描述文件，让前端文件能自动化完成这样一个部署流程

1. 代码检测
2. 文件合并
3. 压缩文件

有了结构描述文件之后，对后续开发也有较大的帮助，可以非常方便的了解整个项目中的前端文件结构，可以有效降低项目熟悉的时间成本，对新人比较友善。同时可以有效减少冗余代码，优化代码质量。方便沟通。


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


