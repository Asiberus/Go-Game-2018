class Board_Notification{
	constructor(){
		this._init();
	}

	_init(){
		this.boardNotificationContainer = document.getElementById('board-notification-container');
		this.baordNotification = document.getElementById('board-notification');
		this.notificationMessage = document.getElementById('board-notification-message');

		this.notificationCounter = document.getElementById('board-notification-counter');
		this.userCounter = document.getElementById('bord-notification-counter-user');
		this.enemyCounter = document.getElementById('bord-notification-counter-enemy');

		this.btnContainer = document.getElementById('board-notification-btn-container');
		this.whiteBtn = document.getElementById('notification-white-btn');
		this.blackBtn = document.getElementById('notification-black-btn');
		this.confirmBtn = document.getElementById('notification-confirm-btn');
		this.cancelBtn = document.getElementById('notification-cancel-btn');
		this.lobbyBtn = document.getElementById('notification-lobby-btn');


		this.whiteBtn.addEventListener('click', function(){ controller.setPlayerColor('white'); });
		this.blackBtn.addEventListener('click', function(){ controller.setPlayerColor('black'); });
		this.confirmBtn.addEventListener('click', function(){ controller.sendUserPass(); });
		this.cancelBtn.addEventListener('click', function(){ controller.removeBoardNotification(); });
		this.lobbyBtn.addEventListener('click', function(){ controller.cleanGame(); });
	}

	show(show){
		if(show){
			this.boardNotificationContainer.style.display = 'flex';
			this.boardNotificationContainer.setAttribute('show', 'true');
			this.baordNotification.setAttribute('show', 'true');
		}else{
			this.boardNotificationContainer.setAttribute('show', 'false');
			this.baordNotification.setAttribute('show', 'false');
			setTimeout(() => {
				this.boardNotificationContainer.style.display = 'none';
			}, 300);
		}
	}

	addBoardNotification(message, option){
		//option; animation action, display btn, permanent
		this.notificationMessage.textContent = message;
		this.notificationMessage.setAttribute('action', option.action);
		this.btnContainer.setAttribute('button_display', option.button_display);

		this.show(true);
		if(!option.permanent){
			setTimeout(() => {
				this.show(false);
			}, 2000);
		}
	}

	addFinishedGameNotification(user, enemy){
		if(this.boardNotificationContainer.getAttribute('show') === 'true'){
			this.baordNotification.setAttribute('show', 'false');
			setTimeout(() => {
				this.setFinishedGameNotification(user, enemy);
				this.baordNotification.setAttribute('show', 'true');
			}, 300);
		}else{
			this.setFinishedGameNotification(user, enemy);
			this.show(true);
		}
	}

	setFinishedGameNotification(user, enemy){
		this.boardNotificationContainer.setAttribute('gameFinished', 'true');
		this.notificationCounter.style.display = 'flex';
		this.notificationMessage.textContent = 'Game Finished!';
		this.notificationMessage.setAttribute('action', 'stop');
		this.btnContainer.setAttribute('button_display', 'back-to-lobby');

		this.userCounter.querySelector('.player-color').setAttribute('color', user.color);
		this.userCounter.querySelector('.player-name').textContent = user.name;

		this.enemyCounter.querySelector('.player-color').setAttribute('color', enemy.color);
		this.enemyCounter.querySelector('.player-name').textContent = enemy.name;

		this.animateScore(user.score, enemy.score);
	}

	animateScore(userScore, enemyScore){
		let userScoreCounter = this.userCounter.querySelector('.player-score');
		let enemyScoreCounter = this.enemyCounter.querySelector('.player-score');
		let userDisplay = 0, enemyDisplay = 0;

		let animationUser = setInterval(() => {
			if(userDisplay === userScore){
				clearInterval(animationUser);
			}else{
				userDisplay++;
				userScoreCounter.textContent = userDisplay;
			}
		}, 1);

		let animationEnemy = setInterval(() => {
			if(enemyDisplay === enemyScore){
				clearInterval(animationEnemy);
			}else{
				enemyDisplay++;
				enemyScoreCounter.textContent = enemyDisplay;
			}
		}, 1);
	}

	// Reset Function

	resetBoardNotification(){
		this.boardNotificationContainer.setAttribute('gameFinished', 'false');
		this.notificationCounter.style.display = 'none';

		this.notificationMessage.textContent = '';
		this.notificationMessage.setAttribute('action', 'stop');
		this.btnContainer.setAttribute('button_display', 'none');

		let playerCounter = document.getElementsByClassName('player-counter-container');
		for(let c of playerCounter){
			c.querySelector('.player-color').setAttribute('color', '');
			c.querySelector('.player-name').textContent = '';
			c.querySelector('.player-score').textContent = '0';
		}

		this.show(false);
	}
}

export default Board_Notification;
