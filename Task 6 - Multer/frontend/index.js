const studentForm = document.getElementById("studentForm");
const firstNameInput = document.getElementById("firstname");
const lastNameInput = document.getElementById("lastname");
const profilePicInput = document.getElementById("profilePic");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const studentsContainer = document.getElementById("studentsContainer");
const searchInput = document.getElementById("searchInput");
const studentCount = document.getElementById("studentCount");
const noStudents = document.getElementById("noStudents");
const formTitle = document.getElementById("formTitle");
const cancelButton = document.getElementById("cancelButton");
const API_URL = "http://localhost:5001/students";
const SERVER_URL = "http://localhost:5001";
let students = [];
let editingStudentId = null;
let selectedImage = null;

loadStudents();

async function loadStudents() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load students");
        }

        students = await response.json();
        console.log(students);
        displayStudents(students);
    } catch (error) {
        console.error(error);
    }
}

studentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstname = firstNameInput.value.trim();
    const lastname = lastNameInput.value.trim();

    if (!firstname || !lastname) {
        return;
    }

    const formData = new FormData();

    formData.append("firstname", firstname);
    formData.append("lastname", lastname);

    if (selectedImage) {
        formData.append("profilePic", selectedImage);
    }

    try {
        if (editingStudentId !== null) {
            const response = await fetch(`${API_URL}/${editingStudentId}`, {
                method: "PUT",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Failed to update student");
            }
        } else {
            const response = await fetch(API_URL, {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Failed to add student");
            }
        }

        await loadStudents();
        resetForm();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

profilePicInput.addEventListener("change", function () {
    const file = profilePicInput.files[0];

    if (!file) {
        return;
    }

    selectedImage = file;

    const reader = new FileReader();

    reader.onload = function (event) {
        imagePreview.src = event.target.result;
        imagePreviewContainer.classList.add("show");
    };

    reader.readAsDataURL(file);
});

searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.trim().toLowerCase();

    const filteredStudents = students.filter(student => {
        const fullName = `${student.firstname} ${student.lastname}`.toLowerCase();

        return fullName.includes(searchValue);
    });

    displayStudents(filteredStudents);
});

function displayStudents(studentsToDisplay) {
    studentsContainer.innerHTML = "";

    studentCount.textContent = `${studentsToDisplay.length} ${
        studentsToDisplay.length === 1 ? "student" : "students"
    }`;

    if (studentsToDisplay.length === 0) {
        noStudents.style.display = "block";
        return;
    }

    noStudents.style.display = "none";

    studentsToDisplay.forEach(student => {
        const card = document.createElement("div");
        card.className = "student-card";

        if (student.profilePic) {
            const image = document.createElement("img");
            image.className = "student-image";
            image.alt = `${student.firstname} ${student.lastname}`;
            image.src = `${SERVER_URL}/uploads/${student.profilePic}`;
            card.appendChild(image);
        }

        const info = document.createElement("div");
        info.className = "student-info";

        const name = document.createElement("h3");
        name.textContent = `${student.firstname} ${student.lastname}`;

        const id = document.createElement("p");
        id.textContent = `Student ID: ${student._id}`;

        info.appendChild(name);
        info.appendChild(id);

        const actions = document.createElement("div");
        actions.className = "student-actions";

        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function () {
            editStudent(student._id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
            deleteStudent(student._id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        card.appendChild(info);
        card.appendChild(actions);

        studentsContainer.appendChild(card);
    });
}

function editStudent(id) {
    const student = students.find(student => student._id === id);

    if (!student) {
        return;
    }

    editingStudentId = id;
    firstNameInput.value = student.firstname;
    lastNameInput.value = student.lastname;
    selectedImage = null;

    if (student.profilePic) {
        imagePreview.src = `${SERVER_URL}/uploads/${student.profilePic}`;
        imagePreviewContainer.classList.add("show");
    } else {
        imagePreview.src = "";
        imagePreviewContainer.classList.remove("show");
    }

    formTitle.textContent = "Update Student";
    studentForm.querySelector(".btn-primary").textContent = "Update Student";
    cancelButton.classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

cancelButton.addEventListener("click", function () {
    resetForm();
});

async function deleteStudent(id) {
    const confirmed = confirm("Are you sure you want to delete this student?");

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete student");
        }

        await loadStudents();
    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function resetForm() {
    studentForm.reset();
    editingStudentId = null;
    selectedImage = null;
    imagePreview.src = "";
    imagePreviewContainer.classList.remove("show");
    formTitle.textContent = "Add Student";
    studentForm.querySelector(".btn-primary").textContent = "Add Student";
    cancelButton.classList.add("hidden");
}
