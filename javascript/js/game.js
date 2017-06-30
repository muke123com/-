var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 300;
var r = 5;


//person类
function Person(obj){
	this.name = obj.name;
	this.skin = obj.skin;
	this.x = obj.x;
	this.y = obj.y;
	this.v = obj.v;
	this.rad = obj.rad;
	this.vx = this.v * Math.cos(this.rad);
	this.vy = this.v * Math.sin(this.rad);
}

Person.prototype.draw = function(){
	ctx.beginPath();
	ctx.fillStyle = this.skin;
	ctx.arc(this.x, this.y, r, 0, Math.PI*2);
	ctx.fill();
	ctx.closePath();
}

Person.prototype.move = function(){
	this.x += this.vx;
	if(this.x < 0 || this.x > canvas.width){
		this.vx = -this.vx
	}
	if(this.y < 0 || this.y > canvas.height){
		this.vy = -this.vy
	}
	this.y += this.vy;
	this.draw();
	document.querySelector("."+this.name).innerHTML = 
		'<h5>'+this.name+'</h5>'+
		'<p>'+this.x+';'+this.y+'</p>';
}

var cp_attribute = {
	name: 'c1',
	skin: '#fff',
	x: 200,
	y: 200,
	v: r,
	rad: Math.random()*Math.PI*2
}
var cp = new Person(cp_attribute);
var ep_attribute = {
	name: 'c2',
	skin: '#fff',
	x: 300,
	y: 300,
	v: r,
	rad: Math.random()*Math.PI*2
}
var ep = new Person(ep_attribute);

//
function checkZ(){
	if(Math.abs(cp.x - ep.x) < 2*r && Math.abs(cp.y - ep.y) < 2*r){
		cp.vx = -cp.vx;
		ep.vx = -ep.vx;
		cp.vy = -cp.vy;
		ep.vy = -ep.vy;
	}
}

function drawBg(){
	ctx.beginPath();
	ctx.fillStyle = "rgba(0,0,0,0.05)";
	ctx.rect(0,0,canvas.width,canvas.height);
	ctx.fill();
	ctx.closePath();
}

var anime;
function loop(){
//	ctx.clearRect(0,0,canvas.width,canvas.height);
	anime = requestAnimFrame(loop);
	cp.move();
	ep.move();
	drawBg();
	checkZ();
}

function start(){
	loop();
	var t = setInterval(function(){
		window.cancelAnimationFrame(anime);
//		cp.rad = Math.random()*Math.PI*2;
//		ep.rad = Math.random()*Math.PI*2;
		loop();
	}, 1000)
}

start();