class Kommunicator{
	constructor(){
		this._init();
	}

	_init(){
		this.kommunicatorSocket = {};
	}

	initKommunicatorSocket(userName){
		this.kommunicatorSocket = new WebSocket(
			'ws://' + window.location.host + '/ws/lobby/'+userName+'/'
		);

		this.kommunicatorSocket.onmessage = function(e){
			let data = JSON.parse(e.data);
			eval('this.receive_' + data.target + '(data)');
		}.bind(this);

		this.kommunicatorSocket.onclose = function(e){
			console.error(e);
	    };
	}

	/////////////////////////////////////////////
	///////// Receive data Function /////////////
	/////////////////////////////////////////////

	///////// Receive System data ////////////////

	receive_system(data){
		switch(data.type){
			case 'name_already_taken':
				this.kommunicatorSocket.close(3000);
				controller.userNameTaken();
				break;
			case 'connect_succesful':
				controller.launchApp();
			default:

		}
	}

	///////// Receive Lobby data ////////////////

	receive_lobby(data){
		switch(data.type){
			case 'notification':
				this.notification(data);
				break;
			case 'lobby_chat_msg':
				controller.receiveMessage('lobby-message', data);
				break;
			case 'refresh_list_user':
				controller.refreshListUser(data.listUser);
				break;
			case 'game_request':
				controller.receiveGameRequest(data);
				break;
			case 'accept_game_request':
				controller.receiveAcceptGameRequest(data);
				break;
			case 'confirm_game_request':
				controller.receiveConfirmGameRequest(data);
				break;
			case 'game_started':
				controller.receiveGameStarted(data);
				break;
			case 'game_finished':
				controller.receiveGameFinished(data);
				break;
			case 'error_game_request':
				controller.receiveErrorGameRequest(data);
				break;
		}
	}

	notification(data){
		switch(data.notificationType){
			case 'lobby_connect':
				controller.receiveLobbyConnect(data);
				break;
			case 'lobby_disconnect':
				controller.receiveLobbyDisconnect(data);
				break;
		}
	}

	///////// Receive Game data /////////////

	receive_game(data){
		switch(data.type){
			case 'set_color':
				controller.receiveSetPlayerColor(data);
				break;
			case 'game_chat_msg':
				controller.receiveMessage('game-message', data);
				break;
			case 'end_of_turn':
				controller.receiveEndOfTurn(data);
				break;
			case 'hover_cell':
				controller.receiveHoverCell(data.i, data.j, data.color);
				break;
			case 'enemy_pass':
				controller.receiveEnemyPass();
				break;
			case 'end_of_game':
				controller.receiveEndOfGame();
				break;
			case 'wizz_sound':
				controller.receiveWizzSound(data);
				break;
		}
	}




	//////////////////////////////////////////
	///////// Send data Function /////////////
	//////////////////////////////////////////

	sendSystemData(function_to_call, args){
		this.kommunicatorSocket.send(JSON.stringify({
			target: 'system',
			function_to_call: function_to_call,
			args: JSON.stringify(args)
		}));
	}


	sendLobbyData(option, data={}){
		this.kommunicatorSocket.send(JSON.stringify({
			target: 'lobby',
			group: option.group,
			destination_channel: option.destinationChannel,
			type: option.type,
			data: JSON.stringify(data)
		}));
	}

	sendGameData(option, data={}){
		this.kommunicatorSocket.send(JSON.stringify({
			target: 'game',
			type: option.type,
			destination_channel: option.destinationChannel,
			data: JSON.stringify(data)
		}));
	}
}

export default Kommunicator;
