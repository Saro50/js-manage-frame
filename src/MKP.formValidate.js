


"use strict"
/*
<%= use %>
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

(function($,global){

	if(!$){
			alert("Jquery is needed!");
		}

	if(!$.MKP){
			$.error("basic MPKjs is lacked");
		}
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
					console.log(validate_result);
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
})(jQuery,window);
