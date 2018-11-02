import Kommunicator from './Kommunicator.js';
import Model from '../model/Model.js';
import View from '../view/View.js';
import './Utils.js';

class Controller{

	constructor(){
		this.kommunicator = {};
		this.model = {};
		this.view = {};
		this.user = {};
		this.enemy = {};

		this._init();
	}

	_init(){
		this._initKommunicator()
			.then(() => { this._initModel(); })
			.then(() => { this._initView(); })

			this.user = {
				name:'',
				color: '',
				hasPassed: false
			};
			this.enemy = {
				name:'',
				id: '',
				color: '',
				hasPassed: false
			};

			this.isInGame = false;
			this.isInGameRequest = false;
	}

	_initKommunicator(){
		return new Promise((resolve) => {
			this.kommunicator = new Kommunicator();
			resolve();
		})
	}

	_initModel(){
		return new Promise((resolve) => {
			this.model = new Model();
			resolve();
		});
	}

	_initView(){
		return new Promise((resolve) => {
			this.view = new View();
			resolve();
		})
	}

///////////////////////

	chooseName(event){
		if(event.keyCode === 13){ //value enter
			let name = event.target.value;
			if(name !== ""){
				this.user.name = name;
				this.kommunicator.initKommunicatorSocket(this.user.name);
			}
		}
	}

	launchApp(){
		this.view.launchApp(this.user.name);
	}

	userNameTaken(){
		this.view.userNameTaken();
	}

	getOppositeColor(color){
		let oppositeColor = (color === 'white') ? 'black' : 'white';
		return oppositeColor;
	}




	///////////////// Kommunicator function //////////////////


	//////////////////	Chat Functions	//////////////////

	sendMessage(message){
		if(this.isInGame){
			this.view.addChatMessage('game-message', this.user.name, message);
			let option = {destinationChannel:this.enemy.id, type:'game_chat_msg'};
			let data = {userName:this.user.name, message: message};
			this.kommunicator.sendGameData(option, data);
		}else{
			let option = {'group': 1, 'destinationChannel': '', 'type':'lobby_chat_msg'};
			let data = {'userName':this.user.name, 'message': message};
			this.kommunicator.sendLobbyData(option, data);
		}
		this.view.cleanChatInput();
	}

	receiveMessage(chatName, data){
		this.view.addChatMessage(chatName, data.userName, data.message);
	}

	receiveLobbyConnect(data){
		let message = data.userName + ' just connected';
		this.view.addChatNotification(message, {chatName:'lobby-message', isBold:false});
		this.refreshListUser(data.listUser);
	}

	receiveLobbyDisconnect(data){
		if(this.isInGameRequest && data.userID === this.enemy.id){
			this.receiveErrorGameRequest({errorType:'lobby_disconnect', enemyName:data.userName});
		}else if(this.isInGame && data.userID === this.enemy.id){
			this.cleanGame();
		}

		let message = data.userName + ' just disconnected';
		this.view.addChatNotification(message, {chatName:'lobby-message', isBold:false});
		this.refreshListUser(data.listUser);
	}

	receiveGameStarted(data){
		let message = 'Game Started : ' + data.user1 + ' VS ' + data.user2 + '!';
		this.view.addChatNotification(message, {chatName:'lobby-message', isBold:true});
	}

	receiveGameFinished(data){
		let message = 'Game ' + data.winner + ' VS ' + data.loser + ' Finished : ';
		message += (data.draw) ? ' Draw!' : data.winner + ' win!';
		this.view.addChatNotification(message, {chatName:'lobby-message', isBold:true});
	}






	//////////////////	Lobby Functions	//////////////////

	refreshListUser(listUser){
		this.view.refreshListUser(listUser);
	}

	///////	Send Functions

	sendGameRequest(){
		this.enemy = this.view.getEnemySelected();

		let option = {group: 0, destinationChannel: this.enemy.id, type: 'game_request'}
		let data = {userName: this.user.name};

		this.kommunicator.sendLobbyData(option, data);
		this.view.waitForConfirmation();
		this.isInGameRequest = true;
	}

	sendAcceptGameRequest(){
		let option = {group: 0, destinationChannel: this.enemy.id, type: 'accept_game_request'};
		this.kommunicator.sendLobbyData(option);
	}

	sendErrorGameRequest(errorType){
		this.isInGameRequest = false;

		let option = {group: 0, destinationChannel: this.enemy.id, type: 'error_game_request'};
		let data = {errorType: errorType, userName: this.user.name};
		this.kommunicator.sendLobbyData(option, data);

		this.view.removeGameRequest();
	}

	///////	Receive Functions

	receiveGameRequest(data){
		if(this.isInGame){
			let option = {group: 0, destinationChannel: data.enemyID, type: 'error_game_request'};
			let dataToSend = {errorType: 'is_in_game', userName: this.user.name};
			this.kommunicator.sendLobbyData(option, dataToSend);
			return;
		}else if(this.isInGameRequest){
			let option = {group: 0, destinationChannel: data.enemyID, type: 'error_game_request'};
			let dataToSend = {errorType: 'is_in_game_request', userName: this.user.name};
			this.kommunicator.sendLobbyData(option, dataToSend);
			return;
		}
		this.enemy.id = data.enemyID;
		this.enemy.name = data.enemyName;
		this.view.receiveGameRequest(data.enemyName);
		this.isInGameRequest = true;
	}

