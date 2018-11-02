import BoardModel from './BoardModel.js';

class Model{

	constructor(){
		this.boardModel = {};

		this._init();
	}

	_init(){
		this.boardModel = new BoardModel();
	};

	initBoard(){
		this.boardModel.initBoard();
	}

	getBoardStringify(){
		return this.boardModel.getBoardStringify();
	}

	setNewBoard(newBoard){
		this.boardModel.setNewBoard(newBoard);
	}

	checkToken(i,j){
		return new Promise((resolve, reject) => {
			if(this.boardModel.checkToken(i, j)){
				resolve();
			}else{
				reject('');
			}
		});
	}

	addToken(i,j, color){
		return new Promise((resolve) => {
			this.boardModel.addToken(i,j, color);
			resolve();
		});
	}

	updateBoard(i,j){
		return new Promise((resolve, reject) => {
			let changes = this.boardModel.checkTerritory(i,j);
			if(changes){
				resolve(changes);
			}else{
				reject('error_same_board');
			}
		});
	}

	getScore(color){
		return this.boardModel.countScore(color);
	}

	resetBoard(){
		this.boardModel.resetBoard();
	}


}

export default Model;
