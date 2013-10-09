//jquery.my.js

(function($, undefined) {
	var thead = '<thead>',
	th = '<th>', 
	td = '<td>', 
	tbody = '<tbody>', 
	colgroup='<colgroup>',
	col='<col>',
    ul='<ul>',
    li='<li>',
	tr = '<tr>',
	p,
	i,
    days=[ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
    monthname={
			  0:'January',
			  1:'February',
			  2:'March',
			  3:'April',
			  4:'May',
			  5:'June',
			  6:'July',
			  7:'August',
			  8:'September',
			  9:'October',
			  10:'November',
			  11:'December'
	  },
    week=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
	Event={
			addEvent:function(type,callback,capture){
				var IEtype='on'+type;
				if(window.addEventListener){
					return this.addEventListener(type,callback,capture);
					}
				else if(window.attachEvent){
					return this.attachEvent(IEtype,callback);
					}
			},
			removeEvent:function(type,callback,capture){
				var IEtype='on'+type;
				if(window.removeEventListener){
					return e.removeEventListener(type,callback,capture);
					}
				else if(window.detachEvent){
					return e.detachEvent(IEtype,callback);
					}
			},
			getEvent : function(event){
				return event ? event : window.event;
			},
			getTarget : function(event){
				return event.target||event.srcElement;
			},
			preventDefault:function(event){
			 if(event.preventDefault){
				 event.preventDefault();
			 }
			 else{
				 event.returnValue = false;
			 }
			},
			stopPropagation:function(event){
				if(event.stopPropagation){
					event.stopPropagation();
				}
				else{
					event.cancelBubble = true;
				}
			}
	},
    //mygrid main function
	methods = {
			//not support IE7
	    inittree : function(options){
	    	var div='<div>',
	    		span='<span>',
	    	 	strong='<strong>',
	    	 	tree_container,
	    	 	that=this,
	    	 	tree_path,
	    	 	tree_chosen,
	    	 	path=[],
	    	 	width=options['width']||280,
	    	 	layer=options['layer']||2,
	    	 	input_width=width-100,
	    	 	choice_col=[],
	    	 	transfer={
	    			parentNode:'parentNode',
	    			nodeName:'nodeName',
	    			nodeId:'nodeId',
	    			Children:'Children'
	    		},
	    		count=0,
			    ajax_count=0,
				limit_depth=(parseInt(options['maxDepth'])-1)||1000,
	    		create_btn=function(arr){
	    		var btn={
		    			add:span.replace(/\>/,' data-action="add"  class="my_add_item"  \>')+end.call(span),
		    			del:span.replace(/\>/,' data-action="delete" class="my_del_item" \>')+end.call(span),
		    			modify:span.replace(/\>/,' data-action="modify"   class="my_modify_item" \>') +end.call(span),
		    			choice:span.replace(/\>/,' data-action="choice"   class="my_false_cho_item" \>') +end.call(span),
		    			show:span.replace(/\>/,' data-action="show"   class="my_show_item" \>') +end.call(span)
		    		},content='',i,ar=arr||options['action'];
	    			for(i=0;i<ar.length;i++){
	    				if(btn[ar[i]]!==undefined){
	    					content+=btn[ar[i]];
	    				}
	    			}
	    			return  content;
	    		
	    		},
	    	 	content='',a,deep=-1,
	    	 	traver=function(ar,f){
	    			var p,i;
	    			deep++;
	    			for(i=0;i<ar.length;i++){
	    			f(ar[i]);
	    			if(ar[i][transfer.Children]!==undefined){
	    				traver(ar[i][transfer.Children],f);	
	    				}
	    			}
	    			deep--;
	    		};
	    		that[0].myplugin='tree';
	    		data['tree']=options['data'];
	    		if(options['transfer']){
	    			for(p in options['transfer']){
	    				if(transfer[p]!==undefined){
	    					transfer[p]=options['transfer'][p];
	    				}
	    			}
	    		}

	    	var p_Node=transfer['parentNode'],
	    		n_Name=transfer['nodeName'],
	    		n_Id=transfer['nodeId'],
	    		n_Child=transfer['Children'],
	    		short_name=function(arg_str,num){
	    			var reg=/[a-zA-Z]+/g,ch_num;
	    			num=num||13;
	    			arg_str=arg_str||'';
	    			ch_num=num-2>0?num-2:2;
	    			if(reg.test(arg_str)){
	    				arg_str=arg_str.length>num?arg_str.slice(0,num)+'..':arg_str;
	    			}else{
	    				arg_str=arg_str.length>ch_num?arg_str.slice(0,ch_num)+'..':arg_str;
	    			}
	    			return arg_str;
	    		};

	    		that[0].innerHTML='';
	    		that[0].innerHTML='<div></div>';
	    		var main_container=that[0].getElementsByTagName('div')[0];
	    		main_container.className+=' my_treebox';
	    	
	    		content+=div.replace(/\>/,' class = "my_contentbox" style="left:0px;" \>')+end.call(div)
	    				+div.replace(/\>/,' class = "my_tree_path" \>')+end.call(div)
	    				+div.replace(/\>/,' class = "my_tree_chosen" \>')+end.call(div);
	    		main_container.innerHTML=content;
	    		var alldiv=main_container.getElementsByTagName('DIV');
	    		tree_container=alldiv[0];
	    		tree_path=alldiv[1];
	    		tree_chosen=alldiv[2];
	      		tree_chosen.innerHTML='<div class="my_chosen_btn_bar"></div><div></div>';
	    		/*<strong data-action="submit" class="my_chosen_submit">Submit</strong>   used to submit*/
	      		layer=layer+1;
	    		var chosen_container=tree_chosen.getElementsByTagName('DIV')[1];
	    		if(options['show_chosenBar']==false){
		    		tree_chosen.style.display='none';
		    		layer=layer-1;
	    		}
	    		main_container.style.width=width*layer+'px';
	    		layer=options['show_chosenBar']==false?layer:layer-1;
	    	
	    	    traver(data['tree'],function(obj){
		    	    var p,i=0,btn,j,
	    	        	container=main_container.getElementsByTagName('DIV'),
		    	    	depth,pNode,hide,
		    	    	con=null;
		    	    for(i=0;i<container.length;i++){
		    	    	depth=parseInt(container[i].getAttribute('data-depth'),10);
		    	    	if(depth===deep){
		    	    		con=container[i];
		    	    		break;
		    	    	}
		    	    	else{
		    	    		depth=deep;
		    	    	}
		    	    }
		    	    if(con===null){
		    	    	con=document.createElement('DIV');
		    	    	con.style.width=width+'px';
		    	    	con.className='my_innertreebox';
		    	    	con.setAttribute('data-depth',deep);
		    	    	tree_container.appendChild(con);
		    	    }
		    	    pNode=obj[p_Node]||'null';
		    		hide=options.path!=undefined?'none':'';
		    	    if(options.path!=undefined){
		    	    	for(j=0;j<options.path.length;j++){
		    	    		if(options.path[j]==pNode||options.path[j]==obj[n_Id]){
		    	    			hide='';
		    	    			break;
		    	    		}
		    	    	}
		    	    }
		    		(depth==0)&&(hide='');
		    	    //dismiss btn
		    	    //	btn=limit_depth==depth?(create_btn().replace('show_item','')):(create_btn().replace(/(data-action="choice")|false_cho_item/g,''));
		    	    btn=create_btn();
		    	    con.innerHTML+=strong.replace(/\>/,' style="display:'+hide+';"  data-node="'+
		    	    		obj[n_Id]+'" data-f="'+pNode+'" data-depth="'+depth+'" title="'+obj[n_Name]+'" \>')
	    	    						+short_name(obj[n_Name])+btn
	    	    						+end.call(strong);
	    	    });
	    
	    	    if(options.path!==undefined){

	    	    	for(i=0;i<options.path.length;i++){

	    	    	var el_strong=tree_container.querySelectorAll("strong[data-node='"+options.path[i]+"']")[0],
	    	    		title=el_strong.getAttribute('title');
	    	    	el_strong.className='my_has_select';
	    	    	path.push(el_strong);
	    	    	tree_path.innerHTML+=strong.replace(/\>/,' data-action="roll"  data-depth="'+i+'" title="'+title+'" \>')+
					short_name(title,8)+end.call(strong);
	    	    	}
	    	    	i=i>2?i:2;
	    	    	$(tree_container).animate({left:"-"+((i-2)*width)+"px"},"fast");
	    	    }

	    	    $(main_container).click(function(e){
	    	    	if(count==1){return;}
	    	    	count=1;
	    	    	if(!e)e=window.event;
					var current=e.target||e.srcElement,
						loading=document.getElementById('my_innbox_load_img'),
						emptyinfo=document.getElementById('my_innerbox_nodata_info'),
						nextDiv,
						action=current.getAttribute('data-action'),
						depth,
					    node,
					    last_nodedata=data['tree'],
						left,i,j,f=current,
						title,
						nodeDeal;
					//alert(JSON.stringify(data['tree']));
						if(action===null){
							count=0;
							return;
						}
						if(emptyinfo==null){
							emptyinfo=document.createElement('STRONG');
							emptyinfo.id='my_innerbox_nodata_info';
							emptyinfo.innerHTML='Nodata';
							main_container.appendChild(emptyinfo);
							emptyinfo.style.display='none';
						}
						
						while(f.tagName!=='STRONG'){
							f=f.parentNode;
						}
						node=f.getAttribute('data-node');
						depth=parseInt(f.getAttribute('data-depth'));
						data_f=f.getAttribute('data-f')||'';
						
						//all_depth_div=tree_container.getElementsByTagName('DIV');
						/*****************not For IE7***************/
						nextDiv=tree_container.querySelectorAll("div[data-depth='"+(depth+1)+"']")[0];
						if(nextDiv==null){
							nextDiv=document.createElement('DIV');
							nextDiv.className='my_innertreebox';
							nextDiv.setAttribute('data-depth',(depth+1));
			    	    	tree_container.appendChild(nextDiv);				
						}
						nextDiv.style.display='';
						/*****************not For IE7***************/
							//$('div[data-depth='+(depth+1)+']')[0];
						/***************problem*************/
						nodeDeal=node!==null?'node':'roll';
						/************************************/
						
						if(action=='del_choice')nodeDeal='none';
					
						switch(nodeDeal){
							case 'roll':
								if(depth==limit_depth){return;}
								left=depth*width;
								$(tree_container).animate({left:"-"+left+"px"},"fast");
								break;
							case 'node' :
								var path_bar='',
								traver=function(arr,p){
								var i=0,
									arr=arr.length!=undefined?arr:arr[n_Child];	
								for(i=0;i<arr.length;i++){
								if(arr[i][n_Id]==p.getAttribute('data-node')){
									return arr[i];
										}	
									}
								};//traver in array
								
								/*******************
								if($('div[data-depth='+(depth+1)+']')[0]==undefined){
									break;
								}****/
								
								path.push(f);
								for(i=0;i<path.length;i++){
									path[i].className='';
								}
								path.splice(depth+1,path.length-(depth+1));
								path[path.length-1]=f;
							
							/***********most problem***********************/
							/*********************************8******2012/8/2********/	
							
								for(i=0;i<path.length;i++){
									path[i].className='my_has_select';
									last_nodedata=traver(last_nodedata,path[i]);
									//alert(last_nodedata[n_Name]);
									path_bar+=strong.replace(/\>/,' data-action="roll"  data-depth="'+i+'" title="'+last_nodedata[n_Name]+'" \>')+
									short_name(last_nodedata[n_Name],8)+end.call(strong);
									}
								var d_container;
								while((d_container=tree_container.querySelectorAll('div[data-depth="'+(i+1)+'"]')[0])!==undefined){
									d_container.style.display='none';
									i++;
								}
								//nodedata  current last data;
								tree_path.innerHTML=path_bar;
								
						
								
								title=nextDiv.getElementsByTagName('STRONG');
								for(i=0;i<title.length;i++){
									if(title[i].getAttribute('data-f')==node){
										title[i].style.display='';
									}
									else {
										title[i].style.display='none';
									}
								}
								
								last_nodedata[n_Child]=last_nodedata[n_Child]==undefined?[]:last_nodedata[n_Child];
								if(last_nodedata[n_Child].length==0){
									emptyinfo.style.display='';
									nextDiv.appendChild(emptyinfo);
								}				
									break;
								default:
									break;
						}
			
				left=(depth+1)<layer?0:(depth-layer+2)*width;
				
				switch(action){case 'add':
								if(depth==limit_depth){return;}
								$(tree_container).animate({left:"-"+left+"px"},"fast",'linear',function(){
								var con=document.createElement('STRONG'),
								children=last_nodedata[n_Child],i,
								pnode=f.getAttribute('data-node'),
								ok,cancel,input,
								haschild=emptyinfo.style.display=='none'?'none':'';
								emptyinfo.style.display='none';
								con.setAttribute('data-f',pnode);
								con.setAttribute('data-depth',(depth+1));
								con.innerHTML='<input style="margin:0px;width:'+input_width+'px;" type="text" /><span style="background-position:-30px -30px;" class="my_false_cho_item"></span>';
								nextDiv.appendChild(con);
								ok=con.getElementsByTagName('SPAN')[0];
								cancel=con.getElementsByTagName('SPAN')[1];
								input=con.getElementsByTagName('INPUT')[0]
								input.onblur=function(){
									var newNode={},
									reg=/^\s*$/;
									if(pnode==null){		
									nextDiv.removeChild(con);
									con=null;
									emptyinfo.style.display=haschild;
									return;}
									newNode[p_Node]=f.getAttribute('data-node');
									newNode[n_Id]=pnode+'_'+this.value;
									newNode[n_Name]=this.value;
									newNode[n_Child]=[];
									con.setAttribute('title',this.value);
									if(!reg.test(this.value) && confirm('Add?')){	
										if(options['add_handle']!==undefined){
											var add_handle=options['add_handle'];
											if(add_handle.action!==undefined)add_handle.action();
											if(add_handle.ajax!==undefined){
												var ajax=add_handle.ajax;
												$.ajax({
													 url :ajax.url,
													 data :ajax.data(last_nodedata,this.value),
													 type : ajax.type!="POST"?ajax.type:'GET',
													 beforeSend : function(xhr){
														 if(ajax.beforeSend!=undefined)ajax.beforeSend(xhr,node);
														// nextDiv.className+=' my_loadingdiv';
														 //nextDiv.innerHTML='';
													 },
													 contentType:ajax.contentType!==undefined?ajax.contentType:'application/x-www-form-urlencoded; charset=UTF-8',
													 error : function(){
														 if(ajax.error!=undefined)ajax.error();
														 /**********error******************/
														 nextDiv.removeChild(con);
														 con=null;
														 emptyinfo.style.display=haschild;
													 },
													 success : function(data){
														 var s_data;
														 if(ajax.success!=undefined&&(s_data=ajax.success(data))!==false){
															 newNode[n_Id]=s_data;
															 con.setAttribute('data-node',s_data);
															 /**********success******************/
															 last_nodedata[n_Child].push(newNode);
															 con.innerHTML=short_name(input.value)+create_btn();
															 }
														 else{
																nextDiv.removeChild(con);
																con=null;
																emptyinfo.style.display=haschild;
														 }
													 }
												 	});
												 }
									
											}
										
										
										
										last_nodedata[n_Child].push(newNode);
										con.innerHTML=short_name(this.value)+create_btn();
									}
									else{
										nextDiv.removeChild(con);
										con=null;
										emptyinfo.style.display=haschild;
									}
								};
								con.getElementsByTagName('INPUT')[0].focus();
									});
								break;
								
							case 'delete':
								var div=tree_container.querySelectorAll('div[data-depth="'+(depth)+'"]')[0];
								if(confirm('Delete?')){
									if(options['del_handle']!==undefined){
										var del_handle=options['del_handle'];
										if(del_handle.action!==undefined)del_handle.action();
										if(del_handle.ajax!==undefined){
											var ajax=del_handle.ajax;
											$.ajax({
												 url :ajax.url,
												 data :ajax.data(last_nodedata),
												 type : ajax.type!="POST"?ajax.type:'GET',
												 beforeSend : function(xhr){
													 if(ajax.beforeSend!=undefined)ajax.beforeSend(xhr,node);
													// nextDiv.className+=' my_loadingdiv';
													// nextDiv.innerHTML='';
												 },
												 contentType:ajax.contentType!==undefined?ajax.contentType:'application/x-www-form-urlencoded; charset=UTF-8',
												
												 error : function(){
													 if(ajax.error!=undefined)ajax.error();
														/****************error*************/
													 alert('Can\'t delete this');
												 },
												 success : function(data){
													 if(ajax.success!=undefined&&ajax.success(data)!==false){
														/*****************success************/
													 div.removeChild(f);
													 last_nodedata=null;
													 var title=tree_container.querySelectorAll('div[data-depth="'+(depth+1)+'"]')[0].getElementsByTagName('STRONG');
													 for(i=0;i<title.length;i++){
														 title[i].style.display='none';}
													 }
												 }
											 	});
											 }
										 }
										}
								break;
								
							case 'modify':
								var content=f.innerHTML,
									reg=/[^\<]+(?=[\<])/,
									input,
									ok,cancel;
								f.innerHTML='<input style="margin:0px;width:'+input_width+'px;" type="text" /><span style="background-position:-30px -30px;" class="my_false_cho_item"></span>';
								input=f.getElementsByTagName('INPUT')[0];
								ok=f.getElementsByTagName('SPAN')[0];
								cancel=f.getElementsByTagName('SPAN')[1];
								input.value=last_nodedata[n_Name];
							
								input.onblur=function(){
									if(input.value==last_nodedata[n_Name]){ 
										f.innerHTML=content;
									/*	if(options['modify_handle']!==undefined){
										var modify_handle=options['modify_handle'];
										if(modify_handle.action!==undefined)modify_handle.action();
										if(modify_handle.ajax!==undefined){
											var ajax=modify_handle.ajax;
											$.ajax({
												 url :ajax.url,
												 beforeSend : funct n(xhr){
													 if(ajax.beforeSend!=undefined)ajax.beforeSend();
													
												 },
												 error : function(){
													 if(ajax.error!=undefined)ajax.error();
												 },
												 success : function(data){
													 if(ajax.success!=undefined)ajax.success(data);
														f.innerHTML=short_name(content.replace(reg,this.value));
												 }
											 	});
											}
										}*/
									}else{
										if(confirm('Save this change?')){
											if(options['modify_handle']!==undefined){
												var modify_handle=options['modify_handle'];
												if(modify_handle.action!==undefined)modify_handle.action();
												if(modify_handle.ajax!==undefined){
													var ajax=modify_handle.ajax;
													$.ajax({
														 url :ajax.url,
														 data :ajax.data(last_nodedata,input.value),
														 type : ajax.type!="POST"?ajax.type:'GET',
														 beforeSend : function(xhr){
															 if(ajax.beforeSend!=undefined)ajax.beforeSend(xhr,node);
															 //nextDiv.className+=' my_loadingdiv';
															// nextDiv.innerHTML='';
														 },
														 contentType:ajax.contentType!==undefined?ajax.contentType:'application/x-www-form-urlencoded; charset=UTF-8',
														
														 error : function(){
															 if(ajax.error!=undefined)ajax.error();
																/**************error***************/
															 f.innerHTML=content;
														 },
														 success : function(data){
															 if(ajax.success!=undefined&&ajax.success(data)!==false){
																f.innerHTML = content.replace(reg,short_name(input.value));
																f.setAttribute('title',input.value);
															 }else{
																 f.innerHTML=content;
															 }
														 }
													 	});
													}
												}
										}
										else{
											f.innerHTML=content;
										}
									}
								};
								input.focus();
								break;
							case 'choice':
								var checked=false;
								
								for(i=0;i<choice_col.length;i++){
									if(choice_col[i].data[n_Id]==f.getAttribute('data-node')){
										checked=true;
										break;
									}
								}
								if(!checked){
									var obj={},
									f_parent='';
									obj.el=f;
									obj.data=last_nodedata;	
									f_parent=(tree_container.querySelectorAll('strong[data-node="'+obj.el.getAttribute('data-f')+'"]')[0]!==undefined)?(tree_container.querySelectorAll('strong[data-node="'+obj.el.getAttribute('data-f')+'"]')[0].getAttribute('title')):'';
									chosen_container.innerHTML+='<strong   data-node="'+obj.data[n_Id]+'"  title="'+f_parent+'/'+obj.data[n_Name]+'">'+short_name(f_parent,5)+'/'+short_name(obj.data[n_Name],5)+'<span class="my_del_item"  data-action="del_choice"></span></strong>';
									choice_col.push(obj);
								}
								else{
									break;
								}
								if(options['choice_handle']!==undefined)
									{
									var choice_handle=options['choice_handle'],gose;
									if(choice_handle.action!==undefined)choice_handle.action(choice_col,f);
									if(choice_handle.ajax!==undefined && choice_handle['multi_choice']!=true){
										var ajax=choice_handle.ajax;
										$.ajax({
											 url :ajax.url,
											 data :ajax.data(last_nodedata,choice_col),
											 type : ajax.type!="POST"?ajax.type:'GET',
											 beforeSend : function(xhr){
												 if(ajax.beforeSend!=undefined){
													 gose=ajax.beforeSend(xhr,node);
													 return gose;
												 }
												// nextDiv.className+=' my_loadingdiv';
												// nextDiv.innerHTML='';
												 
											 },
											 contentType:ajax.contentType!==undefined?ajax.contentType:'application/x-www-form-urlencoded; charset=UTF-8',
											 error : function(){
												 if(ajax.error!=undefined)ajax.error();
											 },
											 success : function(data){
												 if(ajax.success!=undefined)ajax.success(data);
											 }
										 	});
										}
									}
								break;
							case 'show':
							$(tree_container).animate({left:"-"+left+"px"},"fast",'linear',function(){
								    var children=last_nodedata[n_Child],i,
									 pnode=f.getAttribute('data-node'),
									 haschild=emptyinfo.style.display=='none'?'none':'';
									 emptyinfo.style.display=haschild;
							if(options['show_handle']!==undefined){
								options['show_handle'].action&&options['show_handle'].action();
								if(options['show_handle']['ajax']!==undefined){
									var ajax=options['show_handle']['ajax'];
									 $.ajax({
										 url :ajax.url,
										 data :ajax.data(last_nodedata)+"&random="+Math.random(),
										 type : ajax.type!="POST"?ajax.type:'GET',
										 beforeSend : function(xhr){
											 if(ajax_count==1){
												 return false;
											 }
											 //ajax_count=1;
											 if(ajax.beforeSend!=undefined)ajax.beforeSend(xhr,node);
											 nextDiv.className+=' my_loadingdiv';
											 nextDiv.innerHTML='';
										 },
										 contentType:ajax.contentType!==undefined?ajax.contentType:'application/x-www-form-urlencoded; charset=UTF-8',
										 error : function(){
											 if(ajax.error!=undefined)ajax.error();
											 nextDiv.className=nextDiv.className.replace('my_loadingdiv','');
											 emptyinfo.style.display='';
											 nextDiv.appendChild(emptyinfo);
										 },
										 success : function(data){
											 if(ajax.success!=undefined)ajax.success(data);
											 nextDiv.className=nextDiv.className.replace('my_loadingdiv','');	
											//data=eval('('+data+')');
											 last_nodedata[n_Child]=[];
							
											 for(i=0;i<data.length;i++){
												 last_nodedata[n_Child].push(data[i]);
												 var con=document.createElement('STRONG');
												 	con.setAttribute('data-node',data[i][n_Id]);
												 	con.setAttribute('data-f',data[i][p_Node]);
												 	con.setAttribute('data-depth',(depth+1));
													con.setAttribute('title',data[i][n_Name]);
												 	con.innerHTML=short_name(data[i][n_Name])+create_btn();
												 	nextDiv.appendChild(con);
											 }
											 ajax_count=0;
										 }
									 	}); 
									 	}
								
									 }
									 else {
										 $(tree_container).animate({left:"-"+left+"px"},"fast",'linear');
									 }
									
									});
								break;
							case 'del_choice':
								for(i=0;i<choice_col.length;i++){
									if(choice_col[i].data[n_Id]==node){
										choice_col.splice(i,1);
										break;
									}
								}
								chosen_container.removeChild(f);
								f=null;
								break;
							case 'submit':
								var choice_handle=options['choice_handle'],gose;
									var ajax=choice_handle.ajax;
									$.ajax({
										 url :ajax.url,
										 data :ajax.data(last_nodedata,choice_col),
										 type : ajax.type!="POST"?ajax.type:'GET',
										 beforeSend : function(xhr){
											 if(ajax.beforeSend!=undefined){
												 gose=ajax.beforeSend(xhr,node);
												 return gose;
											 }
											// nextDiv.className+=' my_loadingdiv';
											// nextDiv.innerHTML='';
											 
										 },
										 contentType:ajax.contentType!==undefined?ajax.contentType:'application/x-www-form-urlencoded; charset=UTF-8',
										 error : function(){
											 if(ajax.error!=undefined)ajax.error();
										 },
										 success : function(data){
											 if(ajax.success!=undefined && ajax.success(data)){
											 chosen_container.innerHTML='';
											 choice_col=[];
											 }
										 }
									 	});
									break;	
								default:
									break;
								
							}	
						
						//alert(nodedata.nodeName);
						count=0;
	    	    });
	    	    
	    	    that.get_chosendata=function(){
	    	    	return choice_col;
	    	    };
	    	    that.refresh=function(){
	    	    	choice_col=[];
	    	    	chosen_container.innerHTML='';
	    	    };
	    	    
	    	    return that;
	    },
		initgrid : function(options) {
			var edit='',
			    that=this,
			    cell,
			    context=[],
			    inner = '',
			    head='',
			    body='',
				table = '<table>',
			    footer='',
			    clip=[],//use to get the grid current innerHTML string not use yet
			    source=options['data'],
			    columns=options['columns'],
			    reg,
			    k,
			    clipcut='';
			that[0].myplugin='grid';
			data['grid']=options['data'];
			if(options['className']){
				table=table.replace(/\>/,' class="'+options['className']+'" \>');
			}else{
				table=table.replace(/\>/,' class="table1" \>');
			}
			head += table + thead + tr.replace(/\>/,' data-row="'+0+'" \>');
			edit = td;	
			edit+=options['edit']!==undefined?'<button type="button" data-edit="edit"  value="edit">edit</button>':'';
			edit+=options['del']===true?'<button type="button" data-edit="delete" value="delete">delete</button>':'';
			edit+=end.call(td);	
			
			if(!columns){
				context=source;
			}else{
				for(i=0;i<source.length;i++){
					for(j=0;j<columns.length;j++){
						context[i]=context[i]===undefined?{}:context[i];
						if(columns[j].conversion!==undefined){
							reg=columns[j]['conversion'].match(/([\$]?[a-zA-Z0-9\-\_\&\:]+)(?=\'|\"|\,)|([\w]+)/g);
							for(k=0;k<reg.length;k++){
								if(reg[k]==='$data'){
									reg[k]=source[i][columns[j].field];
									break;
								}
							}
							context[i][columns[j].title]=window[reg[0]].apply(null,reg.slice(1));	
						}
						else{
							context[i][columns[j].title]=source[i][columns[j].field];
						}
					}
				}
			}
			
			
			for (i=0;i<columns.length;i++) {
				head += th.replace(/\>/,' style="width:'+ columns[i].width +'" >') + columns[i].title + end.call(th);
			}
			
			
			head += end.call(tr) + end.call(thead) + tbody;
			for (i = 0; i < context.length; i++) {
				body += tr.replace(/\>/,' data-row="'+(i+1)+'" >');
				for (p in context[i]) {
					if (context[0].hasOwnProperty(p)) {
                            if(options['celledit']!==undefined){
                            	cell=td.replace(/\>/,' data-edit="text" data-data="'+context[i][p]+'"  >');
                            }else{
                            	cell=td.replace(/\>/,' data-data="'+context[i][p]+'"  >');;
                            }
						body +=cell  + context[i][p] + end.call(td);
					}
				}
				if(options['edit']!==undefined||options['del']!==undefined){
				body +=edit+end.call(tr);
				}
				else{
					body +=end.call(tr);
				}
				clipcut===''?clipcut=body:clipcut;
			}
			footer=end.call(tbody) + end.call(table)
			inner = head + body + footer;
			that[0].innerHTML = inner;
             
			
			that.click(function(e){
				if(!e){e=window.event;}
				var current=e.target||e.srcElement;	
				if(current.getAttribute('data-data')===null&&current.getAttribute('data-edit')===null){
					return 0;
				}
               var father=current,
                   clipcut='',
                   table=father,
                   el=[],
                   share=[],
                   i,
                   tr,
                   j;
             
               while(father.tagName!=="TR")
            	   {
            	   father=father.parentNode;
            	   }
               while(table.tagName!=="TABLE"){
            	   table=table.parentNode;
                }
			    tr=table.getElementsByTagName('TR');
			    if(options['edit']!==undefined){
             		for(i=0;i<options['edit'].length;i++) 
            		{
            			clipcut=document.getElementById(options['edit'][i])!==null?
            					[document.getElementById(options['edit'][i])]:father.getElementsByTagName(options['edit'][i]);
            			el.push(clipcut);
            		}
			    }      
			   if(current.getAttribute('data-edit')==='delete'){
				   father.style.backgroundColor='#d7d7d7';
				   function deletethis(){
					   if(confirm("Delete this row?")){
						source.splice(parseInt(father.getAttribute('data-row'))-1,1);
					    table.deleteRow(father.getAttribute('data-row'));
					 
					     for(i=0;i<tr.length;i++){
					    	 tr[i].setAttribute('data-row',i);
					     }
					   }
					   else{
						   father.style.backgroundColor='';
					   }
					   }
				    if(options['delfunction']){
				    	options['delfunction'](current,deletethis);
				    	}
				    else{
				    	deletethis();
				    }
			       }
			   if(current.getAttribute('data-edit')==='edit'){
                 for(i=0;i<el.length;i++){
                	if(el[i].length!==0){
                      for(var j=0;j<el[i].length;j++){
                    	       share.push(el[i][j]);
                    		   el[i][j].readOnly=el[i][j].readOnly===true?false:true;
                    		   if(el[i][j].readOnly){
                    			   el[i][j].style.backgroundColor='#f1f1f1';
                    			   el[i][j].style.color='#999999';
                    		   }
                    		   else{
                    			   el[i][j].style.backgroundColor='';
                    			   el[i][j].style.color='';
                    		   }
                        	}
                		}
                 	}    
                 if(options['editfunction']!==undefined){
                	 options['editfunction'](share,current);
                 }
			   }
			   if(current.getAttribute('data-edit')==='text'){
				   current.innerHTML='<input type="text" value="'+current.getAttribute('data-data')+'">';
				   var input=current.getElementsByTagName('INPUT')[0];
				   input.focus();
				   $(input).blur(function(){
					   if(this.value===current.getAttribute('data-data'))
					   {
						   current.innerHTML=current.getAttribute('data-data');
						   return 0;
					   }
					   if(confirm('Really change this cell?')){
						   current.setAttribute('data-data',this.value);
						   current.innerHTML=this.value;
					   }
					   else{
						   current.innerHTML=current.getAttribute('data-data');  
					   }
					   if(options['blurfunction']!==undefined){
						   options['blurfunction'](current);
					   }
					   return 0;
				   })
				   
			   }
			   if(options['click']!==undefined){

	                 options['click'](share,current,source[parseInt(father.getAttribute('data-row'))-1]);
	                 }
			});
/*			that.blur(function(e){
				if(!e){e=window.event;}
				var current=e.target||e.srcElement;
			  alert(1);
				if(current.getAttribute('data-edit')===null){
					return 0;
				}
			if(current.getAttribute('data-edit')==='text'){
				   
					   current.innerHTML=input.value;
				   }
			});*/
			return that;
		},
		initcarlendar:function(options){
			var  table = '<table>',
				 pattern=/([\d]{4})([^\d])([\d]{1,2})(?:[^\d])([\d]{1,2})/,
		     	 context=ul.replace('\>'," class='ul' >"),
		     	starttime=pattern.exec(options['starttime']),
	            endtime=pattern.exec(options['endtime']),
	            yeardistance,
	            monthdistance,
	            startmonth=parseInt(starttime[3],10),
	            endmonth=parseInt(endtime[3],10),
	            startyear=parseInt(starttime[1],10),
	            endyear=parseInt(endtime[1],10),
	            inputyear,
	            inputmonth,
	            distance,
	            tdcontainer,
	            temporaryday,
	            temporary,
	        	datacontainer,
		     	 that=this,
		     	 collection_count=0,
		     	 collection=[],
		     	 calendar=function(year,month,date){
					var  monthcalendar,
					     i,
					     month=month-1;
					if(year%400==0||(year%4==0&&(!year%100==0)))
					   {
						  days[1]=29;
						  }
					  else 
					   {
						  days[1]=28;
						  }
					  var day=new Date(year,month,1),
					      d=day.getDay(),
					     m=days[month],
					     k=1;
					  monthcalendar=table.replace('\>'," onselectstart='return false;' \>")+thead+tr
					     +th.replace('\>'," colspan='7' class='title' \>")+year+'-'+monthname[month]+end.call(th)+end.call(tr)+tr;
					 for(i=0;i<7;i++){
						 monthcalendar+=th+week[i]+end.call(th);
					 	}
					 monthcalendar+=end.call(tr)+end.call(thead);
					 monthcalendar+=tbody;
					 for(i=0;i<6;i++){
						 monthcalendar+=tr;
						 for(j=0;j<7;j++)
						 {
							 if(((i*6)+j)===d||(k>1&&k<=m)){
								 monthcalendar+=td.replace('\>'," data-date='"+year+"-"+(month+1)+"-"+k+"' data-collection="+collection_count+" \>")+k+end.call(td);
								 k++;
								 collection_count++;
							 }
							 else{
								 monthcalendar+=td+'&nbsp'+end.call(td);
							 }
					     }
						 monthcalendar+=end.call(tr);
					 }     
					 monthcalendar+=end.call(tbody)+end.call(table);
					 return monthcalendar;
				};
				that[0].myplugin='carlendar';
				that[0].style.cssText='position:relative;';	
				if(options['className']){
					table=table.replace(/\>/,' class="'+options['className']+'" \>');
				}else{
					table=table.replace(/\>/,' class="table1" \>');
				}
	        	data['carlendar']={};
	        	datacontainer=data['carlendar'];
              if((monthdistance=endmonth-startmonth)>=0){
            	 if((yeardistance=endyear-startyear)>=0){
            		 distance = yeardistance*12 +monthdistance+1;
            	 }
            	 else {
            		 that[0].innerHTML='Wrong Date got!';
            		 return that; 
            	 }
              }
              else if((yeardistance=endyear-startyear)>0&&monthdistance<0){
            	  distance=yeardistance*12-startmonth+endmonth+1; 
              }
              else
              {
            	  that[0].innerHTML='Wrong date got!';
            	  return  that;
              };
            inputmonth=startmonth-1;     
            inputyear=startyear;
            for(i=0;i<distance;i++){
            	if(inputmonth<12){
            		inputmonth++;
            	}else{
            		inputmonth=1;
            		inputyear++;
            	}
             	context+=li+calendar(inputyear,inputmonth)+end.call(li); 
            }
            context+=end.call(ul);
            that[0].innerHTML=context;
            if(options['data']!==undefined){
            	tdcontainer=that[0].getElementsByTagName('TD');
            	for(i=0;i<tdcontainer.length;i++){
            		for(j=0;j<options['data'].length;j++){
            			temporary=pattern.exec(options['data'][j]['date']);
            			temporaryday=temporary[1]+temporary[2]+parseInt(temporary[3],10)+temporary[2]+parseInt(temporary[4],10);
            			if(tdcontainer[i].getAttribute('data-date')==temporaryday){
            				datacontainer[temporaryday]={};
            				datacontainer[temporaryday]['data']=options['data'][j];
            				datacontainer[temporaryday]['element']=tdcontainer[i];
            				tdcontainer[i].setAttribute('data-bind','true')
            				break;
            			}
            		}
            	}
            }
            if(options['load']!==undefined){
            	data.assist['carlendar']={};
            	data.assist['carlendar'].load=options['load'];
            	options['load'](datacontainer);
			}
	        that.click(function(e){
	        	if(!e){e=window.event;}
	        	var current=e.target||e.srcElement,
	        	    col,i,j,big,small,
	        	    select_class_name='this_selected',
	        	    tds=that[0].getElementsByTagName('TD');
	        	if(current.getAttribute('data-date')===null){
	        		return;
	        	}
	          	if(e.ctrlKey){
	        		current.className=select_class_name;
	        		collection.push(current);
	        	}
	          	if(e.shiftKey){
	          		col=parseInt(current.getAttribute('data-collection'));    		
	          		if(collection[0]!==undefined&&collection[1]===undefined){
	          			collection[1]=col;
	          			
	          			if(collection[0]>col){
	          				max=collection[0];
	          				min=collection[1];
	          			}else  if(collection[0]==col){
	          				collection[1]=undefined;
	          			}
	          			else{
	          				min=collection[0];
	          				max=collection[1];
	          			}   
	          		}
	          		else if(collection[1]!==undefined){
	          		     for(i=0;i<collection.length;i++){ 
	    	            	 if(typeof collection[i]==='number'||collection[i]===undefined){
	    	            		 	continue;
	    	            	 }
	    	            	 else{
	    	            		 collection[i].className='';
	    	            		 collection[i]=undefined;
	    	            	 }
	    	             }
	          		   collection[1]=col;
	          		   collection.splice(2,collection.length-2);
	          			if(collection[0]>collection[1]){
	          				max=collection[0];
	          				min=collection[1];
	          			}else{
	          				min=collection[0];
	          				max=collection[1];
	          			} 
	          		}
	          		else{
	          			collection.push(col);
	          			collection[2]=current;
	          		}         		
	          	   current.className=select_class_name;
	          	  if(collection[0]!==undefined&&collection[1]!==undefined){
	          		  		collection.splice(2,collection.length-2);
	            		   for(j=0;j<tds.length;j++){
	            			    if(parseInt(tds[j].getAttribute('data-collection'))>=min&&parseInt(tds[j].getAttribute('data-collection'))<=max){
	            			    	tds[j].className=select_class_name;
	            			    	collection.push(tds[j]);
	            			    } 
	            			    else{
	            			    	continue;
	            			    }
	            		   }
	               }
	          	
	          	}
	            if(options['click']&&!e.ctrlKey&&!e.shiftKey){
	            	options['click'](e,current,datacontainer);
	            }
	           
	        });
	        addEvent.call(that[0],'mousemove',function(e){
	        	var i=0;
	        	if(!e){e=window.event;}
	        	var current=e.target||e.srcElement;
	        	if(current.getAttribute('data-collection')===null){
	        		return;
	        	}
	        	if(options['mousemove']){
		            options['mousemove'](e,current,collection,datacontainer);
		        }	
	        });

	        addEvent.call(document,'keyup',function(e){
	             var i;
	             if(options['keyup']){
	            	 options['keyup'](e,collection,datacontainer);
	             }
	             for(i=0;i<collection.length;i++){
	            	 if(typeof collection[i]==='number'||collection[i]===undefined){
	            		 	continue;
	            	 }
	            	 else{
	            		 collection[i].className='';
	            	 }
	             }
	             collection=[];
	        });
			return that;
		},
		append : function(template){
			var  frag=document.createDocumentFragment(), 
                 div=document.createElement("DIV");
			     div.innerHTML=table+tr.replace(/\>/,' data-row="'+0+'" />')+template+end.call(tr)+end.call(table);
	             frag.appendChild(div);
			this[0].appendChild(frag);
			return this;	
		},
		change : function(options){
  			inner=this[0].innerHTML;
		}
		
	}, 
	funcs={
			endtag : function(str) {
				var str=str||this,
					reg = str.split(/[\s]/),
				    result=reg[0].replace('<', '</');
				
				if(result.match('>')===null){
					result=result+'>';
				}
				return result;
			},
			append : function(context) {
	              var inner=this[0].innerHTML;
	              alert(inner);
			},
			getdata:function(datatype){
				if(datatype){
					switch(datatype){
						case 'grid' :
							break;
						case 'carlendar':
							
							return data[datatype];
					}
					
				}
				else{
				return data;
				}
			},
			refresh	: function(newdata){
				var plugin=this.myplugin||this[0].myplugin,
					temporary,
					temporaryobject={},
					temporaryday,
					p,i,
					pattern=/([\d]{4})([^\d])([\d]{1,2})(?:[^\d])([\d]{1,2})/,
					that=this,
					tdcontainer=that[0].getElementsByTagName('TD');
				switch(plugin){
					case 'grid':
						break;
					case 'carlendar':
						for(i=0;i<newdata.length;i++){
							temporary=pattern.exec(newdata[i]['date']);
		        			temporaryday=temporary[1]+temporary[2]+parseInt(temporary[3],10)+temporary[2]+parseInt(temporary[4],10);
							temporaryobject[temporaryday]={};
							temporaryobject[temporaryday]['data']=newdata[i];
						}
						$.extend(data[plugin],temporaryobject);	
						for(i=0;i<tdcontainer.length;i++){
							if(data[plugin][tdcontainer[i].getAttribute('data-date')]!==undefined&&data[plugin][tdcontainer[i].getAttribute('data-date')].element==undefined){
								data[plugin][tdcontainer[i].getAttribute('data-date')].element=tdcontainer[i];
							}
						}
						if(data.assist[plugin]&&data.assist[plugin].load){
							data.assist[plugin].load(data[plugin]);
						}
						break;
				}
			}
	},
	data={assist:{}},
	end = funcs.endtag, 
	addEvent=Event.addEvent,
	getEvent=Event.getEvent,
	concat=Array.prototype.concat,
	removeEvent=Event.removeEvent,
	slice = Array.prototype.slice;

    
	
	
	/*jquery.mygrid expect an parameter object like this:
	 *@param 
	 * 	{ 
	 * 	@innerfunction param: 
	 * 	formelements : on this row formelements ;
	 * 	button : current button ;
	 * 	function : event function ;
	 *@property 
	 * 	data : [{here goes the table row data},{the second}], 
	 * 	className : 'table class',
	 * 	columns : [{field:bind with data field,title:show title}],
	 * 	edit : [/here goes the rules like form elements tagname or id/,'input','textarea','id'],
	 * 	del : boolean/ here can disappear button del and edit/,
	 * 	editfunction : function( formelements , button ){ **code here** },
	 * 	delfunction : function( button,function ){ **code here** },
	 * 	celledit : true/this can make an input display in td/ ,
	 * 	celleditfunctoin : function(){ **code here** },
	 * }
	 * */
	$.fn.mygrid = function(method){
		method = method || 'initgrid';
		if (methods[method]) {
			return methods[method].apply(this, slice.call(arguments, 1));
		}
		else if(typeof method==="object"){
			return methods.initgrid.apply(this,arguments);
		}
		else {
			$.error('Method ' + method + ' does not exist on jQuery.mygrid');
		}
	};
	/*jquery.mycalendar expect an parameter object like this:
	 *@param 
	 * { 	 
	 * 	@innerfunction param: 
	 * 	datacontainer : Object that obtains data bind to element can get element like  datacontainer.element,get data datacontainer.data;
	 * 	collection : Array when click here get all selected td,(Note) when select with shift key ,collection[0] and collection[1] obtain numbers pointer the begin and end td;
	 * 	e: Object event object;
	 * 	current : Element event focus element
	 *@property 
	 *	data:[{date:'2012-2-3'},...],
	 *	starttime:*such as* '1988-2-3' or '1988/2/3' whatever between the numbers , 
	 *  endtime:*just like start time but larger than start or will be wrongdate * '1999-02-13',
	 *	click:function(e,current,datacontainer){ **code here** },
	 *  keyup:function(e,collection,datacontainer){ **code here**},
	 *	load:function(datacontainer){ **code here** },
	 *	mousemove:function(e,current,collection,datacontainer){ **code here** }
	 * */
	
	$.fn.mycalendar=function(method){
		method = method || 'initcarlendar';
		if (funcs[method]) {
			return funcs[method].apply(this, slice.call(arguments, 1));
		}
		else if(typeof method==="object"){
			return methods.initcarlendar.apply(this,arguments);
		}
		else {
			$.error('Method ' + method + ' does not exist on jQuery.mycalendar');
		}
	};
	/*jquery.mytree expect an parameter object like this:
	 *@param 
	 * { 	 
	 * 	@innerfunction param: 
	 * 	datacontainer : Object that obtains data bind to element can get element like  datacontainer.element,get data datacontainer.data;
	 * 	choice_col : Object when click here get all selected data;
	 * 	e: Object event object;
	 * 	current : Element event focus element
	 *@property 
	 *	data:[{date:'2012-2-3'},...],
	 *	maxDepth:*such as* '1988-2-3' or '1988/2/3' whatever between the numbers , 
	 *	layer:number show layers default 2 ,
	 *	width:number innerBox width default 280,
	 *	path :[nodeId1,nodeId2,nodeId3,...] show history Path,
	 *  action:['add','modify','del','show','choice'],
	 *	transfer:{parentNode:'**ur name**',nodeName:'**ur name**',nodeId:'**ur name**',Children:'**ur name**'},
	 *  choice_handle:function(choice_col){ **code here**},
	 * */
	$.fn.mytree=function(options){
		options=options||'inittree';
		if(typeof options==="object"){
			return methods.inittree.apply(this,arguments);
		}
		else {
			$.error('Wrong Args!');
		}
		
	};
	
	
	/* data control expect an string parameter 
	 * Point object funcs
	 * @param
	 * funcs methods 
	 * "refresh" : $(calendar).mydata("refresh",[{.new data.},{.new data.}]);
	 * "getdata" : $.fn.mydata('');
	 * 
	 * */
	$.fn.mydata=function(func){
		
		if(funcs[func]){
				return funcs[func].apply(this, slice.call(arguments, 1));;
			}
		else {
			$.error('mydata ' + func + ' does not exist on jQuery.mydata');
		}
	};
	/*
	 * 
	 * */
	$.fn.mylib=function(func){
		if(funcs[func]){
			return funcs[func].apply(this, slice.call(arguments, 1));;
		}
		else {
			$.error('my function ' + func + ' does not exist on jQuery.mylib');
		}
	}
})(jQuery)