	receiveAcceptGameRequest(data){
		this.kommunicator.sendSystemData('set_bdd_in_game', {isInGame:1});

		let option = {group: 0, destinationChannel:data.enemyID, type: 'confirm_game_request'};
		this.kommunicator.sendLobbyData(option);

		this.view.receiveAcceptGameRequest(this.enemy.name);

		this.isInGameRequest = false;
		this.isInGame = true;
	}

	receiveConfirmGameRequest(data){
		this.kommunicator.sendSystemData('set_bdd_in_game', {isInGame:1});

		let option = {group: 1, destinationChannel: '', type: 'game_started'};
		let dataToSend = {'user1': this.user.name, 'user2': this.enemy.name};
		this.kommunicator.sendLobbyData(option, dataToSend);

		option = {group: 1, destinationChannel: '', type: 'refresh_list_user'};
		this.kommunicator.sendLobbyData(option);

		this.view.receiveConfirmGameRequest(this.enemy.name);

		this.isInGameRequest = false;
		this.isInGame = true;
	}

	receiveErrorGameRequest(data){
		this.isInGameRequest = false;
		this.view.receiveErrorGameRequest(data.errorType, data.enemyName);
		this.view.removeGameRequest();
	}








	//////////////////	Game Functions	//////////////////

	setPlayerColor(color){
		this.user.color = color;
		this.enemy.color = this.getOppositeColor(color);

		let option = {type: 'set_color', destinationChannel:this.enemy.id};
		let data = {color: this.enemy.color};
		this.kommunicator.sendGameData(option, data);

		this.startGame(color, true);
	}

	receiveSetPlayerColor(data){
		this.user.color = data.color;
		this.enemy.color = this.getOppositeColor(data.color);
		this.startGame(data.color, false);
	}

	startGame(color, playFirst){
		this.model.initBoard();
		this.view.removeBoardNotification();
		this.view.startGame(this.user, this.enemy, playFirst);
	}

	addToken(i, j){
		this.model.checkToken(i,j)
					.then(() => { return this.model.addToken(i,j, this.user.color); })
					.then(() => { return this.model.updateBoard(i,j); })
					.then( changes => { this.view.updateBoard(i,j, this.user.color, changes); })
					.then(() => { this.endOfTurn(); })
					.catch( errorType => { this.view.addBoardNotification(errorType); });
	}

	hoverCell(i,j){
		let option = {destinationChannel:this.enemy.id, type: 'hover_cell'};
		let data = {i:i, j:j, color:this.user.color};
		this.kommunicator.sendGameData(option, data);
	}

	receiveHoverCell(i, j, color){
		this.view.showHoverCell(i, j, color);
	}

	endOfTurn(){
		let option = {destinationChannel: this.enemy.id, type: 'end_of_turn'};
		let data = {newBoard: this.model.getBoardStringify()};
		this.kommunicator.sendGameData(option, data);
		if(!this.enemy.hasPassed){
			this.view.endOfTurn();
		}else{
			this.view.addTokenCounter('player-user');
		}
	}

	receiveEndOfTurn(data){
		let board = JSON.parse(data.newBoard);
		this.model.setNewBoard(board);
		this.view.setNewBoard(board);
		if(!this.user.hasPassed){
			this.view.startOfTurn();
		}else{
			this.view.addTokenCounter('player-enemy');
		}
	}

	userPassEvent(){
		this.view.addBoardNotification('user_pass_confirmation');
	}

	sendUserPass(){
		this.user.hasPassed = true;
		if(!this.enemy.hasPassed){
			let option = {destinationChannel:this.enemy.id, type:'enemy_pass'};
			this.kommunicator.sendGameData(option);
			this.view.userHasPassed();
			this.view.endOfTurn(true);
		}else{
			let optionGame = {destinationChannel:this.enemy.id, type:'end_of_game'};
			this.kommunicator.sendGameData(optionGame);

			this.getScore();
			this.view.endOfGame(this.user, this.enemy);

			let optionLobby = {group:1, destinationChannel:'', type:'game_finished'};
			let data;
			if(this.user.score > this.enemy.score){
				data = {winner:this.user.name, loser:this.enemy.name, draw:0};
			}else if(this.user.score < this.enemy.score){
				data = {winner:this.enemy.name, loser:this.user.name, draw:0};
			}else{
				data = {winner:this.enemy.name, loser:this.user.name, draw:1};
			}
			this.kommunicator.sendLobbyData(optionLobby, data);
		}
	}

	getScore(){
		this.user.score = this.model.getScore(this.user.color);
		this.enemy.score = this.model.getScore(this.enemy.color);
	}

	receiveEnemyPass(){
		this.enemy.hasPassed = true;
		this.view.receiveEnemyPass(this.enemy.name);
		this.view.startOfTurn(true);
	}

	receiveEndOfGame(){
		this.getScore();
		this.view.endOfGame(this.user, this.enemy);
	}

	removeBoardNotification(){
		this.view.removeBoardNotification();
	}

	cleanGame(){
		this.model.resetBoard();
		this.view.cleanGame();

		this.kommunicator.sendSystemData('set_bdd_in_game', {isInGame:0});

		let optionLobby = {group: 1, destinationChannel: '', type: 'refresh_list_user'};
		this.kommunicator.sendLobbyData(optionLobby);

		this.isInGame = false;
		this.enemy = {};
		this.user.score = 0;
		this.user.hasPassed = false;
	}




}

export default Controller;
