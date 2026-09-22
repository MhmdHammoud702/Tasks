let firstname = document.getElementById("fname");
let firstval = document.getElementById('firstname-val');
let lastname = document.getElementById("lname");
let lastval = document.getElementById('lastname-val');
let gender = document.getElementById("gender");
let button = document.getElementById("button");
const sortFirstname = document.getElementById("sort-firstname");
const sortLastname = document.getElementById("sort-lastname");
const sortGender = document.getElementById("gendersort");
const firstnameArrow = document.getElementById("farrow");
const lastnameArrow = document.getElementById("larrow");
const searchblock = document.getElementById('searchblock');
const searchbox = document.getElementById('searchbox');
const tableBody = document.getElementById("tbody");
const table = document.getElementById("table");
const clear = document.getElementById("clear");
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
let exists = document.getElementById('exists');
let seconds = 60
let timer = document.getElementById('timer');
let count = document.getElementById('count');
let males = document.getElementById('males');
let females = document.getElementById('females');
let currentPage = 1;
const usersPerPage = 5;
localStorage.removeItem("users");
let users = JSON.parse(localStorage.getItem("users")) || [];
let filteredUsers = users;
let selectedGender = "";
let searchValue = "";
let UserId = null;
let firstnameAsc = null;
let lastnameAsc = null;


if(users.length == 0){
    table.style.display= "none";
    searchblock.style.display= "none";
    document.getElementById('show').style.display = "none"
    count.textContent = 0;
    females.textContent = 0;
    males.textContent = 0
}

const normalize = (string) =>
    string.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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
    if(firstname.value.trim() != ""){
        if(firstname.value.length >= 2 && !/[0-9]/.test(firstname.value)){
            firstval.textContent="";
        }else if(firstname.value.length < 2 && /[0-9]/.test(firstname.value)){
            firstval.textContent="Firstname should be at least 2 characters and without numbers";
            
        }else if(firstname.value.length < 2){
            firstval.textContent="Firstname should be at least 2 characters";
            
        }else{
            firstval.textContent="Firstname should not contain numbers";
        }
    }else {
        firstval.textContent = "";
    }
    if(lastname.value.trim() != ""){
        if(lastname.value.length >= 2 && !/[0-9]/.test(lastname.value)){
            lastval.textContent="";
        }else if(lastname.value.length < 2 && /[0-9]/.test(lastname.value)){
            lastval.textContent="Lastname should be at least 2 characters and without numbers";
            
        }else if(lastname.value.length < 2){
            lastval.textContent="Lastname should be at least 2 characters";
            
        }else{
            lastval.textContent="Lastname should not contain numbers";
        }
    }else {
        lastval.textContent = "";
    }
    if (
        firstname.value.trim() !== "" &&
        firstval.textContent == "" &&
        lastname.value.trim() !== "" &&
        lastval.textContent == "" &&
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
    }
    else if (firstnameAsc === false) {
        filteredUsers.sort((a, b) => {
            return b.firstname.localeCompare(a.firstname);
        });
    }

    if (lastnameAsc === true) {
        filteredUsers.sort((a, b) => {
            return a.lastname.localeCompare(b.lastname);
        });
    }
    else if (lastnameAsc === false) {
        filteredUsers.sort((a, b) => {
            return b.lastname.localeCompare(a.lastname);
        });
    }
    if (reset) {
        currentPage = 1;
    }
    displayUsers(filteredUsers);
}


sortGender.addEventListener('change',()=>{
    selectedGender = sortGender.value;
    filterUsers(true);
})


sortFirstname.addEventListener("click", function () {
    firstnameAsc = firstnameAsc === true ? false : true;
    lastnameAsc = null
    lastnameArrow.textContent = "";

    if(firstnameAsc  === true){
        firstnameArrow.textContent = "⬆️";
    }
    else if(firstnameAsc  === false){
        firstnameArrow.textContent = "⬇️";
    }

    filterUsers(true);
});


sortLastname.addEventListener("click", function () {
    lastnameAsc = lastnameAsc === true ? false : true;
    firstnameAsc = null;
    firstnameArrow.textContent = "";

    if(lastnameAsc  === true){
        lastnameArrow.textContent = "⬆️";
    }
    else if(lastnameAsc  === false){
        lastnameArrow.textContent = "⬇️";
    }

    filterUsers(true);
});


searchbox.addEventListener("input", function () {
    filterUsers(true);
});


button.addEventListener("click", function () {
    if(firstname.value.length < 2){
        firstval.style.display="block";
        return;
    }
    if(lastname.value.length < 2){
        lastval.style.display="block";
        return;
    }
    const alreadyExists = users.find(exist=> normalize(exist.firstname) == normalize(firstname.value) && normalize(exist.lastname)==normalize(lastname.value));
    if(alreadyExists){
        exists.style.display ="block";
        return;
    }else{
        exists.style.display ="none";
        const user = {
            id: crypto.randomUUID(),
            firstname: firstname.value,
            lastname: lastname.value,
            gender: gender.value
        };
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        sortGender.value= "";
        displayUsers();
        firstname.value="";
        lastname.value="";
        gender.value="";
        checkfields();
    }
});

clear.addEventListener("click",()=>{
    let confirm = window.confirm("are you sure you want to clear all users?");
    if(confirm){
    users = [];
    localStorage.removeItem("users");
    displayUsers();
    }
});

function displayUsers(Users = users){
    if (users.length != 0) {
        searchblock.style.display = "block";
        document.getElementById('show').style.display = "block"

    } else {
        searchblock.style.display = "none";
        document.getElementById('show').style.display = "none"
    }


    if (Users.length != 0 || searchbox.value.length !=0 ) {
        table.style.display = "table";
    } else {
        table.style.display = "none";
    }

    count.textContent = users.length;
    const malescount = users.filter(user => user.gender === "Male");
    const femalescount = users.filter(user => user.gender === "Female");
    males.textContent = malescount.length;
    females.textContent = femalescount.length;
    tableBody.innerHTML = "";
    const pages = Math.ceil(Users.length / usersPerPage);
    if(currentPage == pages || pages == 0){
        nextPage.disabled = true;
    }else{
        nextPage.disabled = false;
    }
    if(currentPage == 1){
        prevPage.disabled = true;
    }else{
        prevPage.disabled = false;
    }
    const paginationbuttons = document.getElementById('paginationButtons');
    paginationbuttons.innerHTML ="";
    
    for(let i=1 ; i<=pages ; i++){        
            const buttonPag = document.createElement('button');       
            buttonPag.textContent= i;         
            if(currentPage == i ){
                buttonPag.classList.add('pag')
            }else{
                buttonPag.classList.add('pagButton');
            }
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
        `;

            const ActionCell = document.createElement("td");

            //delete sectionnnnn
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function () {
                const duser = users.find(item => item.id == user.id);
                if(window.confirm(`are you sure you want to delete ${duser.firstname + " " + duser.lastname}?`)){
                users = users.filter(item => item.id !== user.id);
                localStorage.setItem("users", JSON.stringify(users));
                searchbox.value="";
                displayUsers();
            }else{
                return;
            }
            });

            ActionCell.appendChild(deleteButton);


            //edit sectionnnn
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", function () {

                const editing = document.querySelector('.save');
                if(editing && editing != editButton){
                    editing.classList.remove('save');
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

nextPage.addEventListener('click',()=>{
    currentPage++
    filterUsers()
})

prevPage.addEventListener('click',()=>{
    currentPage--;
    filterUsers()
})