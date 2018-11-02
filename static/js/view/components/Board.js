class Board{

	constructor(){
		this.board = {};

		this._init();
	}

	_init(){

		this.board = document.getElementById('board-container');
		this._initBoardGame();

	}

	_initBoardGame(){
		this.board.setAttribute('player', '');
		for(let i = 0 ; i<19 ; i++){
			let row = document.createElement('div');
			row.classList.add('board-row');
			for(let j=0 ; j<19 ; j++){
				let cell = document.createElement('div')
				cell.classList.add('cell');
				cell.classList.add('empty');
				cell.id = 'cell-'+i+'-'+j;
				cell.setAttribute('i', i);
				cell.setAttribute('j', j);
				row.appendChild(cell);
			}
			this.board.appendChild(row);
		}
	}

	_addToken(e){
		let cell = e.target;
		let i = parseInt(cell.getAttribute('i'));
		let j = parseInt(cell.getAttribute('j'));
		controller.addToken(i,j);
	}

	_hoverCell(e){
		let cell = e.target;
		let i = parseInt(cell.getAttribute('i'));
		let j = parseInt(cell.getAttribute('j'));
		controller.hoverCell(i,j);
	}

	addToken(i,j, color){
		let cell = document.getElementById('cell-'+i+'-'+j);
		cell.classList.remove('empty');
		cell.classList.add(color);
	}

	updateBoard(changes){
		let i = 0;
		changes.forEach(change => {
			setTimeout(() => {
				let cell = document.getElementById('cell-'+change.i+'-'+change.j);
				cell.classList.remove('white');
				cell.classList.remove('black');
				cell.classList.add('empty');
			}, i);
			i += 50;
		})
	}

	showHoverCell(i, j, color){
		this.hideHoverCells();
		let cell = document.getElementById('cell-'+i+'-'+j);
		cell.classList.add('hover');
		cell.setAttribute('hover_color', color);
	}

	hideHoverCells(){
		for(let cell of document.getElementsByClassName('hover')){
			cell.classList.remove('hover');
			cell.setAttribute('hover_color', '');
		}
	}

	addCellsEvent(){
		let cells = document.getElementsByClassName('cell empty');
		for(let cell of cells){
			cell.addEventListener('click', this._addToken);
			cell.addEventListener('mouseover', this._hoverCell);
		}
	}

	removeCellsEvent(){
		let cells = document.getElementsByClassName('cell');
		for(let cell of cells){
			cell.removeEventListener('click', this._addToken);
			cell.removeEventListener('mouseover', this._hoverCell);
		}
	}

	setPlayerColor(color){
		this.board.setAttribute('player', color);
	}

	setIsPlaying(isPlaying){
		this.board.setAttribute('isPlaying', isPlaying.toString());
	}

	setNewBoard(board){
		for(let i = 0 ; i < 19 ; i++){
			for(let j=0 ; j < 19 ; j++){
				let cell = document.getElementById('cell-'+i+'-'+j);
				cell.classList.remove('empty');
				cell.classList.remove('black');
				cell.classList.remove('white');
				cell.classList.add(board[i][j]);
			}
		}
	}

	resetBoard(){
		this.setPlayerColor('');
		this.setIsPlaying(false);

		for(let i = 0 ; i < 19 ; i++){
			for(let j = 0 ; j < 19 ; j++){
				let cell = document.getElementById('cell-'+i+'-'+j);
				cell.classList.remove('black');
				cell.classList.remove('white');
				cell.classList.add('empty');
				cell.removeEventListener('click', this._addToken);
			}
		}
	}
}

export default Board;
