/*
	Basic lib
		@Autor: WuNing
		@date: 2013-4-25
		@config  by CONST value;
*/

	var $ = {};
	if(!$.MKP){
			$.MKP={};
		}
	$.MKP.getAgent = (function(){
		var nvg= global.navigator,
			browser_id =["Chrome","MSIE","Firefox","Opera","Safari"] ,
			vendors = ["Google"],
			browserName = "",
			browserVersion = "",
			search = function(orginStr,matcher){
				var i = matcher.length,
					result = -1;
				while( i > 0 ){
					if((result = orginStr.indexOf(matcher[--i]))!==-1){
						break;
					}
				}
				return {
					index:result,
					position:i
				};
			},
			get_version = function(name){
				var agent = nvg.userAgent,
					begin = agent.indexOf(name),
					restAgent = agent.substring(begin),
					version = /(\d+([.]\d+)*)/;
					if(version.test(restAgent)){
						return RegExp.$1;
					}

					return null;
			};
			var vendor = search(nvg.vendor?nvg.vendor:"",vendors);
			if(vendor.index!==-1){
					browserName = browser_id[vendor.position];
					browserVersion = get_version(browserName);
			}else{
				var agent = search(nvg.userAgent,browser_id);
					browserName = browser_id[agent.position];
					browserVersion = get_version(browserName);
			}
		return function(){
			return {
				name:browserName,
				version:browserVersion
			};
		};
	})();
	$.MKP.templateParser = function(template,data,vReg){
		var reg = vReg||"#";
		var content = template;
		if (typeof data !== "object"){
			return 1;
		}else{
			for(var p in data){
				var regexp =new RegExp(reg+p+reg);

				if(data.hasOwnProperty(p)){	
					while(content.match(regexp)){
						content = content.replace(regexp,data[p]);
					}
				}
			}
		}	
		return content;
	};

	$.MKP._base = function(){
		this.totals = [];
		this.render = function(data){
		var template = this.template;
			this.content = $.MKP.templateParser(template,data);
			return this;
		};
		this.valueOf = function(){
			return this.value;
		};
		this.toString = function(){
			return this.string;
		};
		this.setHandle = function(handles){
			this.handle = handles;
			return this;
		};
		this.setTemplate = function(setT){
			this.template = setT;
			return this;
		};
		this.destroy = function(){
				var totals = this.totals,
				i = totals.length;
				while(i>0){
					if( this._id === totals[--i]._id ){
						totals.splice(i,1);
					}
				}
				this.$el.remove();
			};
		this._pro = this;
	
	};
