class Lobby{
	constructor(){
		this._init();
	}

	_init(){
		this.lobbyContainer = document.getElementById('lobby-container');
		this.lobbySelectorContainer = document.getElementById('lobby-selector-container');
		this.listUserContainer = document.getElementById('list-user-container');
		this.listUser = document.getElementById('list-user');

		this.lobbyNotification = document.getElementById('lobby-notification');

		this.lobbyTitle = document.getElementById('lobby-title');

		this.btnContainer = document.getElementById('btn-container');
		this.playBtn = document.getElementById('play-btn');
		this.cancelBtn = document.getElementById('cancel-btn');
		this.acceptBtn = document.getElementById('accept-btn');
		this.declineBtn = document.getElementById('decline-btn');

		this.lobbyTitle.addEventListener('click', function(){ this._extend_list_user() }.bind(this));
		this.playBtn.addEventListener('click', function(){ controller.sendGameRequest(); });
		this.cancelBtn.addEventListener('click', function(){ controller.sendErrorGameRequest('cancel'); });
		this.acceptBtn.addEventListener('click', function(){ controller.sendAcceptGameRequest(); });
		this.declineBtn.addEventListener('click', function(){ controller.sendErrorGameRequest('decline'); });
	}

	_extend_list_user(){
		document.getElementById('lobby').style.justifyContent = 'start';

		this.lobbyTitle.setAttribute('list_extand', 'true');
		this.lobbySelectorContainer.setAttribute('list_extand', 'true');

		setTimeout(() => {
			this.listUserContainer.style.display = 'block';
			this.btnContainer.style.display = 'flex';
		}, 100);
	}

	_changeButtonDisplay(buttonDisplay){
		this.btnContainer.setAttribute('action', 'hide');
		setTimeout(() => {
			this.btnContainer.setAttribute('button_display', buttonDisplay);
			this.btnContainer.setAttribute('action', 'show');
		}, 200);
	}

	_selectUser(e){
		let userSelected = e.target;
		for(let li of document.getElementsByClassName('list-user-item')){
			li.classList.remove('selected');
		}
		userSelected.classList.add('selected');

		this.btnContainer.setAttribute('button_display', 'play');
		this.btnContainer.setAttribute('action', 'show');
	}

	removeLobby(){
		this.lobbyContainer.setAttribute('action', 'hide');
		setTimeout(() => {
			this.lobbyContainer.style.display = 'none';
		}, 500);
		this.removeGameRequest();
	}

	showLobby(){
		this.lobbyContainer.style.display = 'block';
		this.lobbyContainer.setAttribute('action', 'show');
		this.btnContainer.style.display = 'none';
		this.btnContainer.setAttribute('action', 'hide');

		this.lobbyTitle.setAttribute('list_extand', 'false');
		this.lobbySelectorContainer.setAttribute('list_extand', 'false');
		this.listUserContainer.style.display = 'none';

		for(let li of document.getElementsByClassName('list-user-item')){
			li.classList.remove('selected');
		}
	}

	refreshListUser(listUser){
		this.listUser.innerHTML = '';
		for(let user of listUser){
			if(user.name === controller.user.name){ continue; }
			let li = document.createElement('li');
			li.classList.add('list-user-item');
			li.id = user.channel_id;
			li.textContent = user.name;
			li.addEventListener('click', this._selectUser.bind(this));
			this.listUser.appendChild(li);
		}
	}

	waitForConfirmation(){
		this.lobbyNotification.style.display = 'flex';
		this.lobbyNotification.setAttribute('action', 'show');
		this.lobbyNotification.setAttribute('animation', 'send_request');
		this.lobbyNotification.querySelector('#notification-info').textContent = "Waiting for a response";

		this._changeButtonDisplay('cancel');
	}

	receiveGameRequest(userName, userId){
		let timeOut = 0;
		if(this.lobbySelectorContainer.getAttribute('list_extand') === 'false'){
			this._extend_list_user();
			timeOut = 200;
		}
		setTimeout(() => {
			this.lobbyNotification.style.display = 'flex';
			this.lobbyNotification.setAttribute('action', 'show');
			this.lobbyNotification.setAttribute('animation', 'receive_request');
			this.lobbyNotification.querySelector('#notification-info').textContent = userName + ' challenges you!';

			this._changeButtonDisplay('accept-decline');
		}, timeOut);
	}

	removeGameRequest(){
		this.lobbyNotification.setAttribute('action', 'hide');
		setTimeout(() => {
			this.lobbyNotification.style.display = 'none';
		}, 200);
		this._changeButtonDisplay('play');
	}

	getEnemySelected(){
		let enemy = this.lobbyContainer.querySelector('.selected');
		return {'id': enemy.id, 'name': enemy.textContent};
	}


}

export default Lobby;
