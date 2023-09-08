console.log("Keep Going 🍊 🌊...");

const themeSelect = document.getElementById('theme-select');
const genreCheckboxes = document.querySelectorAll('input[name="genre"]');
const selectAllGenresCheckbox = document.getElementById('select-all-genres');

// List of Book Objects
let bookList = [];

// The book object and constructor
class Book {
    constructor(title, author, pagesRead, totalPages, dateAdded) {
        this.title = title;
        this.author = author;
        this.pagesRead = pagesRead;
        this.totalPages = totalPages;
        this.dateAdded = dateAdded;
        this.progress = ((pagesRead / totalPages) * 100).toFixed(2);
    }
}


themeSelect.addEventListener('change', toggleTheme);

// Add event listener for "Select All" checkbox
selectAllGenresCheckbox.addEventListener('change', toggleSelectAllGenres);


/** add funct that takes user’s input and store the new book objs  into myLibrary arr*/
function addBookToLibrary() {
    // do stuff here...
    const newBook = new Books(title, author, totalPages, pagesRead, completed);
    myLibrary.push(newBook);
};

function addBook() {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pagesRead = parseInt(document.getElementById("pages-read").value);
    const totalPages = parseInt(document.getElementById("total-pages").value);
    const dateAdded = document.getElementById("date-added").value;

    // Create a new Book object
    const newBook = new Book(title, author, pagesRead, totalPages, dateAdded);

    bookList.push(newBook); // Add the book to the list
    updateTable(); // Update the table

    document.getElementById("book-form").reset();
    closeForm();
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
}

function closeForm() {
    const formContainer = document.getElementById("form-container");
    formContainer.style.display = "none";
}