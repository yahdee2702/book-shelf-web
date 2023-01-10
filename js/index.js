const inputs = document.getElementsByTagName("input");
const tabs = document.getElementsByClassName("tab");
const jumbotron = document.getElementById("jumbotron");
const nav = document.getElementsByTagName("nav")[0];
const formBook = document.getElementById("form-insert-book");
const popUp = document.getElementById("pop-up");
const insertButton = document.getElementById("insert-button");
const search = document.querySelector("#search > input");
const closeSearch = document.querySelector("#search > .close-button");

let editedBook = -1;
let searching = "";

function main() {
	for (const input of inputs) {
		blurOnEnter(input);
	}

	createBook();

	setupTab();

	loadBookStorage();
	render();

	formBook.addEventListener("submit", (event) => {
		if (editedBook < 0) {
			onAddBook();
		} else {
			performEdit(editedBook);
		}
		render();
		clearForm();
		hidePopUp();
		console.log(bookStorage);

		event.preventDefault();
	});

	closeSearch.addEventListener("click", () => {
		search.value = "";
	});

	search.addEventListener("change", () => {
		searching = search.value;
	});

	search.addEventListener("blur", () => {
		render();
	});

	setupPopUp();
}

function performEdit(id) {
	if (id < 0) return;
	const newData = getFromForm(editedBook);
	updateBook(id, newData);
}

function editBook(id) {
	const book = getBookById(id);
	console.log("asdkjas");

	const title = document.querySelector(
		"#form-insert-book > .form-group > input#title"
	);
	const author = document.querySelector(
		"#form-insert-book > .form-group > input#author"
	);
	const date = document.querySelector(
		"#form-insert-book > .form-group > input#date"
	);
	const finished = document.querySelector(
		"#form-insert-book > .form-group > input#finished"
	);

	title.value = book.title;
	author.value = book.author;
	date.value = book.year;
	finished.checked = book.isCompleted;

	editedBook = book.id;
	showPopUp();
}

function clearForm() {
	const title = document.querySelector(
		"#form-insert-book > .form-group > input#title"
	);
	const author = document.querySelector(
		"#form-insert-book > .form-group > input#author"
	);
	const date = document.querySelector(
		"#form-insert-book > .form-group > input#date"
	);
	const finished = document.querySelector(
		"#form-insert-book > .form-group > input#finished"
	);

	title.value = "";
	author.value = "";
	date.value = "";
	finished.checked = false;
	editedBook = -1;
}

function setupPopUp() {
	for (const pops of popUp.children) {
		pops.addEventListener("click", (event) => {
			event.stopPropagation();
		});
	}

	insertButton.addEventListener("click", () => {
		showPopUp();
	});

	popUp.onclick = () => {
		hidePopUp();
		clearForm();
	};
}

function hidePopUp() {
	popUp.setAttribute("hidden", "");
}

function showPopUp() {
	popUp.removeAttribute("hidden", "");
}

function setupTab() {
	for (const tabElement of tabs) {
		const tabList = tabElement.getElementsByTagName("li");
		const tabContent =
			tabElement.parentElement.getElementsByClassName("tab-content")[0];

		for (const tab of tabList) {
			renderTab(tab, tabList, tabContent);
			tab.addEventListener("click", (event) => {
				renderTab(event.target, tabList, tabContent);
			});
		}
	}
}

function renderTab(target, tabs, containers) {
	const targetId = target.getAttribute("for");
	const targetContainer = document.getElementById(targetId);
	target.classList.add("choosen-tab");
	targetContainer.classList.add("choosen-tab-content");

	for (const tab of tabs) {
		if (tab.classList.contains("choosen-tab") && tab !== target) {
			tab.classList.remove("choosen-tab");
		}
	}

	for (const container of containers.getElementsByTagName("div")) {
		if (
			container !== targetContainer &&
			container.parentElement === containers
		) {
			container.classList.remove("choosen-tab-content");
		}
	}
}

function render() {
	renderBook();
}

function renderBook() {
	const incompletedStorage = document.querySelector(
		"#incompleted-bookshelf > .book-storage"
	);
	const completedStorage = document.querySelector(
		"#completed-bookshelf > .book-storage"
	);

	incompletedStorage.innerHTML = "";
	completedStorage.innerHTML = "";

	let targetRender = bookStorage;

	if (searching !== "") {
		targetRender = bookStorage.filter((book) => {
			let query = searching.toLowerCase();
			return (
				book.title.toLowerCase().match(query) ||
				book.author.toLowerCase().match(query) ||
				book.year.toLowerCase().match(query)
			);
		});
		console.log("searching");
	}

	console.log(targetRender);

	for (const book of targetRender) {
		const bookElement = generateBook(book);
		if (book.isCompleted) {
			completedStorage.append(bookElement);
		} else {
			incompletedStorage.append(bookElement);
		}
	}
}

function blurOnEnter(element) {
	element.addEventListener("keydown", (e) => {
		if (e.keyCode === 13) {
			element.blur();
		}
	});
}

function getFromForm(id) {
	const title = document.querySelector(
		"#form-insert-book > .form-group > input#title"
	);
	const author = document.querySelector(
		"#form-insert-book > .form-group > input#author"
	);
	const date = document.querySelector(
		"#form-insert-book > .form-group > input#date"
	);
	const finished = document.querySelector(
		"#form-insert-book > .form-group > input#finished"
	);

	return createBook(
		id ?? generateId(),
		title.value,
		author.value,
		date.value,
		finished.checked
	);
}

function onAddBook() {
	const book = getFromForm();

	addToShelf(book);
	render();
}

function generateBook(book) {
	const bookElement = document.createElement("book");

	const detailSection = document.createElement("div");
	detailSection.classList.add("book-detail");

	const actionSection = document.createElement("div");
	actionSection.classList.add("book-actions");

	detailSection.append(createElement("h3", book.title, "book-title"));
	detailSection.append(createElement("p", book.author, "book-author"));
	detailSection.append(createElement("p", book.year, "book-date"));

	if (book.isCompleted) {
		actionSection.append(
			createIcon("refresh", () => {
				removeBookFromCompleted(book.id);
				render();
			})
		);
	} else {
		actionSection.append(
			createIcon("check", () => {
				addBookToCompleted(book.id);
				render();
			})
		);
	}
	actionSection.append(
		createIcon("remove", () => {
			removeBook(book.id);
			render();
		})
	);

	actionSection.append(
		createIcon("edit", () => {
			editBook(book.id);
		})
	);

	bookElement.append(detailSection);
	bookElement.append(actionSection);

	return bookElement;
}

function createElement(name, content, cssClass) {
	const nElement = document.createElement(name);
	nElement.innerHTML = content ?? "";
	if (cssClass != null) {
		nElement.classList.add(cssClass);
	}

	return nElement;
}

function createIcon(name, func) {
	const icon = createElement("i", name, "material-icons");
	if (func != null) {
		icon.addEventListener("click", func);
	}
	return icon;
}

onscroll = () => {
	if (window.scrollY > jumbotron.offsetHeight - 175) {
		nav.classList.add("sticky");
	} else {
		nav.classList.remove("sticky");
	}
};

document.addEventListener("DOMContentLoaded", main);
