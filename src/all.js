

(function($,global){
	if(!$){
		throw "jQuery is needed! ";
		return "";
		// alert("Jquery is needed!");
	}	
	if(!$.MKP){
			$.MKP={};
			$.MKP.template = {};
		}
	// if(!console){
	// 	console == {};
	// 	var _fn = ["dir","log","trace"];
	// 	for(var i = 0 ; i < _fn.length ; ++i )
	// 		console[_fn[i]] = function(){};
	// }
/*
	Basic lib
		@Autor: WuNing
		@date: 2013-4-25
		@version: 1.0.0
		@config:  by CONST value;
		@Description:
			主要模块:
				$.MKP._base
				$.MKP._pager
				$.MKP._formValidate
				$.MKP._select
			使用方式:
				调用入口示例 
				例如 $(selector).mkpPager({
					defaultValue:"人名",
					data:[{
						text:"null",
						value:"null"
					}],
					handle:{
						someproper
					}
				});			
		
		@version: 1.1.0
		@Description:
			new module:
				$.MKP.autoComplete

		@version: 1.1.1
		@date: 2013-8-20
		@Description:
			$.MKP.templateParser 支持 [{data},{data}] 传值方式

		@version: 1.1.2
		@date: 2013-9-6
		@Description:
			增加IE localStorage API

			
*/


	$.MKP.version = "1.1.2";

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
					if((result = orginStr.indexOf(matcher[--i]))!=-1){
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
					restAgent = agent.substring(begin);
					version = /(\d+([.]\d+)*)/;
					if(version.test(restAgent)){
						return RegExp.$1;
					}

					return null;
			};
			var vendor = search(nvg.vendor?nvg.vendor:"",vendors);
			if(vendor.index!=-1){
					browserName = browser_id[vendor.position];
					browserVersion = get_version(browserName);
			}else{
				var agent = search(nvg.userAgent,browser_id);
					browserName = browser_id[agent.position];
					browserVersion = get_version(browserName);
			}
		return function(){
			return {
				name : browserName ,
				nameAndVersion : browserName + browserVersion,
				version : browserVersion
			};
		};
	})();
	$.MKP.templateParser = function(template,data,reg){
		var reg = reg||"#";
		var content = "";

		function renderFromObject(t,d){
			var p ,regexp,content = t;
			for(p in d){
				regexp = RegExp(reg+p+reg);
				if(d.hasOwnProperty(p)){	
					while(content.match(regexp)){
						content = content.replace(regexp,d[p]);
					}
				}
			}
			return content;
		}

		if (typeof data != "object"){
			return 1;
		}else{
			if(!(data instanceof Array) )data = [data];
				var i = 0,
					len = data.length ;
				for(;i < len ; ++i ){
					content += renderFromObject(template,data[i]);
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
		}
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
					if( this._id == totals[--i]._id ){
						totals.splice(i,1);
					}
				}
				this.$el.remove();
			};
		this._pro = this;
	
	};

