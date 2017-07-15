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

//0:地板，啥都不是。 1: 岩石，固定不动了。 2: 形状中的grid
function Category() {

}
Category.GROUND = 0;
Category.SOLID = 1;
Category.MOVE = 2;


//类别2 L1型
//类别3 L2型
//类别4 Z1型
//类别5 Z2型
//类别6 O型
//类别7 T型
function Type() {

}
Type.I = 0
Type.L1 = 1;
Type.L2 = 2;
Type.Z1 = 3;
Type.Z2 = 4;
Type.O = 5;
Type.T = 6;

Type.ALL = [];
Type.ALL[Type.I] = [0x4444, 0x0f00, 0x4444, 0x0f00];
Type.ALL[Type.L1] = [0x4460, 0x0740, 0x0622, 0x02e0];
Type.ALL[Type.L2] = [0x2260, 0x0470, 0x0644, 0x0e20];
Type.ALL[Type.Z1] = [0x0630, 0x0264, 0x0c60, 0x2640];
Type.ALL[Type.Z2] = [0x0360, 0x0462, 0x06c0, 0x4620];
Type.ALL[Type.O] = [0x0660, 0x0660, 0x0660, 0x0660];
Type.ALL[Type.T] = [0x04e0, 0x4640, 0x0720, 0x0262];


function Color() {

}
Color.ALL = ["", "orange", "olive", "cornflowerblue", "cyan", "red"];

//形状类
function Shape(game) {

	this.game = game;

	this.x = 0;
	this.y = 0;

	//类别。7种类别
	this.type = Type.I;

	//方向。4中方向 上右下左
	this.direction = Direction.UP;


	//一个16进制数，代表了4*4的格子中哪4个grid高亮。
	this.hex = 0xffff;

}


//往下面掉一格
Shape.prototype.dropOneStep = function () {


	if (this.y + 3 < HEIGH_NUM - 1) {

		this.hex = Type.ALL[this.type][this.direction];

		this.setCategory(Category.GROUND);


		this.y++;

		this.hex = Type.ALL[this.type][this.direction];
		this.setCategory(Category.MOVE);


		this.game.refreshStage();


	}


}

//往左移动一格
Shape.prototype.moveLeftOneStep = function () {

	var canMove = false;

	if (this.type == Type.I) {

		if (this.direction == Direction.UP || this.direction == Direction.DOWN) {

			if (this.x + 1 >= 1) {
				canMove = true;
			}

		} else {
			if (this.x >= 1) {
				canMove = true;
			}
		}

	}

	if (canMove) {
		this.hex = Type.ALL[this.type][this.direction];

		this.setCategory(Category.GROUND);

		this.x--;

		this.hex = Type.ALL[this.type][this.direction];
		this.setCategory(Category.MOVE);

		this.game.refreshStage();
	}
}

//上：改变方向
Shape.prototype.changeDirection = function () {


	this.hex = Type.ALL[this.type][this.direction];

	console.log("变形前：")
	this.setCategory(Category.GROUND);


	this.direction++;
	if (this.direction > Direction.LEFT) {
		this.direction = Direction.UP;
	}

	console.log("变形后：")
	this.hex = Type.ALL[this.type][this.direction];
	this.setCategory(Category.MOVE);


	this.game.refreshStage();


}
//往右移动一格
Shape.prototype.moveRightOneStep = function () {


	var canMove = false;

	if (this.type == Type.I) {

		if (this.direction == Direction.UP || this.direction == Direction.DOWN) {

			if (this.x + 1 < WIDTH_NUM - 1) {
				canMove = true;
			}

		} else {
			if (this.x + 3 < WIDTH_NUM - 1) {
				canMove = true;
			}
		}

	}


	if (canMove) {
		this.hex = Type.ALL[this.type][this.direction];

		this.setCategory(Category.GROUND);

		this.x++;

		this.hex = Type.ALL[this.type][this.direction];
		this.setCategory(Category.MOVE);


		this.game.refreshStage();
	}

}


//将当前的形状全部置为一种category
Shape.prototype.setCategory = function (cate) {

	// 0100 0100 0100 0100
	var binary = this.hex.toString(2);
	var whiteLen = 16 - binary.length;
	for (var n = 0; n < whiteLen; n++) {
		binary = "0" + binary;
	}


	var i = 0;
	for (var y0 = 0; y0 < 4; y0++) {

		for (var x0 = 0; x0 < 4; x0++) {

			var index = y0 * 4 + x0;

			var bit = binary.charAt(index);
			var x = this.x + x0;
			var y = this.y + y0;

			if (bit == '1') {

				var grids = this.game.grids;
				var grid = grids[x][y];
				grid.category = cate;

			}

		}

	}


}


//类别2 L1型
//类别3 L2型
//类别4 Z1型
//类别5 Z2型
//类别6 O型
//类别7 T型
Shape.prototype.refresh = function () {


}


//小方块类，构成舞台的最基本元素。
function Grid() {

	this.x = 0;
	this.y = 0;
	this.unit = 30;


	//0:地板，啥都不是。 1: 岩石，固定不动了。 2: 形状中的grid
	this.category = Category.GROUND;

	this.$dom = $("<span></span>");
}


Grid.prototype.refresh = function () {
	this.$dom.removeAttr("class");
	var color = Color.ALL[0];
	if (this.category == Category.SOLID) {
		color = Color.ALL[1];
	} else if (this.category == Category.MOVE) {
		color = Color.ALL[2];
	}
	this.$dom.addClass(color);

}

//游戏类，总控全局的。
function Game() {

	this.$stage = $(".stage");

	this.grids = [];

	this.width = WIDTH_NUM;
	this.height = HEIGH_NUM;

	//当前正在掉落的shape
	this.shape = null;

}

//打印出当前的grids，为了方便我们调试。
Game.prototype.printGrids = function () {
	console.log("------print grids------")
	for (var y = 0; y < HEIGH_NUM; y++) {

		var line = "";
		for (var x = 0; x < WIDTH_NUM; x++) {

			var grid = this.grids[x][y];
			line += grid.category;
		}
		console.log(line);
	}
	console.log("------finish print grids------")
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

			//将 grids 附着到 $stage上去 准备舞台
			grid.$dom.css({"left": (x * grid.unit) + "px", "top": (y * grid.unit) + "px"});
			this.$stage.append(grid.$dom);
		}

		this.grids.push(xArr)
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

//监听键盘点击事件
Game.prototype.listenEvent = function () {

	var that = this;

	$("body").keydown(function (e) {

		//上
		if (e.keyCode == 38) {
			that.shape.changeDirection();
		}
		//右
		else if (e.keyCode == 39) {
			that.shape.moveRightOneStep();
		}
		//下
		else if (e.keyCode == 40) {

		}
		//左
		else if (e.keyCode == 37) {
			that.shape.moveLeftOneStep();
		}
	})
}


Game.prototype.init = function () {

	this.listenEvent();

	this.fillGrids();

	this.refreshStage();

	this.shape = new Shape(this);
	this.shape.x = 0;
	this.shape.y = 0;
	this.shape.direction = Direction.UP;
	this.shape.type = Type.I;

	var that = this;

	setInterval(function () {

		that.shape.dropOneStep();

	}, 1000);

}


$(function () {

	var game = new Game();

	game.init();


});

