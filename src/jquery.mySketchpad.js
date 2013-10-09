/**/
;(function($, window) {
	Function.prototype.method=function(name,fn){
		if(!this.prototype[name]){
			this.prototype[name]=fn;
			return
		}else{
			throw name+' Conflict';
			return false;
		}

	};
	var doc=document,
		Paint=function (obj){
		var user_agent=obj.navigator.userAgent,
		xmlns="http://www.w3.org/2000/svg",
		version='1.1',
		user_agent_version=user_agent.match(/MSIE([^;]*)/),
		isjunkIE=user_agent_version&&(parseInt(user_agent_version[1])<9),
		init_el=function(options){
					var p='';
					for(p in options){
						options.hasOwnProperty(p)&&this.setAttribute(p,options[p]);
					}
		},
		render= function(child){
			var isString=typeof child=='string'?true:false;
			isString?(this.innerHTML+=child):(this.appendChild(child));
			return this;
			},
		paint=isjunkIE?{
			render:render,
			makeCanvas:function(width,height,positionX,positionY){
				var container=doc.createElement("DIV"),
					width=width+'px'||'200px',
					height=height+'px'||'200px',
					canvas='<?import namespace = lyvml urn = "urn:schemas-microsoft-com:vml" implementation = "#default#VML" declareNamespace />'+
					'<lyvml:group data-group="group" style="width: '+width+'px; height: '+height+
					'px; position: relative; top:0px;left:0px;" coordorig="0 0" coordsize = "'+width+' '+
					height+'">'+
					"</lyvml:group>";
					container.innerHTML=canvas;
					canvas=container.getElementsByTagName('GROUP')[0];
					container=null;
					return  canvas;
					}, 
			makePath:function(strokewidth,strokecolor,fillcolor,pointer/*path pointer @type array*/,close){
				var that=this,
					container=doc.createElement("DIV"),
					strokewidth=strokewidth|2,
					strokecolor=strokecolor||'#cb0000',
					close=close?'xe':' ',
					fillcolor=fillcolor||"none",
					filter=fillcolor=='none'?'':'<lyvml:fill   opacity = "0.7"  color='+fillcolor+'></lyvml:fill>',
					pointer=pointer||[0,0,0,0,0,0,0,0],
					pointerstr='M'+pointer[0]+','+pointer[1],
					shape='';
					for(var i=2,k=pointer.length;i<k;i++){
					pointerstr+=i%2==0?'L'+pointer[i]+',':pointer[i];
					}
				  if (doc.namespaces) {
					doc.namespaces.add("lyvml", "urn:schemas-microsoft-com:vml", "#default#VML");
					}
				pointerstr+=' '+close;
				shape='<?import namespace = lyvml urn = "urn:schemas-microsoft-com:vml" implementation = "#default#VML" declareNamespace />'+
					'<lyvml:shape data-group="shape" style="rotation:0; POSITION: absolute; WIDTH: 1px; DISPLAY: inline-block; HEIGHT: 1px"  coordorig="0,0"  coordsize = "1,1"  '+
						'strokecolor = "'+strokecolor+'" '+
						'strokeweight = "'+strokewidth+'px" '+
						'path = " '+pointerstr+'">'+
						filter+
						'<lyvml:stroke></lyvml:stroke>'+
						'</lyvml:shape>';
				container.innerHTML=shape;
				shape=container.getElementsByTagName('SHAPE')[0];
				container=null;
				return [shape];
			},
			makeVector:function(x1,y1,x2,y2){
				var container=doc.createElement('DIV'),
					vector='<?import namespace = lyvml urn = "urn:schemas-microsoft-com:vml" implementation = "#default#VML" declareNamespace />'+
					'<lyvml:line data-group="line"  style="rotation:0;position:absolute;" '+
					'from="'+x1+','+y1+'" to="'+x2+','+y2+'" >'+
					'<lyvml:stroke color="#069" EndArrow="Classic" ></lyvml:stroke>'+
					'</lyvml:line>';
					container.innerHTML=vector;
					vector=container.getElementsByTagName('LINE')[0];
					container=null;
				return [vector];
			},
			makeCircle:function( cx,cy,r,strokewidth,strokecolor,fillcolor,fillopacity){
				var	 r=r||1,
				container=doc.createElement('DIV'),
				height=height||100,
				strokeopacity=strokeopacity||"0.8",
				strokewidth=strokewidth||1,
				strokecolor=strokecolor||'#069',
				fillcolor=fillcolor||'#069', 
				fillopacity=fillopacity||"0.8",
				filter=fillcolor=='none'?'':'<lyvml:fill   opacity = "0.7"  color='+fillcolor+'></lyvml:fill>',
				circle='<?import namespace = lyvml urn = "urn:schemas-microsoft-com:vml" implementation = "#default#VML" declareNamespace />'+
					'<lyvml:oval  data-group="circle" style="rotation:0;position:absolute;left:'+(cx-r)+'px;top:'+(cy-r)+'px;width:'+2*r+
					'px;height:'+2*r+'px;" >'+
					'<lyvml:stroke width="'+strokewidth+'px"  color="'+strokecolor+'"></lyvml:stroke>'+
					filter+
					'</lyvml:oval >';
				container.innerHTML=circle;	
				circle=container.getElementsByTagName('OVAL')[0];
				container=null;
				return [circle];
			}, 
			makeRect:function(x,y,width,height,strokewidth,strokecolor,strokeopacity,fillcolor,fillopacity){
				var	width=width||100,
				height=height||100,
				container=doc.createElement('DIV'),
				strokeopacity=strokeopacity||"0.8",
				strokewidth=strokewidth||1,
				strokecolor=strokecolor||'#069',
				fillcolor=fillcolor||'#069', 
				fillopacity=fillopacity||"0.8",
				filter=fillcolor=='none'?'':'<lyvml:fill   opacity = "0.7"  color='+fillcolor+'></lyvml:fill>',
				rect='<?import namespace = lyvml urn = "urn:schemas-microsoft-com:vml" implementation = "#default#VML" declareNamespace />'+
					'<lyvml:Rect data-group="rect" style="rotation:0; position:absolute;left:'+x+'px;top:'+y+'px;width:'+width+'px;height:'+height+'px;">'+
					//'<lyvml:shadow on="T" type="single" color="#b3b3b3" offset="5px,5px"></lyvml:shadow>'+  <---------------------VML shadow
					'<lyvml:stroke width="'+strokewidth+'px"  color="'+strokecolor+'" opacity="'+strokeopacity+'" ></lyvml:stroke>'+
					filter+
					'</lyvml:Rect>';
				container.innerHTML=rect;
				rect=container.getElementsByTagName("RECT")[0];
				container=null;
				return [rect];
			},
			makeLinearGradient:function(){

			},
			zoomCanvas:function(obj,zoom/*@string in|out*/,zoomrate){
			var zoomrate=zoomrate||1.1,
			zoom=zoom=='in'?false:true,
			canvas=obj._canvas,
			parent=canvas.parentNode,
			x=canvas.coordsize.x,
			y=canvas.coordsize.y;
			if(zoom){
				x*=zoomrate;
				y*=zoomrate;
			}else{
				x/=zoomrate;
				y/=zoomrate;
			}	
			canvas.coordsize.x=x;
			canvas.coordsize.y=y;
			parent.innerHTML=canvas.outerHTML;
			obj._canvas=parent.getElementsByTagName('group')[0];
			return obj;
			},
			moveCanvas:function (obj,moveX,moveY){
				var moveX=moveX||0,
				moveY=moveY||0,
				viewValue=canvas.getAttribute('viewBox').split(' ');
				viewValue[0]=parseFloat(viewValue[0])+moveX;
				viewValue[1]=parseFloat(viewValue[1])+moveY;
				canvas.setAttribute('viewBox',viewValue.join(' '));
				return canvas;
			},
			rollItem:function(shape/*@element*/,rollangel,cx,cy){
				var rotate='rotation',
					orgAngel=parseInt(shape.style.rotation),
					rollangel=rollangel||10,
					finalAngel=orgAngel+rollangel;
					shape.style.rotation=finalAngel;
					return shape;
			}
		}:{	
			render:render,
			makeCanvas:function(width,height){
				var canvas=doc.createElementNS(xmlns,'svg'),
					marker=doc.createElementNS(xmlns,'marker'),
					arrow=doc.createElementNS(xmlns,'path'),
					width=width,
					height=height;
				init_el.call(canvas,{
					'xmlns':xmlns,
					'version':version,
					'width':width,
					'height':height,
					'currentscale':1,
					'viewBox':'0 0 '+width+' '+height
					});
				init_el.call(arrow,{
					d:"M 0 0 L 20 10 L 0 20 z",
					fill:'#069',
					stroke:"#069",
					strokeweight:'2px'
					});
				init_el.call(marker,{
					id:'bigArrow',
					viewBox:'0 0 20 20',
					refX:'0',
					refY:'10',
					markerUnits:'strokeWidth',
					markerWidth:'3',
					markerHeight:'10',
					orient:'auto'
				});
				marker.appendChild(arrow);
				canvas.appendChild(marker);
				return canvas;
			},
			zoomCanvas:function(obj,zoom/*@string in|out*/,zoomrate){
				var zoomrate=zoomrate||1.1,
				zoom=zoom=='in'?false:true,
				canvas=obj._canvas,//---->#not good
				viewValue=canvas.getAttribute('viewBox').split(' ');
				viewValue[2]=parseFloat(viewValue[2]);
				viewValue[3]=parseFloat(viewValue[3]);
				if(zoom){
					viewValue[2]*=zoomrate;
					viewValue[3]*=zoomrate;
				}else{
					viewValue[2]/=zoomrate;
					viewValue[3]/=zoomrate;
				}
				canvas.setAttribute('viewBox',viewValue.join(' '));
				return canvas;
			},
			moveCanvas:function(obj,moveX,moveY){
				var moveX=moveX||0,
					moveY=moveY||0,
					canvas=obj._canvas,//---->#not good
					viewValue=canvas.getAttribute('viewBox').split(' ');
					viewValue[0]=parseFloat(viewValue[0])+moveX;
					viewValue[1]=parseFloat(viewValue[1])+moveY;
					canvas.setAttribute('viewBox',viewValue.join(' '));
					return canvas;
			},
			makePath:function(strokewidth,strokecolor,fillcolor,pointer/*path pointer @type array*/,close){
				var g=doc.createElementNS(xmlns,'g'),
				path=doc.createElementNS(xmlns,'path'),
				//filter=doc.createElementNS(xmlns,'path'),
				pointer=pointer||[0,0,0,0,0,0,0,0],
				close=close?'z':' ',
				strokewidth=strokewidth||'2px',
				stroke_linecap='square',
				stroke_linejoin="round",
				stroke_opacity='0.7',
				fill=fillcolor||'none',
				pointerstr='M'+pointer[0]+','+pointer[1],
				that=this;
				for(var i=2,k=pointer.length;i<k;i++){
					pointerstr+=i%2==0?'L'+pointer[i]+',':pointer[i];
				}
				pointerstr+='  '+close;
				init_el.call(path,{
					d:pointerstr,
					'stroke-opacity':stroke_opacity,
					'stroke-width':strokewidth,
					fill:fill,
					'fill-opacity':0.7,
					'stroke-linecap':stroke_linecap,
					'stroke-linejoin':stroke_linejoin,
					stroke:strokecolor
					});
				// init_el.call(filter,{ 
				// 	d:pointerstr,
				// 	'stroke-opacity':stroke_opacity,
				// 	'stroke-width':strokewidth,
				// 	fill:"url(#wnnnnnnnnn_1)",
				// 	'stroke-linecap':stroke_linecap,
				// 	'stroke-linejoin':stroke_linejoin,
				// 	stroke:strokecolor
				// 	});
				g.appendChild(path);
				//g.appendChild(filter);
				return [g,path];
			},
			makeCircle:function(cx,cy,r,strokewidth,strokecolor,fillcolor,fillopacity){
				var circle=doc.createElementNS(xmlns,'circle'),
					g=doc.createElementNS(xmlns,'g'),
					text=doc.createElementNS(xmlns,'text'),
					stroke_opacity="0.8",
					fillopacity=fillopacity||"0.8";
					text.value="this is circle";
				init_el.call(circle,{
					'cx':cx,
					'cy':cy,
					'r':r,
					'stroke-opacity':stroke_opacity,
					'stroke-width':strokewidth,
					'fill-opacity':fillopacity,
					'fill':fillcolor,
					'stroke':strokecolor
					});
				g.appendChild(circle);	
				g.appendChild(text);
				return [g,circle];
			},		
			makeVector:function(x1,y1,x2,y2){
				var line=doc.createElementNS(xmlns,'line'),
					g=doc.createElementNS(xmlns,'g');
				init_el.call(line,{
					'x1':x1,
					'y1':y1,
					'x2':x2,
					'y2':y2,
					fill:"#069",
					'stroke':'#069',
					'stroke-width':'2px',
					'marker-end':'url(#bigArrow)'
				});
				g.appendChild(line);
				return [g,line];
			},
			makeRect:function(x,y,width,height,strokewidth,strokecolor,strokeopacity,fillcolor,fillopacity){
				var rect=doc.createElementNS(xmlns,'rect'),
				g=doc.createElementNS(xmlns,'g'),
				width=width||'100px',
				height=height||"100px",
				strokeopacity=strokeopacity||"0.8",
				strokewidth=strokewidth||'1px',
				strokecolor=strokecolor||'#069',
				fillcolor=fillcolor||'#069', 
				fillopacity=fillopacity||"0.8";
				init_el.call(rect,{
					'x':x,
					'y':y,
					'width':width,
					'height':height,
					'stroke-width':strokewidth,
					'stroke-opacity':strokeopacity,
					'stroke':strokecolor,
					'fill-opacity':fillopacity,
					'fill':fillcolor,
				});
				g.appendChild(rect);
				return [g,rect];
			},
			rollItem:function(shape/*@element*/,rollangel,cx,cy){
				var transform='transform',
				rotate='rotate(angle,cx,cy)',
				rollangel=rollangel||10,
				varangel=0,
				reg=/\d+/,
				organgel=0,
				cx=cx||0,
				cy=cy||0;
				rotate=rotate.replace(/angle/,rollangel);
				rotate=rotate.replace(/cx/,cx);
				rotate=rotate.replace(/cy/,cy);
				if(!shape.getAttribute(transform)){shape.setAttribute(transform,rotate);}
				else{
					organgel=shape.getAttribute(transform).match(reg);
					organgel=parseInt(organgel)>360?parseInt(organgel)-360:parseInt(organgel);
					varangel=parseInt(organgel)+rollangel;
					rotate=rotate.replace(reg,varangel);
					shape.setAttribute(transform,rotate);
				}
				return shape;
			},
			makeLinearGradient:function(){
				//useless in wrong way
				var defs=doc.createElementNS(xmlns,'defs'),
				lineargradient=doc.createElementNS(xmlns,'lineargradient'),
				all_stop=[],
				offset=offset||[ '0%','10%' ,'25%','92%','100%' ],
				i=offset.length,
				j=0;
				offset=offset.reverse();
				lineargradient.setAttribute('id',"wnnnnnnnnn_1");
				lineargradient.setAttribute('gradientTransform',"rotate(90)");
				do{
					all_stop.push(doc.createElementNS(xmlns,'stop'));
					all_stop[j].setAttribute('offset',offset[i-1]);
					all_stop[j].style.cssText="stop-color:#fff; stop-opacity:"+(j==3?0.3:0)+"";
					lineargradient.appendChild(all_stop[j]);
					j++;
				}while(--i>0)
				defs.appendChild(lineargradient);
				return defs;
			}
		},
		commom=function(obj){
			var f=function(){
				this.makeArrow=function(x,y){
					var x=x||0,y=y||0;
				return Paint.makePath('2px','#069','#069',[7+x,0+y,0+x,10+y,3+x,10+y,3+x,20+y,11+x,20+y,11+x,10+y,14+x,10+y],true);
				};
			};
			f.prototype=obj;
			return new f();
		}(paint);
		return  commom;
	}(window,doc),
	CANVAS=function(map,width,height,left,top){
		var that=this,
		make_canvas=Paint.makeCanvas,
		make_path=Paint.makePath,
		//datapad=doc.createElement('DIV'),
		canvas=make_canvas(width,height);
		//datapad.style.cssText='position:absolute; width:50px; height:50px;left:1px;top:1px;background-color:#d7d7d7;';
		canvas.style.cssText='position:absolute ; width:'+width+'px; height:'+height+'px;left:'+left+'px;top:'+top+'px;';
		that._canvas=canvas;
		that._groups=[];
		//datapad.innerHTML="this is datapad";
		map.appendChild(canvas);
		//map.appendChild(datapad);
		return that;
	};
	CANVAS.method("makePath",function(strokewidth,strokecolor,fillcolor,pointer/*path pointer @type array*/,close){
		var close=close?true:false,
		render=Paint.render,
		make_path=Paint.makePath,
		g=make_path(strokewidth,strokecolor,fillcolor,pointer/*path pointer @type array*/,close)[0];
		render.call(this._canvas,g);
		this._groups.push(g);
		return this;
	});
	CANVAS.method('makeVector',function(x1,y1,x2,y2){
		var render=Paint.render,
			make_vector=Paint.makeVector,
			g=make_vector(x1,y1,x2,y2)[0];
			render.call(this._canvas,g);
			this._groups.push(g);
			return this;
	});
	CANVAS.method("makeCircle",function(cx,cy,r,stokewidth,storkecolor,fillcolor,fillopacity){
		var render=Paint.render,
			make_circle=Paint.makeCircle,
			g=make_circle(cx,cy,r,stokewidth,storkecolor,fillcolor,fillopacity)[0];
			render.call(this._canvas,g);
			this._groups.push(g);
			return this;
	});
	CANVAS.method("makeRect",function(x,y,width,height,strokewidth,strokecolor,strokeopacity,fillcolor,fillopacity){
		var render=Paint.render,
			make_rect=Paint.makeRect,
			g=make_rect(x,y,width,height,strokewidth,strokecolor,strokeopacity,fillcolor,fillopacity)[0];
			render.call(this._canvas,g);
			this._groups.push(g);
			return this;
	});
	CANVAS.method("makeArrow",function(left,top){
		var arrow=Paint.makeArrow(left,top)[0],
			render=Paint.render;
			render.call(this._canvas,arrow);
			this._groups.push(arrow);
			return this;
	});
	CANVAS.method('rollGroups',function(num/*@number|@array*/,rollangel,cx,cy){
		var	selectNum=typeof num=="number"?[num]:num,
			roll=Paint.rollItem,
			i=selectNum.length;
			while(i>0){
				--i;
				roll(this._groups[selectNum[i]],rollangel,cx,cy);
			}
			return this;
	});
	CANVAS.method("moveCanvas",function(moveX,moveY){
		var move_canvas=Paint.moveCanvas;
			move_canvas(this,moveX,moveY);
			return this;
	});
	CANVAS.method('zoomCanvas',function(zoom/*@string in|out */,zoomrate/*@number default:1.1*/){
		var zoomrate=zoomrate||1.1,
			zoom_canvas=Paint.zoomCanvas;
			zoom_canvas(this,zoom,zoomrate);
			return this;
	});
	$.fn.Sketchpad=function(width,height,left,top){
		var 	width=width||100,
			height=height||100,
			left=left||0
			top=top||0,
			p=new CANVAS(this[0],width,height,left,top);

		return p;
	};
	
})(jQuery,window);