//随机函数 a,b为整数 [a,b].。
function random(a, b) {

	return a + Math.floor(Math.random() * (b - a + 1));
}

WIDTH_NUM = 13;
HEIGH_NUM = 20;
//每个小格子边长30px
UNIT = 30;

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
Type.ALL[Type.I] = [0x4444, 0x0f00, 0x4444, 0x0f00,
	[0, WIDTH_NUM - 2, HEIGH_NUM - 4, -1],
	[-1, WIDTH_NUM - 4, HEIGH_NUM - 2, 0],
	[0, WIDTH_NUM - 2, HEIGH_NUM - 4, -1],
	[-1, WIDTH_NUM - 4, HEIGH_NUM - 2, 0]
];
Type.ALL[Type.L1] = [0x4460, 0x0740, 0x0622, 0x02e0,
	[0, WIDTH_NUM - 3, HEIGH_NUM - 3, -1],
	[-1, WIDTH_NUM - 4, HEIGH_NUM - 3, -1],
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 4, -1],
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 3, 0]
];
Type.ALL[Type.L2] = [0x2260, 0x0470, 0x0644, 0x0e20,
	[0, WIDTH_NUM - 3, HEIGH_NUM - 3, -1],
	[-1, WIDTH_NUM - 4, HEIGH_NUM - 3, -1],
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 4, -1],
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 3, 0]
];
Type.ALL[Type.Z1] = [0x0630, 0x0264, 0x0630, 0x0264,
	[-1, WIDTH_NUM - 4, HEIGH_NUM - 3, -1],
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 4, -1],
	[-1, WIDTH_NUM - 4, HEIGH_NUM - 3, -1],
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 4, -1]
];
Type.ALL[Type.Z2] = [0x0360, 0x0462, 0x0360, 0x0462,
	[-1, WIDTH_NUM - 4, HEIGH_NUM - 3, -1],
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 4, -1],
	[-1, WIDTH_NUM - 4, HEIGH_NUM - 3, -1],
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 4, -1]
];
Type.ALL[Type.O] = [0x0660, 0x0660, 0x0660, 0x0660,
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 3, -1],
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 3, -1],
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 3, -1],
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 3, -1]
];
Type.ALL[Type.T] = [0x04e0, 0x4640, 0x0720, 0x0262,
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 3, 0],
	[0, WIDTH_NUM - 3, HEIGH_NUM - 3, -1],
	[-1, WIDTH_NUM - 4, HEIGH_NUM - 3, -1],
	[-1, WIDTH_NUM - 3, HEIGH_NUM - 4, -1]
];


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


}


Shape.prototype.newShape = function (x, y, direction) {
	var shape = new Shape(this.game);
	shape.x = x;
	shape.y = y;
	shape.type = this.type;
	shape.direction = direction;

	return shape;

}


//判断当前的shape是合法的吗？ 不超过边界，不和障碍物重叠。
Shape.prototype.isValid = function () {

	//首先判断是否越界。
	var edge = Type.ALL[this.type][4 + this.direction];

	if (this.x > edge[1]) {
		return false;
	} else if (this.y > edge[2]) {
		return false;
	} else if (this.x < edge[3]) {
		return false;
	}


	//考虑是否和现有的地板冲突。
	var grids = this.getGrids();

	for (var i = 0; i < grids.length; i++) {
		var grid = grids[i];
		if (grid.category == Category.SOLID) {
			return false;
		}
	}

	return true;

}


//往下面掉一格 能够继续掉落返回true,反之 返回 false.
Shape.prototype.dropOneStep = function () {


	var nextShape = this.newShape(this.x, this.y + 1, this.direction);

	if (nextShape.isValid()) {

		this.setCategory(Category.GROUND);
		this.y++;
		this.setCategory(Category.MOVE);

		this.game.refreshStage();

		return true;
	} else {

		this.setCategory(Category.SOLID);
		this.game.refreshStage();

		return false;
	}

}

//往左移动一格
Shape.prototype.moveLeftOneStep = function () {

	var nextShape = this.newShape(this.x - 1, this.y, this.direction);
	if (nextShape.isValid()) {

		this.setCategory(Category.GROUND);
		this.x--;
		this.setCategory(Category.MOVE);

		this.game.refreshStage();

		return true;

	} else {
		return false;
	}


}

//上：改变方向
Shape.prototype.changeDirection = function () {


	var newDirection = this.direction;
	newDirection++;
	if (newDirection > Direction.LEFT) {
		newDirection = Direction.UP;
	}


	var nextShape = this.newShape(this.x, this.y, newDirection);
	if (nextShape.isValid()) {

		this.setCategory(Category.GROUND);
		this.direction = newDirection;
		this.setCategory(Category.MOVE);

		this.game.refreshStage();

		return true;

	} else {
		return false;
	}


}
//往右移动一格
Shape.prototype.moveRightOneStep = function () {


	var nextShape = this.newShape(this.x + 1, this.y, this.direction);
	if (nextShape.isValid()) {

		this.setCategory(Category.GROUND);
		this.x++;
		this.setCategory(Category.MOVE);

		this.game.refreshStage();

		return true;

	} else {
		return false;
	}


}

