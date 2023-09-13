console.log("Keep Going 🍊 🌊...");

const themeSelect = document.getElementById('theme-select');
const genreCheckboxes = document.querySelectorAll('input[name="genre"]');
const selectAllGenresCheckbox = document.getElementById('select-all-genres');
const submitBtn = document.getElementById("submit-button");
const updateBtn = document.getElementById("edit-button");

// List of Book Objects
let bookList = [];
let selectedBookIndex = null; // Keep track of the selected book for editing
enterEditMode(false); //Sets the default form to submit/add mode
resetFormEmptyList(); //Makes sure form stays empty when bookList is empty (invalid now)


themeSelect.addEventListener('change', toggleTheme);

// Add event listener for "Select All" checkbox
selectAllGenresCheckbox.addEventListener('change', toggleSelectAllGenres);


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

// Function to save data to local storage
function saveToLocalStorage() {
    localStorage.setItem("bookList", JSON.stringify(bookList));
}

// Function to load data from local storage
function loadFromLocalStorage() {
    const storedData = localStorage.getItem("bookList");
    if (storedData) {
        bookList = JSON.parse(storedData);
    }
}


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
    // updateBtn.style.display = "none";
    // submitBtn.style.display = "flex";
}

function closeForm() {
    const formContainer = document.getElementById("form-container");
    formContainer.style.display = "none";
    document.getElementById("book-form").reset();
    enterEditMode(false);
}

function resetFormEmptyList() {
    if (bookList.length < 0) {
        document.getElementById("book-form").reset()
    }
}

function addBook() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const bookType = document.getElementById("book-type").value;
    const pagesRead = parseInt(document.getElementById("pages-read").value);
    const totalPages = parseInt(document.getElementById("total-pages").value);

    // Validate input
    if (validateAddBook(title, author, bookType, pagesRead, totalPages)) {
        // Check if a book with the same title and author already exists
        const isDuplicate = bookList.some(book => book.title === title && book.author === author);

        if (isDuplicate) {
            alert("This book already exists in the library.");
        } else {
            // Create a new Book object
            const newBook = new Book(title, author, bookType, pagesRead, totalPages);
            bookList.push(newBook); // Add the book to the list
            saveToLocalStorage();
            updateTable(); // Update the table

            document.getElementById("book-form").reset();
            closeForm();
        }
    }
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
                let progress = book[key];
                let colorClass = getColorProgress(progress);
                cell.innerHTML = `<div class="progress-circle ${colorClass}">${progress}%</div>`
            }

            if (key === "title") {
                cell.classList.add("title-column"); // Apply the CSS class
                cell.classList.add("title-col"); // Apply the CSS class
            }
        }

        const editCell = row.insertCell();
        const editButton = document.createElement("button");
        editButton.classList.add("edit")
        // editButton.textContent = "Edit";
        editButton.innerHTML = '<i class="fa fa-pencil-square-o"></i>';
        editButton.onclick = () => showFormForEdit(i); // Pass the book index for editing
        editCell.appendChild(editButton);

        const deleteCell = row.insertCell();
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete")
        // deleteButton.textContent = "Delete";
        deleteButton.innerHTML = `<i class="fa fa-trash"></i>`;
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
    } else if (progress < 90) {
        return "blue-background";
    } else {
        return "green-background";
    }
}

function deleteBook(bookIndex) {
    // Ask the user for confirmation by using js built in confirm funct
    const isConfirmed = confirm("Are you sure you want to delete this book?");
    if (isConfirmed) {
        // Remove the selected book from the bookList array
        bookList.splice(bookIndex, 1);
        saveToLocalStorage();
        updateTable();
    } else {

    }
}

function enterEditMode(edit) {
    if (edit === true) {
        document.getElementById("Formheader").textContent = "Edit Book";
        document.getElementById("submit-button").style.display = "none";
        document.getElementById("edit-button").style.display = "flex";
    } else {
        document.getElementById("Formheader").textContent = "Add a Book";
        document.getElementById("submit-button").style.display = "flex";
        document.getElementById("edit-button").style.display = "none";
    }
};

function showFormForEdit(bookIndex) {
    enterEditMode(true);
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

function editBookPopulateTable() {
    if (selectedBookIndex !== null) {
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const bookType = document.getElementById("book-type").value;
        const pagesRead = parseInt(document.getElementById("pages-read").value);
        const totalPages = parseInt(document.getElementById("total-pages").value);
        const progress = ((pagesRead / totalPages) * 100).toFixed(0);

        // Validate input
        if (validateEditBook(title, author, bookType, pagesRead, totalPages)) {
            // Update the selected book's data in the bookList array
            bookList[selectedBookIndex].title = title;
            bookList[selectedBookIndex].author = author;
            bookList[selectedBookIndex].bookType = bookType;
            bookList[selectedBookIndex].pagesRead = pagesRead;
            bookList[selectedBookIndex].totalPages = totalPages;
            bookList[selectedBookIndex].progress = progress;

            saveToLocalStorage();
            updateTable();

            document.getElementById("book-form").reset();
            closeForm();
            enterEditMode(false)
            selectedBookIndex = null;
        }
    }
}

// Validation function for the "Add" operation
function validateAddBook(title, author, bookType, pagesRead, totalPages) {
    // trim ensures user can't input blank spaces as valid input
    if (title.trim() === '' || author.trim() === '' || bookType === '' || isNaN(pagesRead) || isNaN(totalPages) || pagesRead > totalPages) {
        alert("Please fill in all fields correctly.");
        return false;
    }
    return true;
}

// Validation function for the "Edit" operation
function validateEditBook(title, author, bookType, pagesRead, totalPages) {
    if (title.trim() === '' || author.trim() === '' || bookType === '' || isNaN(pagesRead) || isNaN(totalPages) || pagesRead > totalPages) {
        alert("Please fill in all fields correctly.");
        return false;
    }
    return true;
}

// Initialize your application
loadFromLocalStorage();
updateTable();