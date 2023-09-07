console.log("Keep Going 🍊 🌊...");

const myLibrary = [];

// The book object and constructor
class Books {
    // constructor
    constructor(title, author, genre, totalPages, pagesRead, year, completed) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.totalPages = totalPages;
        this.pagesRead = pagesRead;
        this.year = year;
        this.completed = completed;
    }
};

/** add funct that takes user’s input and store the new book objs  into myLibrary arr*/
function addBookToLibrary() {
    // do stuff here...
    const newBook = new Books(title, author, totalPages, pagesRead, completed);
    myLibrary.push(newBook);
};

// add progress circle for each book and progress bar for total books completed out of total
// progress change colors depending on percentages complete red, yellow, green
// add dark/light theme slider...no need for extra animation...model after MDN's themes
// add a feature that edits and updates book info
// add sort and filter functions on sidebar 
// genres include fiction, non-fiction, etc. add as drop-down options in form

const themeSelect = document.getElementById('theme-select');
const genreCheckboxes = document.querySelectorAll('input[name="genre"]');
const selectAllGenresCheckbox = document.getElementById('select-all-genres');

themeSelect.addEventListener('change', function() {
    const selectedTheme = themeSelect.value;
    document.body.className = selectedTheme;

    // Remove existing icons
    // const existingIcons = document.querySelectorAll('i');
    // existingIcons.forEach(icon => icon.remove());

    // Add icons based on the selected theme
    if (selectedTheme === 'dark') {
        // const moonIcon = document.createElement('i');
        const moonIcon = document.querySelector('i');
        moonIcon.className = 'fa fa-moon-o';
        // document.querySelector('.theme').appendChild(moonIcon);
        document.querySelector('i').appendChild(moonIcon);
    } else {
        // const sunIcon = document.createElement('i');
        const sunIcon = document.querySelector('i');
        sunIcon.className = 'fa fa-sun-o';
        // document.querySelector('.theme').appendChild(sunIcon);
        document.querySelector('i').appendChild(sunIcon);
}
});

// Add event listener for "Select All" checkbox
selectAllGenresCheckbox.addEventListener('change', toggleSelectAllGenres);

// Function to toggle the selection of all genre checkboxes
        function toggleSelectAllGenres() {
            const isChecked = selectAllGenresCheckbox.checked;

            genreCheckboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
            });

            // Apply filters when "Select All" checkbox is clicked
            // applyFilters();
        }