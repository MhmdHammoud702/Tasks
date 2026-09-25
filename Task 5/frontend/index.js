let firstname = document.getElementById("fname");
let firstval = document.getElementById("firstname-val");
let lastname = document.getElementById("lname");
let lastval = document.getElementById("lastname-val");
let gender = document.getElementById("gender");
let DOB = document.getElementById("DOB");
let button = document.getElementById("button");
const sortFirstname = document.getElementById("sort-firstname");
const sortLastname = document.getElementById("sort-lastname");
const sortGender = document.getElementById("gendersort");
const firstnameArrow = document.getElementById("farrow");
const lastnameArrow = document.getElementById("larrow");
const searchblock = document.getElementById("searchblock");
const searchbox = document.getElementById("searchbox");
const tableBody = document.getElementById("tbody");
const table = document.getElementById("table");
const clear = document.getElementById("clear");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
let exists = document.getElementById("exists");
let seconds = 60;
let timer = document.getElementById("timer");
let count = document.getElementById("count");
let males = document.getElementById("males");
let females = document.getElementById("females");
let currentPage = 1;
const usersPerPage = 5;
let users = [];
let filteredUsers = [];
let selectedGender = "";
let firstnameAsc = null;
let lastnameAsc = null;

const API_URL = "http://localhost:5001/Users";

table.style.display = "none";
searchblock.style.display = "none";
document.getElementById("show").style.display = "none";

count.textContent = 0;
females.textContent = 0;
males.textContent = 0;

const normalize = (string) =>
    string.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const getDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
};

const countdown = setInterval(async() => {
    seconds--;
    timer.textContent = seconds;

    if (seconds <= 0) {
        users = [];
        displayUsers();
        try {
            const response = await fetch(API_URL, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete users");
            }

            users=[];
        } catch (error) {
            console.error("Error adding user:", error);
        }
        timer.textContent = "60";
        seconds = 60;
    }
}, 1000);

function checkfields() {
    const editing = document.querySelector(".save");

    if (firstname.value.trim() != "") {
        if (firstname.value.length >= 2 && !/[0-9]/.test(firstname.value)) {
            firstval.textContent = "";
        } else if (
            firstname.value.length < 2 &&
            /[0-9]/.test(firstname.value)
        ) {
            firstval.textContent =
                "Firstname should be at least 2 characters and without numbers";
        } else if (firstname.value.length < 2) {
            firstval.textContent =
                "Firstname should be at least 2 characters";
        } else {
            firstval.textContent =
                "Firstname should not contain numbers";
        }
    } else {
        firstval.textContent = "";
    }

    if (lastname.value.trim() != "") {
        if (lastname.value.length >= 2 && !/[0-9]/.test(lastname.value)) {
            lastval.textContent = "";
        } else if (
            lastname.value.length < 2 &&
            /[0-9]/.test(lastname.value)
        ) {
            lastval.textContent =
                "Lastname should be at least 2 characters and without numbers";
        } else if (lastname.value.length < 2) {
            lastval.textContent =
                "Lastname should be at least 2 characters";
        } else {
            lastval.textContent =
                "Lastname should not contain numbers";
        }
    } else {
        lastval.textContent = "";
    }

    if (
        firstname.value.trim() !== "" &&
        firstval.textContent == "" &&
        lastname.value.trim() !== "" &&
        lastval.textContent == "" &&
        gender.value !== "" &&
        DOB.value !== "" &&
        !editing
    ) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

firstname.addEventListener("input", checkfields);
lastname.addEventListener("input", checkfields);
gender.addEventListener("change", checkfields);
DOB.addEventListener("change", checkfields);

function filterUsers(reset = false) {
    filteredUsers = [...users];

    if (selectedGender !== "") {
        filteredUsers = filteredUsers.filter(
            user => user.gender === selectedGender
        );
    }

    const searchValue = searchbox.value;

    if (searchValue.trim() !== "") {
        filteredUsers = filteredUsers.filter(
            user =>
                normalize(user.firstname).includes(normalize(searchValue)) ||
                normalize(user.lastname).includes(normalize(searchValue))
        );
    }

    if (firstnameAsc === true) {
        filteredUsers.sort((a, b) => {
            return a.firstname.localeCompare(b.firstname);
        });
    } else if (firstnameAsc === false) {
        filteredUsers.sort((a, b) => {
            return b.firstname.localeCompare(a.firstname);
        });
    }

    if (lastnameAsc === true) {
        filteredUsers.sort((a, b) => {
            return a.lastname.localeCompare(b.lastname);
        });
    } else if (lastnameAsc === false) {
        filteredUsers.sort((a, b) => {
            return b.lastname.localeCompare(a.lastname);
        });
    }

    if (reset) {
        currentPage = 1;
    }

    displayUsers(filteredUsers);
}

sortGender.addEventListener("change", () => {
    selectedGender = sortGender.value;
    filterUsers(true);
});

sortFirstname.addEventListener("click", function () {
    firstnameAsc = firstnameAsc === true ? false : true;
    lastnameAsc = null;
    lastnameArrow.textContent = "";

    if (firstnameAsc === true) {
        firstnameArrow.textContent = "⬆️";
    } else if (firstnameAsc === false) {
        firstnameArrow.textContent = "⬇️";
    }

    filterUsers(true);
});

sortLastname.addEventListener("click", function () {
    lastnameAsc = lastnameAsc === true ? false : true;
    firstnameAsc = null;
    firstnameArrow.textContent = "";

    if (lastnameAsc === true) {
        lastnameArrow.textContent = "⬆️";
    } else if (lastnameAsc === false) {
        lastnameArrow.textContent = "⬇️";
    }

    filterUsers(true);
});

searchbox.addEventListener("input", function () {
    filterUsers(true);
});

button.addEventListener("click", async function () {
    if (firstname.value.length < 2) {
        firstval.style.display = "block";
        return;
    }

    if (lastname.value.length < 2) {
        lastval.style.display = "block";
        return;
    }

    if (DOB.value === "") {
        return;
    }

    const alreadyExists = users.find(
        exist =>
            normalize(exist.firstname) == normalize(firstname.value) &&
            normalize(exist.lastname) == normalize(lastname.value)
    );

    if (alreadyExists) {
        exists.style.display = "block";
        return;
    }

    exists.style.display = "none";

    const user = {
        firstname: firstname.value,
        lastname: lastname.value,
        gender: gender.value,
        DOB: DOB.value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error("Failed to add user");
        }

        const newUser = await response.json();

        users.push(newUser);

        sortGender.value = "";
        selectedGender = "";

        firstname.value = "";
        lastname.value = "";
        gender.value = "";
        DOB.value = "";

        currentPage = Math.ceil(users.length / usersPerPage);

        filterUsers();
        checkfields();
    } catch (error) {
        console.error("Error adding user:", error);
    }
});

