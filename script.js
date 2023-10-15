console.log("Keep Going 🍊 🌊...");

// Updated Logic with Class Syntax added

class Book {
    constructor(title, author, bookType, pagesRead, totalPages, index) {
        this.title = title;
        this.author = author;
        this.bookType = bookType;
        this.pagesRead = pagesRead;
        this.totalPages = totalPages;
        this.progress = ((pagesRead / totalPages) * 100).toFixed(0);
        this.index = index;
    }
}

class BookManager {
    constructor() {
        this.bookList = [];
        this.selectedBookIndex = null;
        this.themeSelect = document.getElementById('theme-select');
        this.genreCheckboxes = document.querySelectorAll('input[name="genre"]');
        this.selectAllGenresCheckbox = document.getElementById('select-all-genres');
        this.submitBtn = document.getElementById("submit-button");
        this.updateBtn = document.getElementById("edit-button");
        this.ascendingRadio = document.getElementById("ascend");
        this.descendingRadio = document.getElementById("descend");
        this.cancelSortRadio = document.getElementById("default");
        this.bookTable = document.getElementById("book-list");

        this.themeSelect.addEventListener('change', this.toggleTheme.bind(this));
        this.selectAllGenresCheckbox.addEventListener('change', this.toggleSelectAllGenres.bind(this));
        this.genreCheckboxes.forEach(checkbox => {
            checkbox.addEventListener("change", this.filterAndHideCategories.bind(this));
        });
        this.ascendingRadio.addEventListener("change", () => this.sortTable("ascending"));
        this.descendingRadio.addEventListener("change", () => this.sortTable("descending"));
        this.cancelSortRadio.addEventListener("change", this.sortChronological.bind(this));
        // this.submitBtn.addEventListener("click", this.addBook.bind(this));
        // this.updateBtn.addEventListener("click", this.editBookPopulateTable.bind(this));

        this.loadFromLocalStorage();
        this.updateTable();
    }

    saveToLocalStorage() {
        localStorage.setItem("bookList", JSON.stringify(this.bookList));
    }

    loadFromLocalStorage() {
        const storedData = localStorage.getItem("bookList");
        if (storedData) {
            this.bookList = JSON.parse(storedData);
        }
    }


    toggleTheme() {
        // Your existing toggleTheme function logic
        const selectedTheme = this.themeSelect.value;
        document.body.className = selectedTheme;

        // Add icons based on the selected theme
        const themeLabel = document.querySelector('label[for="theme-select"]');
        themeLabel.innerHTML = ''; // Clear existing content

        const themeIcon = document.createElement('i');
        themeIcon.className = selectedTheme === 'dark' ? 'fa fa-moon-o' : 'fa fa-sun-o';
        themeLabel.appendChild(themeIcon);
    }


    toggleSelectAllGenres() {
        const isChecked = this.selectAllGenresCheckbox.checked;

        this.genreCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    }


    showForm() {
        const formContainer = document.getElementById("form-container");
        formContainer.style.display = "flex";
        this.enterEditMode(false);
    }


    closeForm() {
        const formContainer = document.getElementById("form-container");
        formContainer.style.display = "none";
        document.getElementById("book-form").reset();
        this.enterEditMode(false);
    }


    resetFormEmptyList() {
        if (this.bookList.length === 0) {
            document.getElementById("book-form").reset();
        }
    }


    addBook() {
        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const bookType = document.getElementById("book-type").value;
        const pagesRead = parseInt(document.getElementById("pages-read").value);
        const totalPages = parseInt(document.getElementById("total-pages").value);

        // Validate input
        if (this.validateAddBook(title, author, bookType, pagesRead, totalPages)) {
            // Check if a book with the same title and author already exists
            const isDuplicate = this.bookList.some(book => book.title === title && book.author === author);

            if (isDuplicate) {
                alert("This book already exists in the library.");
            } else {
                // Get the current length of the bookList array as the index
                const index = this.bookList.length;
                // Create a new Book object
                const newBook = new Book(title, author, bookType, pagesRead, totalPages, index);
                this.bookList.push(newBook); // Add the book to the list
                this.saveToLocalStorage();
                this.updateTable(); // Update the table
                document.getElementById("book-form").reset();
                this.closeForm();
            }
        }
    }




