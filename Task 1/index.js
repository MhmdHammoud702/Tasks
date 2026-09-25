let firstname = document.getElementById("fname");
let firstval = document.getElementById('firstname-val');
let lastname = document.getElementById("lname");
let lastval = document.getElementById('lastname-val');
let gender = document.getElementById("gender");
let button = document.getElementById("button");
const sortFirstname = document.getElementById("sort-firstname");
const sortLastname = document.getElementById("sort-lastname");
const sortGender = document.getElementById("sort-gender");
const firstnameArrow = document.getElementById("farrow");
const lastnameArrow = document.getElementById("larrow");
const genderArrow = document.getElementById("garrow");
const searchblock = document.getElementById('searchblock');
const searchbox = document.getElementById('searchbox');
const tableBody = document.getElementById("tbody");
const table = document.getElementById("table");
let seconds = 60
let timer = document.getElementById('timer');
localStorage.removeItem("users");
let users = JSON.parse(localStorage.getItem("users")) || [];
let UserId = null;
let firstnameAsc = true;
let lastnameAsc = true;
let genderAsc = true;
lastval.style.display="none";
firstval.style.display="none";

if(users.length == 0){
    table.style.display= "none";
    searchblock.style.display= "none";
}

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
    const editing = document.querySelector(".save");
    if(firstname.value.length >= 3){
        firstval.style.display="none";
    }
    if(lastname.value.length >= 3){
        lastval.style.display="none";
    }
    if (
        firstname.value.trim() !== "" &&
        lastname.value.trim() !== "" &&
        gender.value !== "" &&
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

sortFirstname.addEventListener("click", function () {
    firstnameAsc = !firstnameAsc;
    users.sort((a, b) => {
        const result = a.firstname.localeCompare(b.firstname);
        return firstnameAsc ? result : -result;
    });
    firstnameArrow.textContent = firstnameAsc ? "↑" : "↓";
    displayUsers();
});

sortLastname.addEventListener("click", function () {
    lastnameAsc =! lastnameAsc;
    users.sort((a, b) => {
        const result = a.lastname.localeCompare(b.lastname);
        return lastnameAsc ? result : -result;
    });
    lastnameArrow.textContent = lastnameAsc ? "↑" : "↓";
    displayUsers();
});

sortGender.addEventListener("click", function () {
    genderAsc =! genderAsc;
    users.sort((a, b) => {
        const result = a.gender.localeCompare(b.gender);
        return genderAsc ? result : -result;
    });
    genderArrow.textContent = genderAsc ? "↑" : "↓";
    displayUsers();
});

searchbox.addEventListener("input", function () {
    const searchValue = searchbox.value.toLowerCase().trim();

    const filteredUsers = users.filter(user =>
        user.firstname.toLowerCase().includes(searchValue) ||
        user.lastname.toLowerCase().includes(searchValue) ||
        user.gender.toLowerCase().includes(searchValue)
    );

    displayUsers(filteredUsers);
});



button.addEventListener("click", function () {
    if(firstname.value.length < 3){
        firstval.style.display="block";
        return;
    }else{
        firstval.style.display="none";
    }
    if(lastname.value.length < 3){
        lastval.style.display="block";
        return;
    }else{
        lastval.style.display="none";
    }
    const user = {
        id: crypto.randomUUID(),
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


function displayUsers(Users = users){
    if (users.length != 0) {
        searchblock.style.display = "block";
    } else {
        searchblock.style.display = "none";
    }


    if (Users.length != 0 || searchbox.value.length !=0 ) {
        table.style.display = "table";
    } else {
        table.style.display = "none";
    }

    tableBody.innerHTML = "";

    Users.forEach((user) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.gender}</td>
        `;

            const ActionCell = document.createElement("td");

            //delete section
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {
                users = users.filter(item => item.id !== user.id);
                localStorage.setItem("users", JSON.stringify(users));
                searchbox.value="";
                displayUsers();
            });

            ActionCell.appendChild(deleteButton);


            //edit section
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", function () {

                const editing = document.querySelector('.save');
                if(editing && editing != editButton){
                    editing.classList.remove();
                    editing.textContent="Edit"
                }


                const selectedUser = users.find(item => item.id === user.id);

                if (editButton.classList.contains("save")) {

                    selectedUser.firstname = firstname.value;
                    selectedUser.lastname = lastname.value;
                    selectedUser.gender = gender.value;

                    localStorage.setItem("users", JSON.stringify(users));

                    editButton.classList.remove("save");
                    editButton.textContent = "Edit";
            
                    displayUsers();

                    firstname.value = "";
                    lastname.value = "";
                    gender.value = "";

                    return;
                }

                firstname.value = selectedUser.firstname;
                lastname.value = selectedUser.lastname;
                gender.value = selectedUser.gender;

                editButton.classList.add("save");
                editButton.textContent = "Save";
            });

            ActionCell.appendChild(editButton);

            row.appendChild(ActionCell);

        tableBody.appendChild(row);
    });
}