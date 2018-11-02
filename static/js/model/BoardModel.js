class BoardModel{
	constructor(){
		this._init();
}

	_init(){
		this.board = [];
		this.previousBoard = [];
		this.secondPreviousBoard = [];
	}

	initBoard(){
		for(let i = 0 ; i<19 ; i++){
			this.board[i] = [];
			for(let j = 0 ; j<19 ; j++){
				this.board[i][j] = 'empty';
			}
		}
		this.previousBoard = this.board.copy();
		this.secondPreviousBoard = this.board.copy();
	}

	getBoardStringify(){
		return JSON.stringify(this.board);
	}

	setNewBoard(newBoard){
		this.secondPreviousBoard = this.previousBoard.copy();
		this.board = newBoard.copy();
		this.previousBoard = this.board.copy();
	}

	resetBoard(){
		this.board = [];
		this.previousBoard = [];
		this.secondPreviousBoard = [];
	}

	getOppositeColor(color){
		let oppositeColor = (color === 'white') ? 'black' : 'white';
		return oppositeColor;
	}

	checkToken(i, j){
		return (this.board[i][j] === 'empty');
	}

	addToken(i,j,color){
		this.board[i][j] = color;
	}

	checkTerritory(i,j){
		let color = this.board[i][j];
		let colorEnemy = this.getOppositeColor(color);
		let neighbors = this.getNeighbors(i,j);

		//Add the current cell
		neighbors = neighbors.concat([{i:i,j:j,color:color}]);

		// Get the chains neighbors
		let chains = [];
		neighbors.filter(n => n.color !== 'empty').forEach(neighbor => {
			chains.push(this.getChain(neighbor.i, neighbor.j, []));
		});

		//Sort the chains therefore the enemy chains are tested first
		chains.sort((a,b) => {
			if(a[0].color === colorEnemy && b[0].color === colorEnemy){ return 0; }
			if(a[0].color === colorEnemy && b[0].color !== colorEnemy){ return -1; }
			if(a[0].color !== colorEnemy && b[0].color === colorEnemy){ return 1; }
		});

		// Test if these chains are free
		let tempBoard = this.board.copy();
		let changes = [];
		chains.forEach(chain => {
			if(!chain.some(cell => this.isFree(cell.i, cell.j, tempBoard))){
				//Change the temp board
				chain.forEach(e => {
					tempBoard[e.i][e.j] = 'empty';
					changes.push(e);
				});
			}
		});

		if(!tempBoard.equals(this.secondPreviousBoard)){
			this.secondPreviousBoard = this.previousBoard.copy();
			this.board = tempBoard.copy();
			this.previousBoard = this.board.copy();
			return changes;
		}else{
			this.board = this.previousBoard.copy();
			return false;
		}
	}

	getChain(i,j, chain){
		let color = this.board[i][j];
		let neighbors = this.getNeighbors(i,j);

		chain.push({'i':i,'j':j, 'color': this.board[i][j]});
		neighbors.filter(n => n.color === color).forEach(neighbor => {
			if(!chain.some(e => (e.i === neighbor.i && e.j === neighbor.j))){
				chain.concat(this.getChain(neighbor.i, neighbor.j, chain));
			}
		});
		return chain;
	}

	getNeighbors(i,j){
		let neighbors = [];
		if(i < 18){
			let bottom = {
				'i':i+1,
				'j': j,
				'color': this.board[i+1][j]
			};
			neighbors.push(bottom);
		}
		if(i !== 0){
			let top = {
				'i':i-1,
				'j': j,
				'color': this.board[i-1][j]
			};
			neighbors.push(top);
		}
		if(j < 18){
			let right = {
				'i':i,
				'j': j+1,
				'color': this.board[i][j+1]
			};
			neighbors.push(right);
		}
		if(j !== 0){
			let left = {
				'i':i,
				'j': j-1,
				'color': this.board[i][j-1]
			};
			neighbors.push(left);
		}
		return neighbors;
	}

	isFree(i,j, board){
		if(i < 18){
			if(board[(i+1)][j] === 'empty'){ return true; }
		}
		if(i !== 0){
			if(board[(i-1)][j] === 'empty'){ return true; }
		}
		if(j < 18){
			if(board[i][(j+1)] === 'empty'){ return true; }
		}
		if(j !== 0){
			if(board[i][(j-1)] === 'empty'){ return true; }
		}
		return false;
	}

	countScore(color){
		let cells = this.getCellsByColor(color);
		let score = cells.length;

		let territories = [];
		cells.forEach(cell => {
			let neighbors = this.getNeighbors(cell.i, cell.j);
			neighbors.filter(n => n.color === 'empty').forEach(neighbor => {
				territories.push(this.getTerritory(neighbor.i, neighbor.j, color, []));
			});
		});

		// Remove the error
		territories = territories.filter(territory => !territory.some(e => e.error));

		// Sort territories
		territories.forEach(territory => {
			territory.sort((a,b) => {
				if((a.i < b.i) || (a.i === b.i && a.j < b.j)){ return -1; }
				if((a.i > b.i) || (a.i === b.i && a.j > b.j)){ return 1; }
			});
		});

		// Remove duplicate territories
		territories = territories.filter((territory, index, array) => {
			let territories_stringify = array.map(e => JSON.stringify(e));
			return (territories_stringify.indexOf(JSON.stringify(territory)) === index);
		});

		// Add every territories to the score
		territories.forEach(territory => {
			score += territory.length;
		});

		return score;
	}

	getTerritory(i, j, color, territory){
		let enemyColor = this.getOppositeColor(color);
		let neighbors = this.getNeighbors(i,j);

		if(neighbors.some(neighbor => neighbor.color === enemyColor)){
			territory.push({error: true});
		}else{
			territory.push({i:i, j:j});
			neighbors.filter(n => n.color === 'empty').forEach(neighbor => {
				if(!territory.some(e => (e.i === neighbor.i && e.j === neighbor.j))){
					territory.concat(this.getTerritory(neighbor.i, neighbor.j, color, territory));
				}
			});
		}
		return territory;
	}

	getCellsByColor(color){
		let cells = [];
		for(let i=0 ; i<19 ; i++){
			for(let j = 0 ; j<19 ; j++){
				if(this.board[i][j] === color){
					cells.push({i:i, j:j, color:color});
				}
			}
		}
		return cells;
	}
}

export default BoardModel;