    updateTable() {
        const bookTable = this.bookTable;

        while (bookTable.firstChild) {
            bookTable.firstChild.remove();
        }

        this.bookList.forEach(book => {
            const row = bookTable.insertRow();
            const keys = ["title", "author", "bookType", "pagesRead", "totalPages", "progress"];

            keys.forEach(key => {
                const cell = row.insertCell();
                cell.textContent = book[key];

                if (key === "progress") {
                    cell.classList.add("progress-cell");
                    const progress = book[key];
                    const colorClass = this.getColorProgress(progress);
                    cell.innerHTML = `<div class="progress-circle ${colorClass}">${progress}%</div>`;
                }

                if (key === "title") {
                    cell.classList.add("title-column");
                    cell.classList.add("title-col");
                }
            });

            row.setAttribute("data-category", book.bookType);

            const editCell = row.insertCell();
            const editButton = document.createElement("button");
            editButton.classList.add("edit");
            editButton.innerHTML = '<i class="fa fa-pencil-square-o"></i>';
            editButton.onclick = () => this.showFormForEdit(book.index);
            editCell.appendChild(editButton);

            const deleteCell = row.insertCell();
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete");
            deleteButton.innerHTML = `<i class="fa fa-trash"></i>`;
            deleteButton.onclick = () => this.deleteBook(book.index);
            deleteCell.appendChild(deleteButton);

            if (book.pagesRead === book.totalPages) {
                this.updateHeaderStats();
            }
        });
    }



    getColorProgress(progress) {
        // Your existing getColorProgress function logic
        if (progress < 25) {
            return "red-background"; // You can define CSS classes for different colors
        } else if (progress < 50) {
            return "orange-background";
        } else if (progress < 90) {
            return "gold-background";
        } else if (progress < 100) {
            return "green-background";
        } else {
            return "green-background complete"
        }
    }

    deleteBook(bookIndex) {
        const isConfirmed = confirm("Are you sure you want to delete this book?");
        if (isConfirmed) {
            // Remove the selected book from the bookList array
            this.bookList.splice(bookIndex, 1);
            this.saveToLocalStorage();
            this.updateTable();
            // Reload the page
            location.reload();
        }
    }


    enterEditMode(edit) {
        // Your existing enterEditMode function logic
        if (edit === true) {
            document.getElementById("Formheader").textContent = "Edit Book";
            document.getElementById("submit-button").style.display = "none";
            document.getElementById("edit-button").style.display = "flex";
        } else {
            document.getElementById("Formheader").textContent = "Add a Book";
            document.getElementById("submit-button").style.display = "flex";
            document.getElementById("edit-button").style.display = "none";
        }
    }

    showFormForEdit(bookIndex) {
        this.enterEditMode(true);
        const formContainer = document.getElementById("form-container");
        formContainer.style.display = "flex";

        // Fill the form with the selected book's data
        const selectedBook = this.bookList[bookIndex];
        document.getElementById("title").value = selectedBook.title;
        document.getElementById("author").value = selectedBook.author;
        document.getElementById("book-type").value = selectedBook.bookType;
        document.getElementById("pages-read").value = selectedBook.pagesRead;
        document.getElementById("total-pages").value = selectedBook.totalPages;

        this.selectedBookIndex = bookIndex;
    }


