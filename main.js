function Game() {

	this.$stage = $(".stage");

	this.$grids = [];

	this.width = 13;
	this.height = 20;

}


//将自身属性 $grids 填充完毕
Game.prototype.fillGrids = function () {
	for (var row = 0; row < this.height; row++) {

		var $tempRow = [];

		for (var column = 0; column < this.width; column++) {
			var $grid = $("<span class='grid'></span>");
			$tempRow.push($grid);
		}

		this.$grids.push($tempRow)
	}

}


//将 $grids 附着到 $stage上去 准备舞台
Game.prototype.prepareStage = function () {

	for (var row = 0; row < this.height; row++) {
		for (var col = 0; col < this.width; col++) {

			this.$stage.append(this.$grids[row][col]);

		}
	}

}


Game.prototype.init = function () {

	this.fillGrids();

	this.prepareStage();


}


$(function () {

	var game = new Game();

	game.init();

});

