!function(t){var i={};function e(s){if(i[s])return i[s].exports;var h=i[s]={i:s,l:!1,exports:{}};return t[s].call(h.exports,h,h.exports,e),h.l=!0,h.exports}e.m=t,e.c=i,e.d=function(t,i,s){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:s})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},e.p="",e(e.s=0)}([function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var s=e(1);window.BulletScreen=s.a},function(t,i,e){"use strict";class s{constructor({id:t="",speed:i=2,color:e="#000",size:h=16,gap:a=4}={}){let n=document.createElement("canvas"),o=document.getElementById(t);n.width=o.offsetWidth,n.height=o.offsetHeight,o.appendChild(n),this.width=n.width,this.height=n.height,this.color=e,this.canvas=n,this.ctx=n.getContext("2d"),this.speed=i,this.pool=[],this.top=20,this.index=0,this.eventMap={},this.fps=0,this.fpsTimer=null,this.size=h,this.gap=a,this.data=[],this.cancelId=null,this.ctx.font=`${h}px Arial`,s.getAnimation(),this.line=s.getLinesBySize(this.size+this.gap,this.height),this.lineLeft=new Array(this.line).fill(0),this.start=this.start.bind(this)}run(){if(null!==this.cancelId)return!1;this.start(),this.getFPS()}start(){this.render(),this.parse(),this.fps+=1,this.cancelId=window.requestAnimFrame(this.start)}stop(){if(!this.cancelId)return!1;window.cancelAnimationFrame(this.cancelId),clearInterval(this.fpsTimer),this.fpsTimer=null,this.cancelId=null}parse(){for(let t=0,i=this.data.length;t<i;t++)"static"===this.data[t].type?this.data[t].frames>=0&&(this.data[t].frames-=1):this.data[t].width+this.data[t].left>-10&&(this.data[t].left-=this.speed);for(let t=0,i=this.lineLeft.length;t<i;t++)this.lineLeft[t]<=0||(this.lineLeft[t]=this.lineLeft[t]-this.speed)}render(){this.ctx.clearRect(0,0,this.width,this.height);for(let t=0,i=this.data.length;t<i;t++)this.data[t].frames&&this.data[t].frames<0||this.data[t].left>=this.width||this.data[t].width+this.data[t].left<=-10||("color"===this.data[t].type?this.fillSpecialText(this.data[t]):this.fillText(this.data[t]))}push(t,i="default"){let e=this.ctx.measureText(t).width,s=Math.round(Math.random()*(this.line-1)),h=this.lineLeft[s]+this.width,a=(s+1)*(this.gap+this.size);this.lineLeft[s]+=e+10;let n={words:t,type:i,left:h,top:a,width:e,color:this.color};"color"===i&&(n.color="#fff",n.background=`rgba(${Math.round(255*Math.random())},${Math.round(255*Math.random())},${Math.round(255*Math.random())},0.7)`),"static"===i&&(n.top=this.top%this.height,n.left=(this.width-e)/2,n.frames=300,this.top=this.top%this.height+20);let o=this.pool.shift();if(void 0!==o)this.data[o]=n;else{this.findReuse();let t=this.pool.shift();void 0!==t?this.data[t]=n:this.data.push(n)}}fillText(t){this.ctx.beginPath(),this.ctx.fillStyle=t.color,this.ctx.fillText(t.words,t.left,t.top)}fillSpecialText(t){this.ctx.beginPath(),this.ctx.lineCap="round",this.ctx.moveTo(t.left,t.top),this.ctx.lineTo(t.left+t.width,t.top),this.ctx.strokeStyle=t.background,this.ctx.lineWidth=30,this.ctx.stroke(),this.ctx.beginPath(),this.ctx.fillStyle=t.color,this.ctx.fillText(t.words,t.left,t.top+6)}findReuse(){this.pool=[];for(let t=0,i=this.data.length;t<i;t++)this.data[t].frames&&this.data[t].frames<0&&this.pool.push(t),this.data[t].width+this.data[t].left<=-10&&this.pool.push(t)}getFPS(){this.fpsTimer=setInterval(()=>{this.emit("fps",this.fps),this.fps=0},1e3)}on(t="",i=null){"function"==typeof i&&(this.eventMap[t]=i)}emit(t,...i){this.eventMap[t]&&"function"==typeof this.eventMap[t]&&this.eventMap[t](...i)}static getAnimation(){window.requestAnimFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(t,1e3/60)}}static getLinesBySize(t,i){return Math.floor(i/t)}}i.a=s}]);