const bookStorage = [];
const RENDER_EVENT = "render_books";
const STORAGE_KEY = "book_storage";

function createBook(id, title, author, year, isCompleted) {
	return {
		id,
		title,
		author,
		year,
		isCompleted,
	};
}

function generateId() {
	return (bookStorage[bookStorage.length - 1]?.id ?? bookStorage.length) + 1;
}

function getBookById(id) {
	for (book of bookStorage) {
		if (book.id === id) {
			return book;
		}
	}
	return null;
}

function getBookIndexById(id) {
	for (index in bookStorage) {
		if (bookStorage[index].id === id) {
			return index;
		}
	}
	return -1;
}

function addToShelf(book) {
	// if (book.id == null || getBookById(book.id) === book.id) return;
	bookStorage.push(book);
	saveBookStorage();
}

function addBookToCompleted(id) {
	const book = getBookById(id);
	if (book == null) return;

	book.isCompleted = true;
	saveBookStorage();
}

function removeBookFromCompleted(id) {
	const book = getBookById(id);
	if (book == null) return;

	book.isCompleted = false;
	saveBookStorage();
}
function removeBook(id) {
	const bookIndex = getBookIndexById(id);
	if (bookIndex < 0) return;

	bookStorage.splice(bookIndex, 1);
	saveBookStorage();
}

function updateBook(id, data) {
	const book = getBookById(id);
	if (book == null) return;
	book.title = data.title;
	book.author = data.author;
	book.year = data.year;
	book.isCompleted = data.isCompleted;
	console.log(book);

	saveBookStorage();
}

function checkStorage() {
	return typeof Storage != null;
}

function saveBookStorage() {
	if (!checkStorage()) return;

	const parsedStorage = JSON.stringify(bookStorage);
	localStorage.setItem(STORAGE_KEY, parsedStorage);
}

function loadBookStorage() {
	if (!checkStorage()) return;

	const serializedData = localStorage.getItem(STORAGE_KEY);
	const data = JSON.parse(serializedData);

	if (data != null) {
		bookStorage.splice(0, bookStorage.length);
		for (const book of data) {
			bookStorage.push(book);
		}
	}
}
