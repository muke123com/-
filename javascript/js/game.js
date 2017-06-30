//person类
function Person(obj){
	this.name = obj.name;
	this.skin = obj.skin;
	this.x = obj.x;
	this.y = obj.y;
	this.v = obj.v;
	this.rad = obj.rad;
}

Person.prototype.move = function(){
	this.x += this.v * Math.cos(this.rad);
	this.y += this.v * Math.sin(this.rad);
	document.querySelector("."+this.name).innerHTML = 
		'<h5>'+this.name+'</h5>'+
		'<p>'+this.x+';'+this.y+'</p>';
}

////chase
//function ChasePerson(obj){
//	Person.call(this, obj);
//}
//ChasePerson.prototype.chase = function(){
//	
//}
////escape
//function EscapePerson(obj){
//	Person.call(this, obj);
//}
var cp_attribute = {
	name: 'c1',
	skin: '#fff',
	x: 100,
	y: 100,
	v: Math.random()*2,
	rad: Math.random()*Math.PI*2
}
var cp = new Person(cp_attribute);
var ep_attribute = {
	name: 'c2',
	skin: '#000',
	x: 1,
	y: 1,
	v: Math.random()*2,
	rad: Math.random()*Math.PI*2
}
var ep = new Person(cp_attribute);

var anime;
function loop(){
	anime = requestAnimFrame(loop);
	cp.move();
}

function start(){
	loop();
	var t = setTimeout(function(){
		cp.rad = Math.random()*Math.PI*2;
	}, 1000)
}

start();