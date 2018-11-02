class Chat{
	constructor(){
		this._init();
	}

	_init(){
		this.chatContainer = document.getElementById('chat-container');
		this.chatName = document.getElementById('chat-title-info');

		this.input = document.querySelector('#chat-input input');
		this.sendBtn = document.getElementById('send-button');

		this.sendBtn.addEventListener('click', this._sendLobbyMessage.bind(this));

		this.input.addEventListener('keyup', e => {
			if(e.keyCode === 13){ // value enter
				this.sendBtn.click();
			}
		});

	}

	_sendLobbyMessage(){
		let message = this.input.value;
		if(!/^ *$/.test(message)){
			controller.sendMessage(message);
		}
	}

	setChatContainer(containerName, chatName){
		this.chatContainer.setAttribute('msg-container', containerName);
		this.chatName.textContent = chatName;
	}

	cleanChatInput(){
		this.input.value = '';
	}

	cleanGameChatMessage(){
		document.getElementById('game-message').innerHTML = '';
	}

	addMessage(chatName, userName, userMessage){
		let wrapper = document.createElement('div');
		let message = document.createElement('span');
		let name = document.createElement('span');

		wrapper.classList.add('message');
		name.classList.add('name-user');
		name.textContent = userName;
		message.classList.add('message-span');
		message.textContent = userMessage;

		wrapper.appendChild(name);
		wrapper.appendChild(message);
		let chatContainer = document.getElementById(chatName);
		chatContainer.appendChild(wrapper);
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}

	addNotification(message, option){
		//OPTION: chatName, isBold
		let wrapper = document.createElement('div');
		let notification = document.createElement('span');

		wrapper.classList.add('notification');
		if(option.isBold){
			wrapper.classList.add('bold');
		}
		notification.textContent = message;

		wrapper.appendChild(notification);
		let chatContainer = document.getElementById(option.chatName);
		chatContainer.appendChild(wrapper);
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}
}

export default Chat;
