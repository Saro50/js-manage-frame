(function($,global){
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
*/

	if(!$){
		alert("Jquery is needed!");
	}
	if(!$.MKP){
		$.error("basic MPKjs is lacked");
		return;
	}



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
								// console.log("mouseout");
								// console.log("bind click");
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
			this.$el = $container;
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
				data = option.data,
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
			var df_class = this.df_class;
			$.each(this.options,function(){
				this.className = (this.getAttribute("data-value")==data.value)?df_class["selectedClass"]:"";
			});
			this.$first.html(data.text);
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
					option:$("#mkpSelectOption").html(),
					wrap:$("#mkpSelectWrap").html()
				});
			}

			if(options.style){
				selection.setStyle(options.style);
			}
			selection.setDefault(defaultValue);
			selection.render(options);
			selection.setHandle(handle);
			this[0].mpkSelction = selection;
			return selection;
		}else{
			return this[0].mpkSelction;
		}
	};

})(jQuery,window);