/*
	Pager for content

		@Autor: WuNing
		@date: 2013-4-26 
		@main method:
			setHandle:{
				handle:{
					clickPager:fn,
					setPager:fn,
					pre:fn,
					next:fn
				}
			}
			destroy:

		@config style by CONST value

		@template example: 
			data-action的值是默认 动作 触发条件
			@动作:
				"pre":上翻页 ,
				"next":后翻页 ,
				"pager":根据data-page的值来跳页面,
				"centerPager": 根据data-page的值跳页面, 页码显示始终以此页码为中心分割


		<script type="text/mkp-template" id = "mkpPageWrap">
		<strong class="#pre#" data-action="pre" >&lt;&lt;</strong>
		<span class="mkp_p_wrap">
		#content#
		</span>	
		<strong class="#next#" data-action="next" href="javascript:void(0);">&gt;&gt;</strong>
		<span class="mkp_p_tips" href="javascript:void(0);">共<strong>#total#</strong>页,当前第 <strong class="mkp_p_tips_num">#currentPage#</strong> 页</span>
		<strong  class='mkp_selection'></strong>
		</script>



		<script type="text/mkp-template" id = "mkpPageWrap1">
		<strong class="#pre#" data-action="pre" >&lt;&lt;</strong>
		<span class="mkp_p_wrap">
		#content#
		</span>	
		<strong class="#next#" data-action="next" href="javascript:void(0);">&gt;&gt;</strong>
		<span class="mkp_p_tips" href="javascript:void(0);">共<strong>#total#</strong>页,当前第 <strong class="mkp_p_tips_num">#currentPage#</strong> 页</span>
		</script>

		<!-- note!!!! no blank when IE7 -->
		<script type="text/mkp-template" id = "mkpPagerNumber">
		<a class="#className#" data-action="pager"  href="javascript:void(0);" data-page = '#page#' >#page#</a>
		</script>

		<script type="text/mkp-template" id = "mkpPagerNumber2">
		<a class="#className#" data-action="centerPager"  href="javascript:void(0);" data-page = '#page#' >#page#</a>
		</script>
*/
		var WRAP_CLASS = "mkp_p_wrap",
			PRE_CLASS = "mkp_p_pre",
			TIPS_NUM_CLASS = "mkp_p_tips_num",
			NEXT_CLASS = "mkp_p_next",
			PAGE_CLASS = "mkp_p_num",
			TIPS_CLASS ="mkp_p_tips",
			CURRENT_PAGE_CLASS = "mpk_p_current";
		$.MKP._pager = function(){
			var id = 0;
			var _pnum = (function(){
			var id = 0;
			return function(){
						this._id = id++;
						this.totals.push(this);
				};
			})();

			_pnum.prototype = new $.MKP._base;

			return function($container){	
				var that = this,
					click_handle = function(e){
					var e = e||window.event,
						cur = e.target||e.srcElement,
						action = cur.getAttribute("data-action");
						if(!action){
							return;
						}
						switch(action){	
							case "centerPager":
								that.setPageCenter(cur.getAttribute("data-page"));
								that.handle['clickPager']&&that.handle['clickPager'].apply(cur,[e]);
								break;
							case "pager":
								that.setPage(cur.getAttribute("data-page"));
								that.handle['clickPager']&&that.handle['clickPager'].apply(cur,[e]);
								break;
							case "pre":
								that.prePage(that.perform);
								that.handle['pre']&&that.handle['pre'].apply(cur,[e]);
								break;
							case "next":
								that.nextPage(that.perform);
								that.handle['next']&&that.handle['next'].apply(cur,[e]);
								break;
							default:
								break;
						}
					that.handle['click']&&that.handle['click'].apply(cur,[e]);	
				};
				this._pnum = _pnum;
				this._id = id++;
				this.df_class = {
					page:PAGE_CLASS,
					currentPage:CURRENT_PAGE_CLASS,
					wrap:WRAP_CLASS,
					pre:PRE_CLASS,
					next:NEXT_CLASS,
					tips:TIPS_CLASS,	
					tipsNum:TIPS_NUM_CLASS		
				};
				this._pnums=[];
				this.$el = $container;
				this.$el.click(click_handle);
				this.totals.push(this);
			};
		}();

		$.MKP._pager.prototype = $.extend(new $.MKP._base,{
			init:function(){
				var df_class = this.df_class,
					$el = this.$el;

				this.$pre = $el.find("[data-action=pre]");
				this.$next = $el.find("[data-action=next]");
				this.$tips = $el.find("."+df_class["tips"]);
				this.$wrap = $el.find("."+df_class["wrap"]);
				this.$tipsNum = $el.find("."+df_class["tipsNum"])
				this.pages = this.$wrap.find("[data-action=pager]");
				if(this.pages[0].getAttribute('data-page') == 1){
						this.$pre.hide();
				}else{
						this.$pre.show();
				}
				if(this.pages[this.pages.length -1 ].getAttribute('data-page') == this.totalNum){
						this.$next.hide();
				}else{
						this.$next.show();
				}
			},
			_changePage:function(begin,end){
				var pnums = this._pnums,
					$wrap = this.$wrap,
					tmp_content = "";
					while(begin < end){
						tmp_content += pnums[begin++].content;
					}
					$wrap.html(tmp_content);
					this.init();
			},
			setPageCenter:function(num){
				var num = parseInt(num),
					per = this.perform;
					if((per%2) == 0 ){
						$.error("even number in center");
					}else{
					
						var div = (per - 1)/2;
						if( num <= (div+1)){
							begin = 0;
							end = begin + per;
						

						}else{
								begin = num - div -1;
								end = begin + per;	
								if(end >= this.totalNum){
									end = this.totalNum;
									begin = end - per;
								}
						}
					}
						this._changePage(begin,end);

						this.setPage(num);
 			},
			prePage:function(num,auto){
				var base_page = parseInt(this.pages[0].getAttribute("data-page"))-1,
					auto = auto|| 0,
					perform = num||this.perform,
					begin = (base_page-perform) < 0 ? 0 :base_page-perform ;
					if(base_page < perform){
						base_page = perform;
					}
					this._changePage(begin,base_page);
					
					if(auto){
						this.setPage(begin+1);
					}
			},
			nextPage:function(num,auto){
				var pages = this.pages,
					auto = auto|| 0,
					l = pages.length;
				var base_page = parseInt(pages[l-1].getAttribute("data-page")),
					perform = num||this.perform,
					end = base_page+perform < this.totalNum ? (base_page+perform):this.totalNum ;
					if(base_page > (end - perform)){
						base_page = (end - perform);
					}
					this._changePage(base_page,end);
					
					if(auto){
						this.setPage(base_page+1);
					}
			},
			setPage:function(page_num){
				var df_class = this.df_class;
			
				this.handle['setPager']&&this.handle["setPager"](page_num);

				$.each(this.pages,function(){
					this.className = df_class["page"];
					if(this.getAttribute("data-page") == page_num){
						this.className = df_class["currentPage"];
					}
				});
				this.$tipsNum.html(page_num);
			},
			setTemplate:function(set){
				var set = set||{};

				this._pnum.prototype.template = set["pager"]||$("#mkpPagerNumber").html();
				this._pro.template = set['wrap']||$("#mkpPageWrap").html();
			},
			setStyle:function(set){
				this.df_class = {
						page:set["page"]||PAGE_CLASS,
						currentPage:set["currentPage"]||CURRENT_PAGE_CLASS,
						wrap:set["wrap"]||WRAP_CLASS,
						pre:set["pre"]||PRE_CLASS,
						next:set["next"]||NEXT_CLASS,
						tips:set["tips"]||TIPS_CLASS,	
						tipsNum:set["tipsNumber"]||TIPS_NUM_CLASS		
					};
				return this;
			},
			render:function(data){
				var total_num = data.total,
					pnum = this._pnum,
					df_class = this.df_class,
					perform = data.perform||5,
					defaultValue = data.defaultValue||1,
					i=0,
					tmp_content="";
					while(i!=total_num){
						var page_num = new pnum;
						page_num.render({
							page:++i,
							className: (i!= defaultValue)?df_class["page"]:df_class["currentPage"]
						});
						this._pnums.push(page_num);
						if(i <= perform){
							tmp_content += page_num.content;
						}
					}
				this.totalNum = data.total;
				this.content = $.MKP.templateParser(this.template,{
					pre:df_class["pre"],
					next:df_class["next"],
					total:total_num,
					currentPage:defaultValue,
					content:tmp_content
				});
				this.perform = perform;
				this.$el.html(this.content);
				this.init();
				this.setPage(defaultValue);

				return this;
			}
		});

		$.fn.mkpPager =function(options){
			if(!this[0].mpkPager){
				var data = options.data||{};
				var handle = options.handle||{};
				var defaultValue = options.defaultValue||"null";
				var pager = new $.MKP._pager(this);
				pager.setHandle(handle);
				pager.setTemplate(options.template);
				if(options.style){
				pager.setStyle(options.style);
				}

				pager.render(options);
				this[0].mpkPager = pager;
				return pager;
			}else{
				return this[0].pager;
			}
		};