//获取到当前shape所占用的grids. 四个grid. 有可能<4个，因为在上方舞台之外。
Shape.prototype.getGrids = function (platform) {

	if (!platform) {
		platform = this.game.grids;
	}

	var hex = Type.ALL[this.type][this.direction];

	// 0100 0100 0100 0100
	var binary = hex.toString(2);
	var whiteLen = 16 - binary.length;
	for (var n = 0; n < whiteLen; n++) {
		binary = "0" + binary;
	}

	var grids = [];

	for (var y0 = 0; y0 < 4; y0++) {

		for (var x0 = 0; x0 < 4; x0++) {

			var index = y0 * 4 + x0;

			var bit = binary.charAt(index);
			var x = this.x + x0;
			var y = this.y + y0;

			if (bit == '1' && y >= 0) {

				grids.push(platform[x][y]);

			}

		}

	}

	return grids;

}


//将当前的形状全部置为一种category
Shape.prototype.setCategory = function (cate) {
	var grids = this.getGrids();
	for (var i = 0; i < grids.length; i++) {
		var grid = grids[i];
		grid.category = cate;
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
	this.unit = UNIT;


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

	//下一个将要出现的shape
	this.previewShape = null;

	//预览盒子
	this.$box = $(".box");
	this.boxGrids = [];

	//得分
	this.score = 0;

	//掉落的时间 0表示最快。
	this.interval = 200;


	//时钟计时器
	this.intervalHandler = null;

}

//在dom中更新得分
Game.prototype.updateScore = function () {
	$(".score").html(this.score);

}

//判断游戏是否结束
Game.prototype.isGameOver = function () {


	var grids = this.shape.getGrids();
	return grids.length < 4;

}

//打印出当前的grids，为了方便我们调试。
Game.prototype.printGrids = function () {
	for (var y = 0; y < HEIGH_NUM; y++) {

		var line = "";
		for (var x = 0; x < WIDTH_NUM; x++) {

			var grid = this.grids[x][y];
			line += grid.category;
		}
	}
}


//将自身属性 grids 填充完毕
Game.prototype.fillGrids = function () {

	//装填舞台
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


	//装填预览盒子
	for (var x0 = 0; x0 < 4; x0++) {

		var xArray = [];

		for (var y0 = 0; y0 < 4; y0++) {
			var grid0 = new Grid();
			grid0.x = x0;
			grid0.y = y0;
			xArray.push(grid0);

			//将 grids 附着到 $stage上去 准备舞台
			grid0.$dom.css({"left": (x0 * grid0.unit) + "px", "top": (y0 * grid0.unit) + "px"});
			this.$box.append(grid0.$dom);
		}

		this.boxGrids.push(xArray)
	}


}

//清理舞台垃圾
Game.prototype.broomStage = function () {
	for (var x = 0; x < WIDTH_NUM; x++) {
		for (var y = 0; y < HEIGH_NUM; y++) {
			var grid = this.grids[x][y];
			grid.category = Category.GROUND;
			grid.refresh();
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


Game.prototype.bindTouchEvents = function () {

	var that = this;

	var body = document.getElementById('body');

	var startX = 0;
	var startY = 0;
	var moveX = 0;
	var moveY = 0;

	var lastX = 0;
	var lastY = 0;
	var lastStep = 0;

	var statTime = null;

	var isFastDrop = false;
	var isContinueDrop = false;
	var isMoving = false;

	body.addEventListener("touchstart", function (e) {

		var x = e.touches[0].pageX;
		var y = e.touches[0].pageY;

		console.log("touchstart x:" + x + " y:" + y);

		startX = x;
		lastX = x;
		startY = y;
		lastY = y;
		lastStep = 0;
		statTime = (new Date()).getTime();

		isMoving = false;
		isFastDrop = false;
		isContinueDrop = false;

	}, false);


	body.addEventListener("touchmove", function (e) {

		var x = e.touches[0].pageX;
		var y = e.touches[0].pageY;
		moveX = x;
		moveY = y;


		if (Math.abs(startX - x) > Math.abs(startY - y)) {

			//判断左右移动
			var step = 0;
			var i = 0;
			step = Math.floor((x - startX) / UNIT);
			if (step < 0) {
				step++;
			}

			//往右滑动了。
			var deltaStep = step - lastStep;
			if (deltaStep > 0) {
				for (i = 0; i < deltaStep; i++) {
					isMoving = true;
					that.shape.moveRightOneStep();
				}
			}
			//向左滑动了。
			else if (deltaStep < 0) {
				for (i = 0; i < -deltaStep; i++) {
					isMoving = true;
					that.shape.moveLeftOneStep();
				}
			}
			lastStep = step;

		} else {

			if (!isMoving) {
				var currentTime = new Date().getTime();

				if (currentTime - statTime > 50 && y - startY > UNIT) {
					console.log("isContinueDrop")
					//持续下降。
					isContinueDrop = true;
					that.interval = 30;

				} else {
					isContinueDrop = false;
					that.interval = 200
				}
			}

		}

		lastX = x;
		lastY = y;

	}, false);
	body.addEventListener("touchend", function (e) {

		//无论如何一旦手指离开，结束持续下降。
		isContinueDrop = false;
		that.interval = 200;


		var currentTime = new Date().getTime();
		//判断是否为快速下降。
		if (!isMoving) {

			//时间又短又快，我们认为是快速下降。
			console.log("moveY - startY");
			console.log(moveY - startY);
			if (moveY - startY > UNIT * 2 && currentTime - statTime < 200) {
				console.log("isFastDrop")
				that.interval = 0;
				isFastDrop = true;

			} else {

				//非常短暂的时间我们认为是点击。

				if (currentTime - statTime < 200) {
					that.shape.changeDirection();
				}
			}

		}


		console.log("touchend");
	}, false);

};


//监听键盘点击事件
Game.prototype.bindKeyEvent = function () {

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
			that.interval = 0;
		}
		//左
		else if (e.keyCode == 37) {
			that.shape.moveLeftOneStep();
		}
	})

	$(".restart").click(function () {

		that.start();
		console.log("重新开始。");
	});
}

//消除第y这一行，如果能消除返回true，不能消除返回false.
Game.prototype.eliminateOneLine = function (y) {

	//判断能不能消除。
	for (var x = 0; x <= WIDTH_NUM - 1; x++) {
		var grid = this.grids[x][y];
		if (grid.category != Category.SOLID) {
			return false;
		}
	}

	//这一行表示能够消除。
	for (var y0 = y; y0 >= 0; y0--) {

		for (var x0 = 0; x0 <= WIDTH_NUM - 1; x0++) {

			if (y0 == 0) {
				this.grids[x0][y0].category = Category.GROUND;
			} else {
				this.grids[x0][y0].category = this.grids[x0][y0 - 1].category;
			}

		}
	}


	return true;

}

Game.prototype.eliminateLines = function () {

	var lines = 0;
	for (var y = HEIGH_NUM - 1; y >= 0; y--) {


		while (this.eliminateOneLine(y)) {

			lines++;

		}
	}

	if (lines == 1) {
		this.score += 100;
	} else if (lines == 2) {
		this.score += 300;
	} else if (lines == 3) {
		this.score += 500;
	} else if (lines == 4) {
		this.score += 1000;
	}
	this.updateScore();


	//速度设置为正常
	this.interval = 200;
}


Game.prototype.refreshBox = function () {

	//第一步，更新previewShape
	if (!this.previewShape) {
		this.previewShape = new Shape(this);
		this.previewShape.x = 0;
		this.previewShape.y = 0;
	}

	this.previewShape.direction = random(0, 3);
	this.previewShape.type = random(0, 6);

	//第二步更新grid的数据 和更新UI.
	for (var x = 0; x < 4; x++) {
		for (var y = 0; y < 4; y++) {
			var grid = this.boxGrids[x][y];
			grid.category = Category.GROUND
			grid.refresh();
		}
	}

	var grids = this.previewShape.getGrids(this.boxGrids);
	for (var m = 0; m < grids.length; m++) {
		grids[m].category = Category.SOLID;
		grids[m].refresh();
	}


}


Game.prototype.refreshShape = function () {

	if (!this.shape) {
		this.shape = new Shape(this);
	}

	this.shape.x = 5;
	this.shape.y = -4;
	this.shape.direction = this.previewShape.direction;
	this.shape.type = this.previewShape.type;
}

//开始或者重新开始。
Game.prototype.start = function () {

	var that = this;

	if (that.intervalHandler) {
		clearInterval(that.intervalHandler)
	}


	//预览框刷新
	this.refreshBox();
	//正在掉落的形状刷新。
	this.refreshShape();
	//记分版清零
	this.score = 0;
	this.updateScore();

	//舞台垃圾清理
	this.broomStage();


	var temp = 0;

	function intervalFunc() {
		if (temp > that.interval) {

			temp = 0;

			var canDrop = that.shape.dropOneStep();

			if (!canDrop) {

				if (that.isGameOver()) {


					console.info("游戏结束啦！");

					if (that.intervalHandler) {
						clearInterval(that.intervalHandler)
					} else {
						console.error("intervalHandler 出错啦。")
					}

				} else {
					//开始消除。
					that.eliminateLines();

					that.refreshShape();
					that.refreshBox();

				}

			}
		} else {
			temp += 10;
		}

	}

	this.intervalHandler = setInterval(intervalFunc, 10);


}

Game.prototype.init = function () {

	var that = this;
	this.bindKeyEvent();
	this.bindTouchEvents();

	this.fillGrids();


	this.start();
}


$(function () {

	var game = new Game();

	game.init();


});

