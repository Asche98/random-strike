var rs={
w:691,
h:413,
update:function(){
    pl1.update();
    pl2.update();
    for(var i=0;i<bullets.length;i++){
    	bullets[i].update();
    }
},
create:function(){
	ctx.clearRect(0,0,this.w,this.h);
	ctx.drawImage(bg,0,0);
	pl1.create();
	pl2.create();
	scale1.create();
    scale2.create();
    for(var i=0;i<bullets.length;i++){
    	bullets[i].create();
    }
},
}

var Sprite=function(x,y,w,h){
	this.x=x,
	this.y=y,
	this.w=w,
	this.h=h,
	this.bg=new Image(),
	this.bg.src='img/sprite.png'
}
Sprite.prototype={
	render:function(x,y){ctx.drawImage(this.bg,this.x,this.y,this.w,this.h,x,y,this.w,this.h);}
}

var Pl=function(startX,startDir,enemy){
this.x=startX;
this.dir=startDir;
this.speed=(this.dir==0)?30:-30;
this.enemy=enemy;
}
Pl.prototype={
frame:0,
frameCount:0,
y:290,
health:100,
turnOffset:53,
turn:Math.floor(Math.random()*2),
create:function() {if(this.isExist()){plS[this.dir][this.frame].render(this.x,this.y)}},
step:function(){
	this.frameCount++;
    if(this.isNotBorderCollision() && this.frameCount%13==0){
	    if(this.frame<2){
    	    this.frame++;
    }else{
    	this.frame=0;
    	this.frameCount=0;
    	this.x+=this.speed;
    	this.stepCount--;
    }
}
},
turn:function(){
	this.speed=-this.speed;
    this.dir=(this.dir==0)?1:0;
    this.x+=(this.dir==0)?this.turnOffset:-this.turnOffset;
},
isExist:function(){
	return this.health>0;
}
}

var Bullet=function(pl,enemy){
	this.pl=pl;
	this.enemy=enemy;
	this.dir=this.pl.dir;
	this.speed=(this.dir==0)?6:-6;
	this.x=(this.dir==0)?pl.x+plS[pl.dir][pl.frame].w:pl.x;
}
Bullet.prototype={
	y:312,
	w:11,
	h:10,
	create:function(){
	    bulletS[this.dir].render(this.x,this.y);
	},
	update:function(){
		if(this.x<0 || this.x>rs.w){
			bullets.splice(0,1);
			return;
		}
		if(this.enemy.isExist() && this.enemy.isBulletCollision(bullets[0])){
		    this.damage=Math.floor(Math.random()*this.enemy.health)+1;
	        this.enemy.health-=this.damage;
	        bullets.splice(0,1);
		}
		this.x+=this.speed;
}
};
var Scale=function(x,pl){
this.x=x;
this.pl=pl;
this.numberX=this.x+50;
}
Scale.prototype={
y:35,
numberY:51,
w:130,
h:20,
color:"#00ff00",
numberColor:"#000000",
font:"oblique bold 15px Arial",
create:function(){
ctx.fillStyle=this.color;
ctx.fillRect(this.x,this.y,this.pl.health*1.3,this.h);
ctx.fillStyle=this.numberColor;
ctx.font=this.font;
ctx.fillText(this.pl.health,this.numberX,this.numberY);
},
}

//Objects & metods
var pl1=new Pl(20,0);
pl1.isNotBorderCollision=function(){return this.x+this.speed<=325 && this.x+this.speed>=-65};
pl1.isBulletCollision=function(bullet){return bullet.x<this.x+50};
pl1.update=function(){
	var pl=this;
	window.onkeydown=function (e) {
	if(e.keyCode==39){
		pl.stepCount=1;
        if(pl.dir==1){
    		pl.turn();
    	}
}
    if(e.keyCode==37){
    	pl.stepCount=1;
    	if(pl.dir==0){
    		pl.turn();
    	}
    }
    if(e.keyCode==32){
		bullets.push(new Bullet(pl1,pl2));
    }
}
    if(this.stepCount){
    	this.step();
    }
}
var pl2=new Pl(568,1);
pl2.isNotBorderCollision=function(){return this.x+this.speed>=270 && this.x+this.speed<=675};
pl2.isBulletCollision=function(bullet){return bullet.x>this.x+50};
pl2.update=function(){
    if(this.stepCount!==0){
    	this.step();
    }
    else if(!this.shoot){
    	bullets.push(new Bullet(pl2,pl1));
    	this.shoot=1;
    }
}
var scale1=new Scale(41,pl1);
var scale2=new Scale(546,pl2);
var bullets=[];

//Sprites
var plS=[[new Sprite(0,0,85,107),new Sprite(0,109,92,108),new Sprite(0,218,101,107)],[new Sprite(0,326,85,107),new Sprite(0,435,93,106),new Sprite(0,543,99,106)]];
var bulletS=[new Sprite(0,657,11,10),new Sprite(0,648,11,10)];

var bot=function(){
	pl2.stepCount=Math.floor(Math.random()*10);
}
var tick=function(){
rs.create();
rs.update();
requestAnimationFrame(tick);
}

function main(){
canvas= document.getElementById('rs');
ctx=this.canvas.getContext("2d");
bg=new Image();
bg.src='img/game-bg4.png';
tick();
bot();
}
window.onload=main;