/*
	Validate for form

		@Autor: WuNing
		@date: 2013-3-21 
		@main method:
			setHandle:{
				handle:{
					clickPager:fn,
					setPager:fn,
					pre:fn,
					next:fn
				}
			}
			destroy:

		@config style by CONST value
*/

	$.MKP._validate = function(){
			var id = 0,
				isIE = $.MKP.getAgent().name =="MSIE" ? true : false,
				invalid_handle = function(el){
					if(isIE){
						el.checkValidity = function(){
							var pattern = this.attributes["pattern"],
								/*
									@modify by wuning 2013/3/26 
									FOR damn IE
									lt IE7: this.attributes["required"] always eixsted;
									gt IE7: when required specified , this.attributes["required"] existed;
								*/
								required = this.attributes["required"]?this.attributes["required"].specified:false,
								value =$.trim(this.value);			
								if(value == ""){
									if(required){
										if(typeof this.oninvalid == "function"){
											this.oninvalid();
										}
										return false;
									}else{
										return true;
									}
								}else{
									if(pattern&&pattern.specified){
									var reg = RegExp("^" + pattern.value + "$");
										if(reg.test(value)){
											return true;
										}else{
											if(typeof this.oninvalid == "function"){
												this.oninvalid();
											}
										return false;
											return false
										}
									}else{
										return true;
									}
								}
						};
					}
				};
			return function(options){
				var that = this,
					el = options.el,
					blur = options.blur,
					change = options.change,
					focus = options.focus,
					wraper = options.wraper,
					invalid = options.invalid;
				var base_reg = {
					"email":/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
					"url":/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
					"phone":/^(13[1-9]|18[1-9]|15[1-9])\d{8}$/
				};

				this.invalid = invalid;
				this.change = change;
				this.focus = focus;
				this._id = id++;
				this.el = el;
				this.wraper = wraper;
				/*
					@modify by wuning 2013/5/7
					render blur listener
				*/
				this.blur = blur;
				this.name = el.name;
				this.id = el.id;
				this.totals.push(this);
				
				this.update = function(){
					if(that.name in wraper.rules){
						that.rules = wraper.rules[that.name];
					}
					return that;
				};
				this.update();

				this.check = function(){
					var rules = that.rules||null;
					if(rules){
						var valid = rules.apply(that.el,[that.el.checkValidity.apply(that.el,[null]),that]);
					}else{
						var valid = that.el.checkValidity.apply(that.el,[null]);
					}
					if(!valid){
						this.el.oninvalid();
					}
					return valid;
				};
				this.el.onchange = function(){
					var validate_result = that.check();
					that.change && that.change.apply(this,[validate_result,that]);
				};
				this.el.oninvalid = function(e){
						that.invalid && that.invalid.apply(this,[that,e]);

				};
				/*
					@modify by wuning 2013/5/7
					render blur listener
				*/
				this.el.onblur = function(e){
					that.blur && that.blur.apply(this,[that,e]);
				};
				/*
					@modify by wuning 2013/5/9
					register focus listener
				*/
				this.el.onfocus = function(e){
					that.focus && that.focus.apply(this,[that,e]);
				};
				if(!isIE){
					/*	
						@modify by wuning 2013/3/27
						required can not validate when there will only blank
					*/
					if($(el).attr("required")&&($(el).attr("pattern")!="")){
						// $(el).attr("pattern","[^\\s]*");
					}
				}
				invalid_handle(el);
			};
		}();

		$.MKP._validate.prototype =new $.MKP._base;

		$.MKP._validateForm = function(){
			var id = 0;
			return function(form){
				var that = this,
					submit_handle = function(e){
						var checkResult = that.check(); 
						var result = that.handle["submit"]?that.handle["submit"].apply(that,[checkResult,e]):true;
						return result;
						
					};
				this._id = id++;
				this.handle = {};
				this.rules = {};
				that.validations = [];
				this.$el = form;
				// novalidate='true'
				this._init = function(){
					$.each(form[0].elements,function(){
						that.validations.push(new $.MKP._validate({
							el:this,
							wraper:that,
							invalid:that.handle["invalid"],
							change:that.handle["change"],
							blur:that.handle["blur"],
							focus:that.handle["focus"],
							rules:that.rules
							}));
					});
					return this;
				};
				this.totals.push(this);
				form[0].noValidate=true;
				this.$el[0].onsubmit = submit_handle;
			};
		}();

		$.MKP._validateForm.prototype =$.extend(new $.MKP._base,{
			check:function(){
				var invalid = false,
					that = this;
				$.each(this.validations,function(){
					if( !this.check() ){
						invalid = true;
					};
				});
				return invalid ? false : true;
			},
			setHandle : function(handle){
				var handle = handle ||{};
				this.handle["invalid"] = handle["invalid"];
				this.handle['submit'] = handle["submit"];
				this.handle["change"] = handle["change"];
				/*
					@modify by wuning 2013/5/7
					render blur listener
				*/
				this.handle['blur'] = handle['blur'];
				/*
					@modify by wuning 2013/5/9
					register focus and check listener
				*/

				this.handle['focus'] = handle['focus'];
				return this;
			},
			setRules : function(rules){
				this.rules = rules;
				return this;
			},
			submit:function(){
					this.$el.submit();
				}
		});


		$.fn.mkpFormValidate = function(options){
			var options  = options || {};
			if(!this[0].mkpFormValidate){
				var data = options.data||{};
				var rules = options.rules||{};
				var handle = options.handle||{};
				var defaultValue = options.defaultValue||"null";
				var mkpFormValidate = new $.MKP._validateForm(this);
					mkpFormValidate.setHandle(handle);
					mkpFormValidate.setRules(rules);
					// mkpFormValidate.setTemplate(options.template);
					mkpFormValidate._init();
				this[0].mkpFormValidate = mkpFormValidate;
				return mkpFormValidate;
			}else{
				return this[0].mkpFormValidate;
			}
		};
