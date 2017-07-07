//随机函数 a,b为整数 [a,b]
function random(a, b) {

	return a + Math.floor(Math.random() * (b - a + 1));
}

WIDTH_NUM = 13;
HEIGH_NUM = 20;

function Direction() {
}
Direction.UP = 0;
Direction.RIGHT = 1;
Direction.DOWN = 2;
Direction.LEFT = 3;

//形状类
function Shape(game) {

	this.game = game;

	this.x = 0;
	this.y = 0;

	//类别。7种类别
	this.type = 0;

	//方向。4中方向 上右下左
	this.direction = Direction.UP;

	//颜色
	this.color = 0;

	this.coords = [];

}


//将当前的形状全部置为一种category
Shape.prototype.setCategory = function (cate) {

	//把之前的shap占用的grid全部置为category=0;
	for (var i = 0; i < this.coords.length; i++) {
		var coord = this.coords[i];
		var x = coord[0];
		var y = coord[1];
		var grid = this.game.grids[x][y];
		grid.category = cate;

		if (cate == 0) {
			grid.color = 0;
		}

	}

}


//往下面掉一格
Shape.prototype.dropOneStep = function () {

	this.setCategory(0);

	this.y++;

	if (this.y == 20) {
		this.y = 19;
	}

	this.setCategory(2);

}

//类别2 L1型
//类别3 L2型
//类别4 Z1型
//类别5 Z2型
//类别6 O型
//类别7 T型
Shape.prototype.refreshCoords = function () {

	//类别1 长条形
	if (this.type == 0) {

		//上下方向
		if (this.direction == Direction.UP || this.direction == Direction.DOWN) {

			if (this.y + 2 < HEIGH_NUM) {
				this.coords = [];
				this.coords.push([this.x, this.y - 1]);
				this.coords.push([this.x, this.y]);
				this.coords.push([this.x, this.y + 1]);
				this.coords.push([this.x, this.y + 2]);
			}

		} else if (this.direction == Direction.LEFT || this.direction == Direction.RIGHT) {

			if (this.x - 1 >= 0 && this.x + 2 < WIDTH_NUM) {
				this.coords = [];
				this.coords.push([this.x - 1, this.y]);
				this.coords.push([this.x, this.y]);
				this.coords.push([this.x + 1, this.y]);
				this.coords.push([this.x + 2, this.y]);
			}

		}


	}

}

Shape.prototype.refresh = function () {


	for (var i = 0; i < this.coords.length; i++) {

		var coord = this.coords[i];
		var x = coord[0];
		var y = coord[1];


		var grids = this.game.grids;

		var grid = grids[x][y];


		grid.color = this.color;


	}

	this.game.refreshStage();

}


//小方块类，构成舞台的最基本元素。
function Grid() {

	this.x = 0;
	this.y = 0;
	this.unit = 30;

	this.color = 0;

	//0:地板，啥都不是。 1: 岩石，固定不动了。 2: 形状中的grid
	this.category = 0;

	this.$dom = $("<span></span>");
}

Grid.colors = ["", "orange", "olive", "cornflowerblue", "cyan", "red"];

Grid.prototype.refresh = function () {
	this.$dom.removeAttr("class");
	this.$dom.addClass(Grid.colors[this.color]);
}

//游戏类，总控全局的。
function Game() {

	this.$stage = $(".stage");

	this.grids = [];

	this.width = WIDTH_NUM;
	this.height = HEIGH_NUM;

}


//将自身属性 grids 填充完毕
Game.prototype.fillGrids = function () {
	for (var x = 0; x < WIDTH_NUM; x++) {

		var xArr = [];

		for (var y = 0; y < HEIGH_NUM; y++) {
			var grid = new Grid();
			grid.x = x;
			grid.y = y;

			xArr.push(grid);
		}

		this.grids.push(xArr)
	}

}


//将 grids 附着到 $stage上去 准备舞台
Game.prototype.prepareStage = function () {


	for (var x = 0; x < WIDTH_NUM; x++) {
		for (var y = 0; y < HEIGH_NUM; y++) {
			var grid = this.grids[x][y];

			grid.$dom.css({"left": (x * grid.unit) + "px", "top": (y * grid.unit) + "px"});

			this.$stage.append(grid.$dom);
		}

	}

}

//刷新画布上的颜色
Game.prototype.refreshStage = function () {

	for (var x = 0; x < WIDTH_NUM; x++) {
		for (var y = 0; y < HEIGH_NUM; y++) {
			var grid = this.grids[x][y];
			grid.refresh();
		}

	}


}


Game.prototype.init = function () {

	this.fillGrids();

	this.prepareStage();

	this.refreshStage();
}


$(function () {

	var game = new Game();

	game.init();

	var shape = new Shape(game);
	shape.x = 5;
	shape.y = 5;
	shape.color = 1;
	shape.direction = Direction.UP;
	shape.type = 0;


	setInterval(function () {

		shape.dropOneStep();

		shape.refreshCoords();
		shape.refresh();
	}, 1000);


});

