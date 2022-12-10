import { TwitterAuthProvider } from "firebase/auth";
import { sel, tag } from "../../libs/emo-lib";
import FirebaseService from '../../services/firebse-service';
import MarkDownService from '../../services/markdown-service';

class UserComponent extends HTMLElement {

	constructor() {
		super();
		this.isEditing = false;
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.fetchUser();
		this.render()
	}

	fetchUser() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const userUid = Object.fromEntries(urlSearchParams.entries()).id;
		this.user = FirebaseService.instance().getUserByUid(userUid);
		this.description = MarkDownService.instance().markdownToHtml(this.user.description);
		this.isCurrentUser = FirebaseService.instance().getCurrentUser().uid === userUid;
	}

	render() {
		this.shadowRoot.innerHTML = '';
		this.shadowRoot.append(...this.createHtml());
	}

	createCss() {
		return sel('.navbar')
			.r('display', 'flex')
			.r('justify-content', 'space-between')
			.r('width', '100%')
			.r('align-items', 'center')
			.r('padding', '8px').end +
			sel('.navbar-img')
				.r('width', '35px')
				.r('cursor', 'pointer').end +
			sel('.username')
				.r('font-weight', 'bold')
				.r('font-size', 'x-large').end +
			sel('#main')
				.r('height', '100vh')
				.r('display', 'flex')
				.r('flex-direction', 'column')
				.r('align-items', 'center')
				.r('background-color', 'white').end +
			sel('.description')
				.r('display', 'flex')
				.r('flex-direction', 'column')
				.r('flex-grow', '1')
				.r('width', '100%')
				.r('padding', '16px')
				.r('box-sizing', 'border-box').end
	}

	createHtml() {
		return [
			tag('style').h(this.createCss()),
			tag('div').a('id', 'main').c(
				tag('div').a('class', 'navbar').c(
					tag('img').a('src', '../emoji/back.svg').a('class', 'navbar-img'),
					tag('span').a('class', 'username').h(this.user.name),
					tag('img').a('src', this.isEditing ? '../emoji/save.svg' : '../emoji/pencil.svg').a('class', 'navbar-img').s('visibility', this.isCurrentUser ? 'visible' : 'hidden').e('click', () => this.editOrSave()),
				),
				tag('pre').a('class', 'description').a('contenteditable', this.isEditing).a('id', 'description').h(this.description)
			)
		]
	}

	editOrSave() {
		if(this.isEditing)
			this.updateDescription();
		else
			this.startEditing();
	}

	startEditing() {
		this.isEditing = true; 
		this.description = this.user.description;
		this.render();
	}

	updateDescription() {
		const description = this.shadowRoot.getElementById('description').innerText;
		this.user.description = description;
		this.user = FirebaseService.instance().getUpdateUser(this.user);
		this.description = MarkDownService.instance().markdownToHtml(this.user.description);
		this.isEditing = false;
		this.render();
	}
}

customElements.define("user-component", UserComponent);
