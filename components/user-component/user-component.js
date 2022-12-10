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
				.r('justify-content', 'center')
				.r('align-items', 'center').end
	}

	createHtml() {
		return [
			tag('style').h(this.createCss()),
			tag('div').a('id', 'main').c(
				tag('div').a('class', 'navbar').c(
					tag('img').a('src', '../emoji/back.svg').a('class', 'navbar-img'),
					tag('span').a('class', 'username').h(this.user.name),
					tag('img').a('src', '../emoji/pencil.svg').a('class', 'navbar-img').s('visibility', this.isCurrentUser && !this.isEditing ? 'visible' : 'hidden').e('click', () => this.startEditing()),
					tag('img').a('src', '../emoji/save.svg').a('class', 'navbar-img').s('visibility', this.isCurrentUser && this.isEditing ? 'visible' : 'hidden')
				),
				tag('div').a('class', 'description').a('contenteditable', this.isCurrentUser).a('id', 'description').h(this.user.description),
				tag('div').a('class', 'confirmation-container').c(
					tag('button').a('class', 'confirm-button').e('click', () => this.updateDescription(this.shadowRoot.getElementById('description').innerText)).h('Save')
				)
			)
		]
	}

	startEditing() {
		this.isEditing = true;
		this.render();
	}

	updateDescription(description) {
		this.user.description = description;
		this.user = FirebaseService.instance().getUpdateUser(this.user);
		this.user.description = MarkDownService.instance().markdownToHtml(this.user.description);
		this.render();
	}
}

customElements.define("user-component", UserComponent);
