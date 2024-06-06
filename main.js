document.addEventListener("DOMContentLoaded", function () {
    displayBooks();

    const bookSubmitButton = document.getElementById("bookSubmit");
    const updateSubmitButton = document.getElementById("UpdateSubmit");

    updateSubmitButton.addEventListener("click", function (event) {
        event.preventDefault();
        const bookId = document.getElementById("inputBookId").value;
        updateBook(bookId);

        clearInputFields();
        displayBooks();

        updateSubmitButton.style.display = "none";
        bookSubmitButton.style.display = "inline-block";
    });

    const inputBookForm = document.getElementById("inputBook");
    inputBookForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const bookId = generateId();

        addBook(bookId);
        displayBooks();
        clearInputFields();
    });

    const searchBookForm = document.getElementById("searchBook");
    searchBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBooks();
    });

    function generateId() {
        const existingData = JSON.parse(localStorage.getItem("bookshelfData")) || [];
        return existingData.length > 0 ? Math.max(...existingData.map(book => book.id)) + 1 : 1;
    }

    function addBook(id) {
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = parseInt(document.getElementById("inputBookYear").value);
        const isComplete = document.getElementById("inputBookIsComplete").checked;

        const newBook = {
            id: id,
            title: title,
            author: author,
            year: year,
            isComplete: isComplete
        };

        const existingData = JSON.parse(localStorage.getItem("bookshelfData")) || [];

        existingData.push(newBook);

        localStorage.setItem("bookshelfData", JSON.stringify(existingData));

        console.log("Book added successfully!");
    }

    function clearInputFields() {
        document.getElementById("inputBookTitle").value = "";
        document.getElementById("inputBookAuthor").value = "";
        document.getElementById("inputBookYear").value = "";
        document.getElementById("inputBookIsComplete").checked = false;
        document.getElementById("bookSubmit").querySelector("span").textContent = "Masukkan Buku ke rak";
    }

    function displayBooks() {
        const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
        const completeBookshelfList = document.getElementById("completeBookshelfList");

        incompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";

        const existingData = JSON.parse(localStorage.getItem("bookshelfData")) || [];

        existingData.forEach(book => {
            const bookItem = createBookItem(book);

            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        });
    }

    function setFormToUpdateMode(bookId, bookTitle, bookAuthor, bookYear, isComplete) {
        document.getElementById("inputBookTitle").value = bookTitle;
        document.getElementById("inputBookAuthor").value = bookAuthor;
        document.getElementById("inputBookYear").value = bookYear;
        document.getElementById("inputBookIsComplete").checked = isComplete;

        document.getElementById("bookSubmit").querySelector("span").textContent = "Update Buku";
        document.getElementById("inputBookId").value = bookId;

        updateSubmitButton.style.display = "inline-block";
        bookSubmitButton.style.display = "none";
    }

    function updateBook(bookId) {
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = parseInt(document.getElementById("inputBookYear").value);
        const isComplete = document.getElementById("inputBookIsComplete").checked;

        const existingData = JSON.parse(localStorage.getItem("bookshelfData")) || [];

        const updatedData = existingData.map(book => {
            if (book.id === parseInt(bookId)) {
                return {
                    id: book.id,
                    title: title,
                    author: author,
                    year: year,
                    isComplete: isComplete
                };
            }
            return book;
        });

        localStorage.setItem("bookshelfData", JSON.stringify(updatedData));
        console.log("Book updated successfully!");
    }

    function createBookItem(book) {
        const bookItem = document.createElement("article");
        bookItem.className = "book_item";

        const titleElement = document.createElement("h3");
        titleElement.textContent = book.title;

        const authorElement = document.createElement("p");
        authorElement.textContent = "Penulis: " + book.author;

        const yearElement = document.createElement("p");
        yearElement.textContent = "Tahun: " + book.year;

        const actionContainer = document.createElement("div");
        actionContainer.className = "action";

        const markButton = document.createElement("button");
        markButton.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
        markButton.className = book.isComplete ? "green" : "green";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Hapus buku";
        deleteButton.className = "red";

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update Buku";
        updateButton.className = "blue";

        bookItem.appendChild(titleElement);
        bookItem.appendChild(authorElement);
        bookItem.appendChild(yearElement);
        bookItem.appendChild(actionContainer);
        actionContainer.appendChild(markButton);
        actionContainer.appendChild(updateButton);
        actionContainer.appendChild(deleteButton);

        markButton.addEventListener("click", function () {
            book.isComplete ? markAsIncomplete(book) : markAsComplete(book);
            displayBooks();
        });

        updateButton.addEventListener("click", function () {
            setFormToUpdateMode(book.id, book.title, book.author, book.year, book.isComplete);
        });

        deleteButton.addEventListener("click", function () {
            const bookId = book.id;
            deleteBook(bookId);
            displayBooks();
        });

        return bookItem;
    }

    function markAsComplete(book) {
        book.isComplete = true;
        updateBookStatus(book);
    }

    function markAsIncomplete(book) {
        book.isComplete = false;
        updateBookStatus(book);
    }

    function updateBookStatus(book) {
        const existingData = JSON.parse(localStorage.getItem("bookshelfData")) || [];
        const updatedData = existingData.map(b => (b.id === book.id ? book : b));

        localStorage.setItem("bookshelfData", JSON.stringify(updatedData));

        console.log("Book status updated successfully!");
    }

    function deleteBook(bookId) {
        const existingData = JSON.parse(localStorage.getItem("bookshelfData")) || [];
        const updatedData = existingData.filter(b => b.id !== bookId);

        localStorage.setItem("bookshelfData", JSON.stringify(updatedData));

        console.log("Book deleted successfully!");
    }

    function searchBooks() {
        const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
        const existingData = JSON.parse(localStorage.getItem("bookshelfData")) || [];

        const searchResult = existingData.filter(book => book.title.toLowerCase().includes(searchTitle));

        displaySearchResult(searchResult);
    }

    function displaySearchResult(result) {
        const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
        const completeBookshelfList = document.getElementById("completeBookshelfList");

        incompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";

        result.forEach(book => {
            const bookItem = createBookItem(book);

            if (book.isComplete) {
                completeBookshelfList.appendChild(bookItem);
            } else {
                incompleteBookshelfList.appendChild(bookItem);
            }
        });
    }
});