    editBookPopulateTable() {
        const isConfirmed = confirm("Are you sure you want to make changes to this book entry?");
        if (isConfirmed) {
            if (this.selectedBookIndex !== null) {
                const title = document.getElementById("title").value;
                const author = document.getElementById("author").value;
                const bookType = document.getElementById("book-type").value;
                const pagesRead = parseInt(document.getElementById("pages-read").value);
                const totalPages = parseInt(document.getElementById("total-pages").value);
                const progress = ((pagesRead / totalPages) * 100).toFixed(0);

                // Validate input
                if (this.validateEditBook(title, author, bookType, pagesRead, totalPages)) {
                    // Update the selected book's data in the bookList array
                    this.bookList[this.selectedBookIndex].title = title;
                    this.bookList[this.selectedBookIndex].author = author;
                    this.bookList[this.selectedBookIndex].bookType = bookType;
                    this.bookList[this.selectedBookIndex].pagesRead = pagesRead;
                    this.bookList[this.selectedBookIndex].totalPages = totalPages;
                    this.bookList[this.selectedBookIndex].progress = progress;

                    this.saveToLocalStorage();
                    this.updateTable();

                    document.getElementById("book-form").reset();
                    this.closeForm();
                    this.enterEditMode(false);
                    this.selectedBookIndex = null;
                    // Reload the page
                    location.reload();
                }
            }
        } else {
            // do nothing
        }
    }


    validateAddBook(title, author, bookType, pagesRead, totalPages) {
        // Your existing validateAddBook function logic
        // trim ensures user can't input blank spaces as valid input
        if (title.trim() === '' || author.trim() === '' || bookType === '' || isNaN(pagesRead) || isNaN(totalPages) || pagesRead > totalPages) {
            alert("Please fill in all fields correctly.");
            return false;
        }
        return true;
    }

    validateEditBook(title, author, bookType, pagesRead, totalPages) {
        // Your existing validateEditBook function logic
        if (title.trim() === '' || author.trim() === '' || bookType === '' || isNaN(pagesRead) || isNaN(totalPages) || pagesRead > totalPages) {
            alert("Please fill in all fields correctly.");
            return false;
        }
        return true;
    }

    filterAndHideCategories() {
        // Create a list of only the selected checkboxes
        const selectedCategories = Array.from(this.genreCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value); // Assuming the value attribute stores the category

        const bookTableRows = document.querySelectorAll("#book-list tr");

        // Only show the rows that have the bookType values === to selectedCheckbox values
        bookTableRows.forEach(row => {
            const bookCategory = row.getAttribute("data-category");
            if (!selectedCategories.includes(bookCategory)) {
                row.style.display = "none";
            } else {
                row.style.display = "";
            }
        });
    }


    sortTable(order) {
        // Create an array from the table rows
        const rows = Array.from(this.bookTable.querySelectorAll("tr"));
        // Sort the rows based on the progress attribute
        rows.sort((rowA, rowB) => {
            const progressA = parseFloat(rowA.querySelector(".progress-cell").textContent);
            const progressB = parseFloat(rowB.querySelector(".progress-cell").textContent);

            // Ascending orders the rows from least to greatest; otherwise, order from greatest to least
            return order === "ascending" ? progressA - progressB : progressB - progressA;
        });

        // Append sorted rows back to the table
        this.bookTable.innerHTML = "";
        rows.forEach(row => this.bookTable.appendChild(row));
    }


    sortChronological() {
        this.bookList.sort((a, b) => a.index - b.index); // Sort the bookList array by index
        this.updateTable(); // Update the table with the sorted data
    }


    updateHeaderStats() {
        const totalBooksElement = document.getElementById("total-books");
        const booksCompletedElement = document.getElementById("books-completed");

        // Update the total number of books
        totalBooksElement.textContent = this.bookList.length;

        // Calculate the number of books completed (100% progress)
        const booksCompleted = this.bookList.filter(book => (book.pagesRead / book.totalPages) === 1).length;
        booksCompletedElement.textContent = booksCompleted;
    }


};


// Initialize your application
const bookManager = new BookManager();
