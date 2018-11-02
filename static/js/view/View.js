import Index from './components/Index.js';
import Board from './components/Board.js';
import Board_Notification from './components/Board_Notification.js';
import Lobby from './components/Lobby.js';
import Chat from './components/Chat.js';
import Player from './components/Player.js';

class View{
	constructor(){
		this.index = {};
		this.board = {};
		this.boardNotification = {};
		this.lobby = {};
		this.chat = {};
		this.player = {};
		this._init();
	}

	_init(){
		this.index = new Index();
		this.board = new Board();
		this.boardNotification = new Board_Notification();
		this.lobby = new Lobby();
		this.chat = new Chat();
		this.player = new Player();
	}

	launchApp(name){
		this.index.launchApp();
		document.getElementById('user-name').textContent = name;
	}

	userNameTaken(){
		this.index.userNameTaken();
	}


	////////////////////////	Chat Functions

	cleanChatInput(){
		this.chat.cleanChatInput();
	}

	addChatMessage(chatName, userName, message){
		this.chat.addMessage(chatName, userName, message);
	}

	addChatNotification(message, option){
		this.chat.addNotification(message, option);
	}

	receiveErrorGameRequest(errorType, enemyName){
		let message;
		switch(errorType){
			case 'cancel':
				message = enemyName + ' cancel his game invitation...';
				break;
			case 'decline':
				message = enemyName + ' decline your game invitation...';
				break;
			case 'is_in_game':
				message = enemyName + ' is already in a game.';
				break;
			case 'is_in_game_request':
				message = enemyName + ' is already in a game invitation.';
				break;
			case 'enemy_disconnect':
				message = enemyName + ' has been disconnected...';
				break;
		}
		this.chat.addNotification(message, {chatName:'lobby-message', isBold:true});
	}






	////////////////////////	Lobby Functions

	waitForConfirmation(){
		this.lobby.waitForConfirmation();
	}

	receiveGameRequest(enemyName){
		let message = enemyName + ' send you a game invitation!';
		this.chat.addNotification(message, {chatName:'lobby-message', isBold:true});
		this.lobby.receiveGameRequest(enemyName);
	}

	receiveAcceptGameRequest(enemyName){
		this.lobby.removeLobby();
		this.chat.setChatContainer('game', enemyName);
		this.chat.addNotification('Game started!', {chatName:'game-message', isBold:true});
		this.addBoardNotification('wait_for_color_choice', enemyName);
	}

	receiveConfirmGameRequest(enemyName){
		this.lobby.removeLobby();
		this.chat.setChatContainer('game', enemyName);
		this.chat.addNotification('Game started!', {chatName:'game-message', isBold:true});
		this.addBoardNotification('choice_of_color');
	}

	refreshListUser(listUser){
		this.lobby.refreshListUser(listUser);
	}

	removeGameRequest(){
		this.lobby.removeGameRequest();
	}

	getEnemySelected(){
		return this.lobby.getEnemySelected();
	}





	////////////////////////	Game Functions

	startGame(user, enemy, playFirst){
		this.board.setPlayerColor(user.color);
		this.showPlayerContainer(user, enemy, playFirst);
		this.board.setIsPlaying(playFirst);
		if(playFirst){
			this.board.addCellsEvent();
		}
	}

	showPlayerContainer(user, enemy, playFirst){
		this.player.setPlayer('player-user', user.name, user.color, playFirst);
		this.player.setPlayer('player-enemy', enemy.name, enemy.color, !playFirst);
		this.player.showPlayerContainer(true);
	}

	startOfTurn(hasPassed=false){
		this.player.setIsPlaying('player-user', true);
		this.player.setIsPlaying('player-enemy', false);
		this.board.setIsPlaying(true);
		this.board.hideHoverCells();
		this.board.addCellsEvent();
		if(!hasPassed){
			this.player.addTokenCounter('player-enemy');
		}
	}

	endOfTurn(hasPassed=false){
		this.player.setIsPlaying('player-user', false);
		this.player.setIsPlaying('player-enemy', true);
		this.board.setIsPlaying(false);
		this.board.removeCellsEvent();
		if(!hasPassed){
			this.player.addTokenCounter('player-user');
		}
	}

	updateBoard(i, j, color, changes){
		return new Promise((resolve) => {
			this.board.addToken(i,j, color);
			this.board.updateBoard(changes);
			resolve();
		});
	}

	showHoverCell(i, j, color){
		this.board.showHoverCell(i, j, color);
	}

	setNewBoard(board){
		this.board.setNewBoard(board);
	}

	addTokenCounter(playerID){
		this.player.addTokenCounter(playerID);
	}

	endOfGame(user, enemy){
		this.player.togglePassButton(false);
		this.player.setPassBtnText('You have passed!');
		this.chat.addNotification('Game Finished!', {chatName:'game-message', isBold:true});
		this.boardNotification.addFinishedGameNotification(user, enemy);
	}

	userHasPassed(){
		this.boardNotification.show(false);
		this.player.setPassBtnText('You have passed');
		this.chat.addNotification('You have passed...', {chatName:'game-message', isBold:true});
	}

	receiveEnemyPass(enemyName){
		this.player.setEnemyPassed(true);
		this.addBoardNotification('enemy_passed', enemyName);

		let message = enemyName + ' has passed!';
		this.chat.addNotification(message, {chatName:'game-message', isBold:true});

	}

	cleanGame(){
		this.player.resetPlayerContainer();

		this.chat.cleanChatInput();
		this.chat.cleanGameChatMessage();
		this.chat.setChatContainer('lobby', 'Lobby');

		this.boardNotification.resetBoardNotification();

		this.board.resetBoard();

		this.lobby.showLobby();
	}




	////////////////////////	Board Notification Functions

	addBoardNotification(notification_type, enemyName=''){
		let message;
		switch(notification_type){
			case 'choice_of_color':
				message = 'Choose your color!';
				this.boardNotification.addBoardNotification(message, {action:'stop', button_display:'white-black', permanent:true});
				break;
			case 'wait_for_color_choice':
				message = enemyName + ' choose his color...';
				this.boardNotification.addBoardNotification(message, {action:'move', button_display:'none', permanent:true});
				break;
			case 'user_pass_confirmation':
				message = 'Are you sure you want to pass ?';
				this.boardNotification.addBoardNotification(message, {action:'stop', button_display:'confirm-cancel', permanent:true});
				break;
			case 'enemy_passed':
				message = enemyName + ' has passed!';
				this.boardNotification.addBoardNotification(message, {action:'move', button_display:'none', permanent:false});
				break;
			case 'error_surrounded':
				message = 'This move is not very smart...';
				this.boardNotification.addBoardNotification(message, {action:'move', button_display:'none', permanent:false});
				break;
			case 'error_same_board':
				message = 'The board will be the same as before...';
				this.boardNotification.addBoardNotification(message, {action: 'move', button_display:'none', permanent:false});
				break;
			case 'end_of_game':
				message = 'Game Finished!';
				this.boardNotification.addBoardNotification(message, {action:'stop', button_display:'none', permanent:true});
		}
	}

	removeBoardNotification(){
		this.boardNotification.show(false);
	}


}

export default View;
