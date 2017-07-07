//随机函数 a,b为整数 [a,b]
function random(a, b) {

	return a + Math.floor(Math.random() * (b - a + 1));
}


//形状类
function Shape() {

	this.x = 0;
	this.y = 0;

	//类别。
	this.type = 0;

	//颜色
	this.color = 0;

}


//小方块类，构成舞台的最基本元素。
function Grid() {

	this.x = 0;
	this.y = 0;
	this.color = 0;

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

	this.width = 13;
	this.height = 20;

}


//将自身属性 grids 填充完毕
Game.prototype.fillGrids = function () {
	for (var row = 0; row < this.height; row++) {

		var tempRow = [];

		for (var column = 0; column < this.width; column++) {
			var grid = new Grid();

			//grid.color = random(0, Grid.colors.length - 1);

			tempRow.push(grid);
		}

		this.grids.push(tempRow)
	}

}


//将 grids 附着到 $stage上去 准备舞台
Game.prototype.prepareStage = function () {

	for (var row = 0; row < this.height; row++) {
		for (var col = 0; col < this.width; col++) {

			var grid = this.grids[row][col];
			this.$stage.append(grid.$dom);

		}
	}
}

//刷新画布上的颜色
Game.prototype.refreshStage = function () {

	for (var row = 0; row < this.height; row++) {
		for (var col = 0; col < this.width; col++) {

			var grid = this.grids[row][col];
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

});

