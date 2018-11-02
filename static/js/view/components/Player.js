class Player{
	constructor(){
		this._init();
	}

	_init(){
		this.playerContainer = document.getElementById('player-container');
		this.passBtn = document.getElementById('pass-button');

	}

	_userPassEvent(){
		controller.userPassEvent();
	}

	togglePassButton(isPlaying){
		if(isPlaying){
			this.passBtn.setAttribute('active', 'true');
			this.passBtn.addEventListener('click', this._userPassEvent);
		}else{
			this.passBtn.setAttribute('active', 'false');
			this.passBtn.removeEventListener('click', this._userPassEvent);
		}
	}

	showPlayerContainer(show){
		if(show){
			this.playerContainer.style.display = 'block';
			this.playerContainer.setAttribute('show', 'true');
		}else{
			this.playerContainer.setAttribute('show', 'false');
			setTimeout(() => {
				this.playerContainer.style.dislay = 'none';
			}, 400);

		}
	}

	setPlayer(playerID, name, color, isPlaying){
		let player = document.getElementById(playerID);
		player.setAttribute('color', color);
		player.setAttribute('isPlaying', isPlaying.toString());
		player.querySelector('.player-name').textContent = name;
	}

	setIsPlaying(playerID, isPlaying){
		let player = document.getElementById(playerID);
		player.setAttribute('isPlaying', isPlaying.toString());
		if(playerID === 'player-user'){
			this.togglePassButton(isPlaying);
		}
	}

	setEnemyPassed(hasPassed){
		let e = document.getElementById('enemy-passed');
		e.setAttribute('hasPassed', hasPassed.toString());
	}

	setPassBtnText(text){
		this.passBtn.textContent = text;
	}

	addTokenCounter(playerID){
		let counter = document.querySelector('#' + playerID + ' .nb-token');
		counter.textContent = parseInt(counter.textContent) + 1;
	}

	// Reset Functions

	resetPlayerContainer(){
		this.showPlayerContainer(false);
		setTimeout(() => {
			this.resetPlayer('player-user');
			this.resetPlayer('player-enemy');
			this.resetTokenCounter();
		}, 400);
	}

	resetPlayer(playerID){
		let player = document.getElementById(playerID);
		player.setAttribute('color', '');
		player.setAttribute('isPlaying', 'false');
		player.querySelector('.player-name').textContent = '';
		if(playerID === 'player-user'){
			this.togglePassButton(false);
			this.passBtn.textContent = 'Click to Pass';
		}else{
			player.querySelector('#enemy-passed').setAttribute('hasPassed', 'false');
		}
	}

	resetTokenCounter(){
		document.querySelector('#player-user .nb-token').textContent = 0;
		document.querySelector('#player-enemy .nb-token').textContent = 0;
	}
}

export default Player;
