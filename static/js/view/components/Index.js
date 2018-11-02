class Index{
	constructor(){
		this._init();
	}

	_init(){
		this.indexBck = document.getElementById('index-background');
		this.indexContainer = document.getElementById('index-container');
		this.indexTitle = document.getElementById('index-title');
		this.indexInput = document.getElementById('index-input');
		this.indexInputError = document.getElementById('index-input-error');

		this.indexInput.addEventListener('keyup', this._inputKeyup.bind(this));

		this.indexInput.focus();
	}

	_inputKeyup(e){
		this.indexInputError.setAttribute('error', 'false');
		controller.chooseName(e);
	}

	launchApp(){
		this.indexBck.setAttribute('show', 'false');
		setTimeout(() => {
			this.indexBck.style.display = 'none';
		}, 300);
	}

	userNameTaken(){
		this.indexInputError.setAttribute('error', 'true');
	}


}

export default Index;
