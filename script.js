console.log("Keep Going 🍊 🌊...");

const themeSelect = document.getElementById('theme-select');
const genreCheckboxes = document.querySelectorAll('input[name="genre"]');
const selectAllGenresCheckbox = document.getElementById('select-all-genres');
const submitBtn = document.getElementById("submit-button");
const updateBtn = document.getElementById("edit-button");
const ascendingRadio = document.getElementById("ascend");
const descendingRadio = document.getElementById("descend");
const cancelSortRadio = document.getElementById("default");
const bookTable = document.getElementById("book-list");


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
    constructor(title, author, bookType, pagesRead, totalPages, index) {
        this.title = title;
        this.author = author;
        this.bookType = bookType;
        this.pagesRead = pagesRead;
        this.totalPages = totalPages;
        // this.progress = ((pagesRead / totalPages) * 100).toFixed(2);
        this.progress = ((pagesRead / totalPages) * 100).toFixed(0);
        this.index = index;
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
        document.querySelector('label').prepend(moonIcon);
    } else {
        // const sunIcon = document.createElement('i');
        const sunIcon = document.querySelector('i');
        sunIcon.className = 'fa fa-sun-o';
        // document.querySelector('.theme').appendChild(sunIcon);
        document.querySelector('label').prepend(sunIcon);
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
            // Get the current length of the bookList array as the index
            const index = bookList.length;
            // Create a new Book object
            const newBook = new Book(title, author, bookType, pagesRead, totalPages, index);
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



    bookList.forEach((book, index) => {
        const books = book;

        // Create a new row for each book
        const row = bookTable.insertRow();
        const keys = ["title", "author", "bookType", "pagesRead", "totalPages", "progress"];
        for (const key of keys) {
            const cell = row.insertCell();
            cell.textContent = books[key];
            // Check if the current cell is for the "progress" property
            if (key === "progress") {
                cell.classList.add("progress-cell");
                let progress = books[key];
                let colorClass = getColorProgress(progress);
                cell.innerHTML = `<div class="progress-circle ${colorClass}">${progress}%</div>`
            }

            if (key === "title") {
                cell.classList.add("title-column"); // Apply the CSS class
                cell.classList.add("title-col"); // Apply the CSS class
            }
        }

        // Add the data-category attribute based on the book's category
        row.setAttribute("data-category", books.bookType);
        // console.log(row.getAttribute("data-category"))

        const editCell = row.insertCell();
        const editButton = document.createElement("button");
        editButton.classList.add("edit")
        // editButton.textContent = "Edit";
        editButton.innerHTML = '<i class="fa fa-pencil-square-o"></i>';
        editButton.onclick = () => showFormForEdit(index); // Pass the book index for editing
        editCell.appendChild(editButton);

        const deleteCell = row.insertCell();
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete")
        // deleteButton.textContent = "Delete";
        deleteButton.innerHTML = `<i class="fa fa-trash"></i>`;
        deleteButton.onclick = () => deleteBook(index); // Pass the book index for deletion
        deleteCell.appendChild(deleteButton);
        
        // Check if the book is completed and update the statistics
        if (book.pagesRead === book.totalPages) {
            updateHeaderStats();
        }
    })
    
}

// Function to determine the color class based on progress value
function getColorProgress(progress) {
    if (progress < 25) {
        return "red-background"; // You can define CSS classes for different colors
    } else if (progress < 50) {
        return "orange-background";
    } else if (progress < 90) {
        return "gold-background";
    } else if (progress < 100){
        return "green-background";
    } else {
        return "green-background complete"
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
        // Reload the page
        location.reload();
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
    const isConfirmed = confirm("Are you sure you want to make changes to this book entry?");
    if (isConfirmed) {
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
                // Reload the page
                location.reload();
            }
        }
    } else {
        // do nothing
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

// Add an event listener to handle checkbox changes
genreCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", filterAndHideCategories);
});

// Function to filter books and hide unchecked categories
function filterAndHideCategories() {
    // create a list of only the selected checkboxes
    const selectedCategories = Array.from(genreCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value); // Assuming value attribute stores category

    const bookTableRows = document.querySelectorAll("#book-list tr");

    // only show the rows that have the bookType vals === to selectedCheckbox vals
    bookTableRows.forEach(row => {
        const bookCategory = row.getAttribute("data-category");
        if (!selectedCategories.includes(bookCategory)) {
            row.style.display = "none";
        } else {
            row.style.display = "";
        }
    });
}

// Add event listeners to radio buttons
ascendingRadio.addEventListener("change", () => sortTable("ascending"));
descendingRadio.addEventListener("change", () => sortTable("descending"));
cancelSortRadio.addEventListener("change", () => sortChronological());

// Function to sort the table rows
function sortTable(order) {
    // create an arr from the table rows
    const rows = Array.from(bookTable.querySelectorAll("tr"));
    // Sort the rows based on the progress attribute
    rows.sort((rowA, rowB) => {
        const progressA = parseFloat(rowA.querySelector(".progress-cell").textContent);
        const progressB = parseFloat(rowB.querySelector(".progress-cell").textContent);

        // ascending orders the rows from least to greatest else order from greatest to least
        return order === "ascending" ? progressA - progressB : progressB - progressA;
    });

    // Append sorted rows back to the table
    bookTable.innerHTML = "";
    rows.forEach(row => bookTable.appendChild(row));
}


// Function to sort the table rows by chronological order (book index)
function sortChronological() {
    bookList.sort((a, b) => a.index - b.index); // Sort the bookList array by index
    updateTable(); // Update the table with the sorted data
}

// Function to update the header statistics
function updateHeaderStats() {
    const totalBooksElement = document.getElementById("total-books");
    const booksCompletedElement = document.getElementById("books-completed");

    // Update the total number of books
    totalBooksElement.textContent = bookList.length;

    // Calculate the number of books completed (100% progress)
    const booksCompleted = bookList.filter(book => (book.pagesRead / book.totalPages) === 1).length;
    booksCompletedElement.textContent = booksCompleted;
}


// Initialize your application
loadFromLocalStorage();
updateTable();
// console.log(bookList);


/**
 * Alternate sort functions ascend/descend (not as compatible with sortChronological)
    not compatible b/c the updateTable() resets the table as new table
    where as the above used sort re-arranges updated table w/out resetting it and not 
    interfering w/ chrono funct 
    **/
// // Function to sort the table rows by ascending progress
// function sortAscending() {
//     bookList.sort((a, b) => (a.progress) - (b.progress));
//     updateTable();
// }

// // Function to sort the table rows by descending progress
// function sortDescending() {
//     bookList.sort((a, b) => (b.progress) - (a.progress));
//     updateTable();
// }