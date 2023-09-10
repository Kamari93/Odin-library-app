console.log("Keep Going 🍊 🌊...");

const themeSelect = document.getElementById('theme-select');
const genreCheckboxes = document.querySelectorAll('input[name="genre"]');
const selectAllGenresCheckbox = document.getElementById('select-all-genres');

// List of Book Objects
let bookList = [];

// The book object and constructor
class Book {
    constructor(title, author, bookType, pagesRead, totalPages) {
        this.title = title;
        this.author = author;
        this.bookType = bookType;
        this.pagesRead = pagesRead;
        this.totalPages = totalPages;
        // this.progress = ((pagesRead / totalPages) * 100).toFixed(2);
        this.progress = ((pagesRead / totalPages) * 100).toFixed(0);
    }
}


themeSelect.addEventListener('change', toggleTheme);

// Add event listener for "Select All" checkbox
selectAllGenresCheckbox.addEventListener('change', toggleSelectAllGenres);


/** add funct that takes user’s input and store the new book objs  into myLibrary arr*/
// function addBookToLibrary() {
//     // do stuff here...
//     const newBook = new Books(title, author, totalPages, pagesRead, completed);
//     myLibrary.push(newBook);
// };


function toggleTheme () {
    const selectedTheme = themeSelect.value;
    document.body.className = selectedTheme;

    // Add icons based on the selected theme
    if (selectedTheme === 'dark') {
        // const moonIcon = document.createElement('i');
        const moonIcon = document.querySelector('i');
        moonIcon.className = 'fa fa-moon-o';
        // document.querySelector('.theme').appendChild(moonIcon);
        document.querySelector('.theme').prepend(moonIcon);
    } else {
        // const sunIcon = document.createElement('i');
        const sunIcon = document.querySelector('i');
        sunIcon.className = 'fa fa-sun-o';
        // document.querySelector('.theme').appendChild(sunIcon);
        document.querySelector('.theme').prepend(sunIcon);
    };
};

// Function to toggle the selection of all genre checkboxes
function toggleSelectAllGenres() {
    const isChecked = selectAllGenresCheckbox.checked;

    genreCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
};

function showForm() {
    const formContainer = document.getElementById("form-container");
    formContainer.style.display = "flex";
}

function closeForm() {
    const formContainer = document.getElementById("form-container");
    formContainer.style.display = "none";
}

function addBook() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const bookType = document.getElementById("book-type").value;
    const pagesRead = parseInt(document.getElementById("pages-read").value);
    const totalPages = parseInt(document.getElementById("total-pages").value);

    // Create a new Book object
    const newBook = new Book(title, author, bookType, pagesRead, totalPages);

    bookList.push(newBook); // Add the book to the list
    updateTable(); // Update the table

    document.getElementById("book-form").reset();
    closeForm();
}


function updateTable() {
    const bookTable = document.getElementById("book-list");

    while (bookTable.firstChild) {
        bookTable.firstChild.remove();
    }

    for (let i = 0; i < bookList.length; i++) {
        const book = bookList[i];

        // Create a new row for each book
        const row = bookTable.insertRow();
        const keys = ["title", "author", "bookType", "pagesRead", "totalPages", "progress"];
        for (const key of keys) {
            const cell = row.insertCell();
            cell.textContent = book[key];
            // Check if the current cell is for the "progress" property
            if (key === "progress") {
                cell.classList.add("progress-cell");
                // cell.innerHTML = `<div class="progress-circle">${book[key]}%</div>`;
                let progress = book[key];
                let colorClass = getColorProgress(progress);
                cell.innerHTML = `<div class="progress-circle ${colorClass}">${progress}%</div>`
            }
        }

        const editCell = row.insertCell();
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => showFormForEdit(i); // Pass the book index for editing
        // editButton.onclick = () => editBook(i); // Pass the book index for editing
        editCell.appendChild(editButton);

        const deleteCell = row.insertCell();
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteBook(i); // Pass the book index for deletion
        deleteCell.appendChild(deleteButton);
    }
}

// Function to determine the color class based on progress value
function getColorProgress(progress) {
    if (progress < 25) {
        return "red-background"; // You can define CSS classes for different colors
    } else if (progress < 50) {
        return "yellow-background";
    } else if (progress < 75) {
        return "orange-background";
    } else {
        return "green-background";
    }
}

function deleteBook(bookIndex) {
    // Remove the selected book from the bookList array
    bookList.splice(bookIndex, 1);
    updateTable();
}

let selectedBookIndex = null; // Keep track of the selected book for editing

function showFormForEdit(bookIndex) {
    const formContainer = document.getElementById("form-container");
    formContainer.style.display = "flex";

    // Fill the form with the selected book's data
    const selectedBook = bookList[bookIndex];
    document.getElementById("title").value = selectedBook.title;
    document.getElementById("author").value = selectedBook.author;
    document.getElementById("book-type").value = selectedBook.bookType;
    document.getElementById("pages-read").value = selectedBook.pagesRead;
    document.getElementById("total-pages").value = selectedBook.totalPages;

    selectedBookIndex = bookIndex;
}

function editBook() {
    if (selectedBookIndex !== null) {
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const bookType = document.getElementById("book-type").value;
        const pagesRead = parseInt(document.getElementById("pages-read").value);
        const totalPages = parseInt(document.getElementById("total-pages").value);
        const progress = ((pagesRead / totalPages) * 100).toFixed(0);

        // Update the selected book's data in the bookList array
        bookList[selectedBookIndex].title = title;
        bookList[selectedBookIndex].author = author;
        bookList[selectedBookIndex].bookType = bookType;
        bookList[selectedBookIndex].pagesRead = pagesRead;
        bookList[selectedBookIndex].totalPages = totalPages;
        bookList[selectedBookIndex].progress = progress;

        updateTable();

        document.getElementById("book-form").reset();
        closeForm();
        selectedBookIndex = null;
    }
}