clear.addEventListener("click", async () => {
    let confirm = window.confirm(
        "are you sure you want to clear all users?"
    );

    if (!confirm) {
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete all users");
        }

        users = [];
        currentPage = 1;
        displayUsers();
    } catch (error) {
        console.error("Error deleting users:", error);
    }
});

function displayUsers(Users = users) {
    if (users.length != 0) {
        searchblock.style.display = "block";
        document.getElementById("show").style.display = "block";
    } else {
        searchblock.style.display = "none";
        document.getElementById("show").style.display = "none";
    }

    if (Users.length != 0 || searchbox.value.length != 0) {
        table.style.display = "table";
    } else {
        table.style.display = "none";
    }

    count.textContent = users.length;

    const malescount = users.filter(
        user => user.gender === "Male"
    );

    const femalescount = users.filter(
        user => user.gender === "Female"
    );

    males.textContent = malescount.length;
    females.textContent = femalescount.length;

    tableBody.innerHTML = "";

    const pages = Math.ceil(Users.length / usersPerPage);

    if (currentPage == pages || pages == 0) {
        nextPage.disabled = true;
    } else {
        nextPage.disabled = false;
    }

    if (currentPage == 1) {
        prevPage.disabled = true;
    } else {
        prevPage.disabled = false;
    }

    const paginationbuttons =
        document.getElementById("paginationButtons");

    paginationbuttons.innerHTML = "";

    for (let i = 1; i <= pages; i++) {
        const buttonPag = document.createElement("button");

        buttonPag.textContent = i;

        if (currentPage == i) {
            buttonPag.classList.add("pag");
        } else {
            buttonPag.classList.add("pagButton");
        }

        buttonPag.addEventListener("click", () => {
            currentPage = i;
            displayUsers(Users);
        });

        paginationbuttons.appendChild(buttonPag);
    }

    const start = (currentPage - 1) * usersPerPage;
    const end = start + usersPerPage;
    const pageUsers = Users.slice(start, end);

    pageUsers.forEach((user) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.gender}</td>
            <td>${getDate(user.DOB)}</td>
        `;

        const ActionCell = document.createElement("td");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", async function () {
            const duser = users.find(
                item => item._id === user._id
            );

            if (
                window.confirm(
                    `are you sure you want to delete ${duser.firstname + " " + duser.lastname}?`
                )
            ) {
                try {
                    const response = await fetch(
                        `${API_URL}/${user._id}`,
                        {
                            method: "DELETE"
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to delete user");
                    }

                    users = users.filter(
                        item => item._id !== user._id
                    );

                    if (
                        currentPage > 1 &&
                        (currentPage - 1) * usersPerPage >= users.length
                    ) {
                        currentPage--;
                    }

                    displayUsers();
                } catch (error) {
                    console.error("Error deleting user:", error);
                }
            }
        });

        ActionCell.appendChild(deleteButton);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", async function () {
            const editing = document.querySelector(".save");

            if (editing && editing != editButton) {
                editing.classList.remove("save");
                editing.textContent = "Edit";
            }

            const selectedUser = users.find(
                item => item._id === user._id
            );

            if (editButton.classList.contains("save")) {
                const updatedUser = {
                    firstname: firstname.value,
                    lastname: lastname.value,
                    gender: gender.value,
                    DOB: DOB.value
                };

                try {
                    const response = await fetch(
                        `${API_URL}/${selectedUser._id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(updatedUser)
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to update user");
                    }
                    
                    const index = users.findIndex(
                        item => item._id === selectedUser._id
                    );

                    if (index !== -1) {
                        users[index] = updatedUser;
                    }

                    editButton.classList.remove("save");
                    editButton.textContent = "Edit";

                    firstname.value = "";
                    lastname.value = "";
                    gender.value = "";
                    DOB.value = "";


                    await getUsers();
                    checkfields();
                } catch (error) {
                    console.error("Error updating user:", error);
                }

                return;
            }


            firstname.value = selectedUser.firstname;
            lastname.value = selectedUser.lastname;
            gender.value = selectedUser.gender;
            DOB.value = selectedUser.DOB;

            editButton.classList.add("save");
            editButton.textContent = "Save";

            checkfields();
        });

        ActionCell.appendChild(editButton);

        row.appendChild(ActionCell);

        tableBody.appendChild(row);
    });
}

nextPage.addEventListener("click", () => {
    currentPage++;
    filterUsers();
});

prevPage.addEventListener("click", () => {
    currentPage--;
    filterUsers();
});

async function getUsers() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to get users");
        }

        users = await response.json();

        filterUsers();
    } catch (error) {
        console.error("Error getting users:", error);
    }
}

getUsers();

