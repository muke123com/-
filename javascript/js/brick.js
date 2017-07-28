window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        }
})();
var game;

var Board = function(json, width, height){
	this.width = 100;
	this.height = 20;
	this.x = width/2 - this.width/2;
	this.y = height - this.height;
	this.vx = 0;
	this.ax = 0; //加速度
	this.init(json);
}

Board.prototype.init = function(json){
	for(var i in json){
		this[i] = json[i];
	}
}

Board.prototype.moveLeft = function(){
	this.ax = -0.1;
}

Board.prototype.moveRight = function(){
	this.ax = 0.1;
}

Board.prototype.stopMove = function(){
	this.vx = 0;
	this.ax = 0;
}

Board.prototype.update = function(width){
	this.vx += this.ax;
	//最大移动速度
	if(this.vx >= 5){
		this.vx = 5;
	}
	if(this.vx <= -5){
		this.vx = -5;
	}
	this.x += this.vx;
	//边界限制
	if(this.x < 1){
		this.vx = 0;
		this.ax = 0;
		this.x = 1;
	}
	if(this.x > width - this.width - 1){
		this.vx = 0;
		this.ax = 0;
		this.x = width - this.width - 1;
	}
}

//球
var Ball = function(){
	this.x = 50;
	this.y = 100;
	this.r = 10;
	this.vx = 2;
	this.vy = 2;
	this.color = "#fff";
	this.fail = false; 
}
Ball.prototype.update = function(board, width, height){
	this.x += this.vx;
	this.y += this.vy;
	if(this.x < this.r || this.x > width - this.r){
		this.vx = -this.vx;
	}
	if(this.y < this.r){
		this.vy = -this.vy;
	}
	if(this.y > height){
		this.fail = true;
	}
	//触碰滑板
	if(this.x > board.x && this.x < board.x + board.width && this.y > board.y - this.r){
		this.vy = -this.vy;
		this.vx += board.vx*0.1; 
	}
}
//砖
var Brick = function(){
	this.x = 0;
	this.y = 0;
	this.width = 100;
	this.height = 20;
	this.color = "#fff";
}
Brick.prototype.broken = function(ball){
	if(ball.x + ball.r > this.x && ball.y - ball.r < this.y){
		
	}
}

var Game = function(){
	this.score = 0;
	this.canvas = document.getElementById("game");
	this.ctx = this.canvas.getContext("2d");
	this.width = this.canvas.width;
	this.height = this.canvas.height;
	this.board = new Board({}, this.width, this.height);
	this.ball = new Ball();
	this.maxScore = 0;
}

Game.prototype.start = function(){
	this.score = 0;
	var _this = this;
	document.onkeydown = function(e){
		switch(e.code){
			case 'KeyA':
				_this.board.moveLeft()
				break;
			case 'KeyD':
				_this.board.moveRight()
				break;
		}
	}
	document.onkeyup = function(e){
		_this.board.stopMove();
	}
}

Game.prototype.display = function(){
	this.ctx.clearRect(0,0,this.width,this.height);
	//板
	this.ctx.beginPath();
	this.ctx.strokeStyle = "#fff";
	this.ctx.rect(this.board.x, this.board.y, this.board.width, this.board.height);
	this.ctx.stroke();
	this.ctx.closePath();
	this.board.update(this.width);
	//球
	this.ctx.beginPath();
	this.ctx.fillStyle = this.ball.color;
	this.ctx.arc(this.ball.x, this.ball.y, this.ball.r, 0, Math.PI*2);
	this.ctx.fill();
	this.ctx.closePath();
	this.ball.update(this.board, this.width, this.height);
	var _this = this;
	requestAnimationFrame(function(){
		_this.display();
	});
}

window.onload = function(){
	var start = function(){
		game = new Game();
		game.start();
//		game.update();
		game.display();
	}
	
	start();
}
