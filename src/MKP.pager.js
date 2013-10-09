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
*/

(function($,global){
		if(!$){
			alert("Jquery is needed!");
		}
		if(!$.MKP){
			$.error("basic MPKjs is lacked");
		}
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

			_pnum.prototype = new $.MKP._base();

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
								if(that.handle['clickPager']){
									that.handle['clickPager'].apply(cur,[e]);
								}
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

		$.MKP._pager.prototype = $.extend(new $.MKP._base(),{
			init:function(){
				var df_class = this.df_class,
					$el = this.$el;

				this.$pre = $el.find("[data-action=pre]");
				this.$next = $el.find("[data-action=next]");
				this.$tips = $el.find("."+df_class["tips"]);
				this.$wrap = $el.find("."+df_class["wrap"]);
				this.$tipsNum = $el.find("."+df_class["tipsNum"]);
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
						$.error("Sorry Don't support even performance!");
					}else{
						console.log("odd here");
						var div = (per - 1)/2;
						if( num <= (div+1)){
							begin = 0;
							end = begin + per;
							console.log(num + " num here");

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
						var page_num = new pnum();
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

	})(jQuery,window);