/*
	Virtual seletion

		@Autor: WuNing
		@date: 2013-3-21 
		@main method:
			setHandle:{
				handle:{
					click:fn,
					mouseout:fn,
					mousemove:fn
				}
			}
			select:
			setDefault:
			destroy:

		@config style by CONST value

	@template example:

	<script type="text/mkp-template" id = 'mkpSelectWrap'>
		<strong>#first#</strong>	
		<ul class = "#className#" data-action ="click" >#content#</ul>
	</script>

	<script type="text/mkp-template" id = 'mkpSelectOption'>
		<li class = "#className#" ><a href="#" data-id="#id#" data-value= "#value#" >#text#</a></li>
	</script>
*/
	$.MKP.template.mkpSelectWrap = '<strong data-action ="action" >#first#</strong><ul class = "#className#" data-action ="click" >#content#</ul>';
	$.MKP.template.mkpSelectOption = '<li class = "#className#" ><a href="#" data-id="#id#" data-value= "#value#" >#text#</a></li>';

	$.MKP._select = function(){
		var SELECTED_CLASS = " mkp_s_selected" ,
			OPTION_CLASS = "mkp_s_option" ,
			WRAP_CLASS = "mkp_s_wrap",
			id = 0;
			var op = function(){
				this.totals.push(this);
			};
			op.prototype = new $.MKP._base;

		return function($container){
			var	that = this,
				fold_status = 0,
				click_handle = (function(){
					var fold_countrol = function(){
							var $wrap = that.$wrap;
							if(++fold_status == 1){
								$wrap.show();
							}else{
								$wrap.hide();
								fold_status=0;
							}
						};
					return function(e){
						var e = e||window.event,
							cur = e.target||e.srcElement,
							id = cur.getAttribute("data-id");
							if(id){
								that.$first.html(cur.innerHTML);
								$.each(that.options,function(){
									this.className = "";
								});
								that.selected = {
									id:id,
									value:cur.getAttribute("data-value"),
									text:cur.innerHTML
								};
								cur.className = that.df_class["selectedClass"];
								that.handle["click"]&&that.handle["click"].apply(cur,[e]);
							}
							fold_countrol();
						};
				})(),
				mouseout_handle =(function(){
					var bind_counter = 0,
						hider = function(){
								that.$wrap.hide();
								fold_status = 0;
								bind_counter = 0;
								$(document).unbind("click",hider);
							};
					return function(e){
						var e = e||window.event,
							cur = e.target || e.srcElement,
							action = cur.getAttribute("data-action");
							if(!action){
								return;
							}
							if(++bind_counter == 1){
								$(document).bind("click",hider);
							}
						that.handle["mouseout"]&&that.handle["mouseout"].apply(cur,[e]);
					}
				})(),
				mousemove_handle = (function(){
					return function(e){
						var e = e||window.event,
							cur = e.target || e.srcElement,
							action = cur.getAttribute("data-action");
							if(!action){
								return;
							}
							that.handle["mousemove"]&&that.handle["mousemove"].apply(cur,[e]);
					}
				})();

			this.df_class = {
					selectedClass:SELECTED_CLASS,
					optionClass:OPTION_CLASS,
					wrapClass:WRAP_CLASS
				};

			this.handle = {};

			if($container[0].tagName =="SELECT"){
					$container.wrap("<strong>");
				var f = $container.parent();
					f[0].className = "mkp_selection";
					f[0].id = $container[0].id;
					this.$el = f;	
				var _tmp_data = []; 
				$.each($container.find("option"),function (num,obj) {
					_tmp_data.push({
						value:obj.value,
						text:obj.innerHTML
					});
				});
				this._tmp_data = _tmp_data;

			}else{
				this.$el = $container;
			}
			this._op = op;
			this._id = id++;
			
			this.selected = null;

			this.options = [];

			this.totals.push(this);

			this.$el.click(click_handle);
			this.$el.mouseout(mouseout_handle);
			this.$el.mousemove(mousemove_handle);
		};
	}();



	$.MKP._select.prototype =$.extend(new $.MKP._base ,{
		init:function(){
			var $el = this.$el;
			this.$first = $($el.find("strong")[0]); 
			this.$wrap = $($el.find("ul")[0]);
			this.options = $el.find("a");
			this.selected = null;
		},
		render:function(option){
			var tmp = "",
				op = this._op,
				option_class =this.df_class["optionClass"],
				selected_class = this.df_class["selectedClass"],
				wrap_class = this.df_class["wrapClass"],
				/*
					@need change
				*/
				data = this._tmp_data ? this._tmp_data : option.data,		
				$el = this.$el,
				i = data.length;

				while(i>0){
					var o = new op;

					/*
						@need change
					*/
					o.render({
						id:i,
						className :option_class,
						value:data[--i].value,
						text : data[i].text
					});
					
					tmp += o.content;
				}
			this.content = $.MKP.templateParser(this.template,{
				first: this.defaultValue,
				className: wrap_class,
				content: tmp
			});
			$el.html(this.content);
			this.init();
			return this;
		},
		setDefault:function(string){
			this.defaultValue = string;
			if(this.$first){
				this.$first.html(string);
			}
			return this;
		},
		select:function(data){
			if(typeof data !='object'){
				var data = {
					value:data
				};
			}
			var df_class = this.df_class;
			var that = this;
			$.each(this.options,function(){
				this.className = (this.getAttribute("data-value")==data.value)?df_class["selectedClass"]:"";
				that.$first.html(this.innerHTML);
			});
			this.selected = data;
			return this;
		},
		setStyle:function(set){
			this.df_class = {
					selectedClass:set["selected"],
					optionClass:set["option"],
					wrapClass:set["wrap"]
				}
			return this;
		},
		setTemplate:function(set){
			this._op.prototype.template = set["option"];
			this._pro.template = set["wrap"];
		}
	});


	$.fn.mkpSelection = function(options){
		if(!this[0].mpkSelction){
			var data = options.data||{};
			var handle = options.handle||{};
			var defaultValue = options.defaultValue||"null";
			var selection = new $.MKP._select(this);
			if(options.template){
				selection.setTemplate(options.template);
			}else{
				selection.setTemplate({
					option:$.MKP.template.mkpSelectOption,
					wrap:$.MKP.template.mkpSelectWrap 
				});
			}

			if(options.style){
				selection.setStyle(options.style);
			}
			selection.setDefault(defaultValue);
			selection.render(options);
			selection.setHandle(handle);
			selection.$el[0].mpkSelction = selection;
			return selection;
		}else{
			return this[0].mpkSelction;
		}
	};

	/*
		@autoComplete
		@date: 2013-8-19
	*/
		$.MKP.autoComplete = function(options) {
			var input = options.el,
				dlistView,hidden,
				$input,
				blocker = false,
				wraper;
			if(  input instanceof jQuery){
				$input = input;
				input = $input[0];
			}
			dlistView = {};
			wraper = $input.wrap("<div class = 'cs_auto_complete_wraper' style = 'position:relative'></div>").parent()[0];
			hidden = document.createElement("INPUT");
			hidden.type = 'hidden';
			hidden.name = input.name;
			input.name = '';
			dlistView.el = document.createElement("UL");
			dlistView.el.className = 'cs_auto_complete_list';
			$(dlistView.el).css({
				position:"absolute",
				top:input.offsetHeight + 'px',
				left:0,
				zIndex:100,
				width:input.offsetWidth - 2 + "px",
				display:"none"
			});
			dlistView.hide = function(argument) {
				this.el.style.display = "none";
			};
			dlistView.show = function(argument) {
				blocker = true;
				setTimeout(function(){
					blocker = false;
				},200);
				this.el.style.display = "";
			};
			dlistView.getData = function(data){
				var unitTamplate = "<li><a data-data = '#id#'>#text#</a></li>",
					content = "",
					i=0;
					content = $.MKP.templateParser(unitTamplate,data);
					this.el.innerHTML = content;
			}
			
			wraper.appendChild(dlistView.el);
			wraper.appendChild(hidden);

			if(!options.ajax)options.ajax = {};

			$input.keyup(function(e){
				options.keyup&&options.keyup.call(input,e);
				dlistView.show();
				$.ajax({
					url:options.ajax.url,
					data:options.ajax.query(input),
					dataType:options.ajax.dataType||"JSON",
					success:function(xhr){
						var data = [{text:"无数据.."}];
						if(options.ajax.success)
						{
							data = options.ajax.success(xhr);
							dlistView.getData(data);
						}
					},
					error:function(){
						options.ajax.error&&options.ajax.error(arguments);
						dlistView.getData([{text:"数据有误"}]);
					},
					complete:function(xhr){
						var data = null;
						if(options.ajax.complete){
							data = options.ajax.complete( xhr );
						}
						if(data)dlistView.getData( data );
						else dlistView.getData([{text:"无数据.."}]);
					},
					beforeSend:function(e){
						dlistView.getData([{text:"正在获取数据.."}]);
					},
					type:options.type||"get"

				});
				

			});

			$(document).click(function(e){
				var cur = e.target||e.srcElement,
					data = cur.getAttribute("data-data");
					if(!blocker){
						dlistView.hide();
					}
					if(!data)return;
					input.value =  cur.innerHTML;
					hidden.value = data;

			});

			return dlistView;
		};
	/*
		@date 2013-9-2
		MKP.window
	*/
	$.MKP.MKPwindow = function(option){

					var el = option.el,
						handler = option.handler || {},
						width = option.width || el.offsetWidth,
						that = this,
						cover = null,
						divs = el.getElementsByTagName("DIV"),
						position = $.MKP.getAgent().nameAndVersion == "MSIE6.0" ? "absolute" : "fixed",
						contentWrapper,i = 0;
						document.body.appendChild(el);
					if(option.cover){
						cover = document.createElement("DIV");
						cover.style.cssText = "background-color:#000;opacity:0.4;\
											filter:alpha(opacity=40);\
											height:100%;width:100%;position:" + position + ";z-index:100;\
											display:block;top:0px;left:0px;display:none";
						document.body.appendChild(cover);
					}
					for(; i < divs.length ; ++i ){
						if( divs[i].getAttribute('data-role') == "contentWrapper" ){
							contentWrapper = divs[i];
						}
					}	
					 
					this.reset = function(style){
						var _width = width;
						if(style){
							if(style.width){
								contentWrapper.style.width = style.width  + 'px';
								}
							if(style.height){
								contentWrapper.style.height = style.height  + 'px';
								}
							_width = parseFloat( contentWrapper.style.width )
						}
						
						el.style.position = position;
						el.style.left = "50%";
						el.style.marginLeft = " -"+ _width/2 + 'px';
						el.style.top = "200px";
						el.style.zIndex = "101";
					};
					this.setClass = function( name ){
						contentWrapper.className = name;
					};

					this.reset();

					this.hide = function(){
						el.style.display = 'none';
						if(cover){
							cover.style.display = 'none';
						}
						handler.afterHide && handler.afterHide();
					};

					this.show = function(){
						el.style.display = 'block';
						if(cover){
							cover.style.display = 'block';
						}
						handler.afterShow && handler.afterShow();
					};

					this.getContent = function( content ){
						if(typeof content == "string"){
							contentWrapper.innerHTML = content;
						}else{
							contentWrapper.appendChild( content );
						}
					};

					el.onclick = function( event ){
						var e = event || window.event,
							cur = e.target || e.srcElement,
							action = cur.getAttribute("data-action");
							if(!action){return;}
							if(action == "close"){
								that.hide();
							}
							that.click && that.click.apply(cur,[e,cur]);
							handler.click && handler.click.apply(cur,[e,cur]);
					};
				}


	/*
		@ Storage render
	*/

	if( !window.localStorage ){
		window.localStorage = (function(){
			var d = document.createElement("div"),
				name = window.location.host;
				d.style.behavior = "url('#default#userData')";
				d.style.display = 'none' ;
				d.addBehavior('#default#userData');
				document.body.appendChild(d);
				return {
					setItem:function( key ,val ){
						d.load(name);
						d.setAttribute( key , val );
						d.save(name);
					},
					getItem:function( key ){
						d.load(name);
						return d.getAttribute( key );
					},
					removeItem : function( key ){
						d.load(name);
						d.removeAttribute( key );
						d.save(name);
					},
					/*
						@ travel all unknow key
					*/
					key : function(){

					}
				};
			})();
		}
})(jQuery,window);