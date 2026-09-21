let firstname = document.getElementById("fname");
let lastname = document.getElementById("lname");
let gender = document.getElementById("gender");
let button = document.getElementById("button");
const tableBody = document.getElementById("tbody");
let seconds = 60
let timer = document.getElementById('timer');
localStorage.removeItem("users");
let users = JSON.parse(localStorage.getItem("users")) || [];

const countdown = setInterval(() => {
        seconds--;

        timer.textContent = seconds;

        if (seconds <= 0) {
            users = [];
            localStorage.removeItem("users");
            displayUsers()
            timer.textContent = "60";
            seconds = 60;
        }
}, 1000);

function checkfields() {
    if (
        firstname.value.trim() !== "" &&
        lastname.value.trim() !== "" &&
        gender.value !== ""
    ) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

firstname.addEventListener("input", checkfields);
lastname.addEventListener("input", checkfields);
gender.addEventListener("change", checkfields);


button.addEventListener("click", function () {
    const user = {
        firstname: firstname.value,
        lastname: lastname.value,
        gender: gender.value
    };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    displayUsers();
    firstname.value="";
    lastname.value="";
    gender.value="";
    checkfields();
});

function displayUsers() {
    tableBody.innerHTML = "";

    users.forEach((user, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.gender}</td>
        `;

            const deleteCell = document.createElement("td");

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {
                users.splice(index, 1);
                localStorage.setItem("users", JSON.stringify(users));
                displayUsers();
            });

            deleteCell.appendChild(deleteButton);
            row.appendChild(deleteCell);
        

        tableBody.appendChild(row);
    });
}