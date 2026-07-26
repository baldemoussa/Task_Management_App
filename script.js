let taskList = [];

const taskNameInput = document.getElementById("task-name");
const taskCategoryInput = document.getElementById("task-category");
const taskDeadlineInput = document.getElementById("task-deadline");
const taskStatusInput = document.getElementById("task-status");
const addTaskButton = document.getElementById("add-task-button");
const clearTaskButton = document.getElementById("clear-task-button");
const filterCategoryInput = document.getElementById("filter-category");
const filterStatusInput = document.getElementById("filter-task-status");
const purgeButton = document.getElementById("purge-button");
const taskListContainer = document.getElementById("task-list-container");
const confirmation = document.getElementById("confirmation-message");
//-------------------------------------------------//
//-- 1. Adding New Tasks into an Array as Objects --//
//-------------------------------------------------//
let task = {
    id: new Date().getTime(),
    name: taskNameInput.value,
    category: taskCategoryInput.value,
    deadline: taskDeadlineInput.value,
    status: taskStatusInput.value,
}

function addTask() {
    task = {
        id: new Date().getTime(),
        name: taskNameInput.value.toUpperCase(),
        category: taskCategoryInput.value.toUpperCase(),
        deadline: taskDeadlineInput.value,
        status: taskStatusInput.value,
    }
    taskList.push(task);
    saveTasksToLocalStorage();
    confirmation.innerHTML = "";
    const message = document.createElement("strong");
    message.innerHTML = `Task <u>${task.name}</u> added successfully!`;
    confirmation.appendChild(message);
    refreshTaskListAnddisplay()
}



//---------------------------------//
//-- 5. Persisting Task Data     --//
//--     with Local Storage      --//
//---------------------------------//
function saveTasksToLocalStorage() {
    localStorage.setItem("taskList", JSON.stringify(taskList));
}

//---------------------------------//
//-- Getting Tasks from    --//
//      Local Storage           --//
//---------------------------------//
function getTasksFromLocalStorage() {
    if ((taskList.length === 0) && (localStorage.getItem("taskList") !== undefined && localStorage.getItem("taskList") !== null)) {
        taskList = JSON.parse(localStorage.getItem("taskList"));
    }
}

//---------------------------------//
//-- Checking Overdue Tasks   --//
//---------------------------------//
function checkOverdueTasks() {
    const today = new Date().toISOString().split('T')[0];
    let updated = false;
    taskList.forEach(task => {
        if (task.deadline && task.deadline < today && task.status !== "Completed" && task.status !== "Overdue") {
            task.status = "Overdue";
            updated = true;
        }
    });
    if (updated) {
        saveTasksToLocalStorage();
    }
}

//---------------------------------//
//-- Displaying the Task List     --//
//---------------------------------//
function refreshTaskListAnddisplay() {
    getTasksFromLocalStorage();
    checkOverdueTasks();

    // If the message doesn't say a task was just added, update the task count
    if (!confirmation.innerHTML.includes("added successfully")) {
        if (taskList.length > 0) {
            confirmation.innerHTML = `<strong>You currently have <u>${taskList.length}</u> task(s) in your list.</strong>`;
        } else {
            confirmation.innerHTML = "";
        }
    }

    //hide components if taskList is empty
    if (taskList.length === 0) {
        taskListContainer.style.display = "none";
    } else {
        taskListContainer.style.display = "block";
    }

    const taskListBody = document.getElementById("task-list");
    taskListBody.innerHTML = "";
    filteredTaskList().forEach((task) => {
        const row = document.createElement("tr");
        const bgColor = task.status === "Overdue" ? "red" : (task.status === "Completed" ? "green" : "");
        row.innerHTML = `
            <td style="background-color: ${bgColor}">${task.name}</td>
            <td style="background-color: ${bgColor}">${task.category}</td>
            <td style="background-color: ${bgColor}">${task.deadline}</td>
            <td style="background-color: ${bgColor}">
            <select class="form-select" aria-label="Default select example" required onchange="updateTaskStatus(${task.id}, this.value)">
                <option value="Open" ${task.status === "Open" ? "selected" : ""} >Open</option>
                <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
                <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
                <option value="Overdue" ${task.status === "Overdue" ? "selected" : ""}>Overdue</option>
            </select>
            </td>
            <td class="text-center" style="background-color: ${bgColor}"><button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})">X</button></td>
        `;

        taskListBody.appendChild(row);
    });
}

//---------------------------------//    
//-- 3. Deleting a Task        --//
//---------------------------------//
function deleteTask(id) {
    taskList = taskList.filter(task => task.id !== id);
    saveTasksToLocalStorage();
    refreshTaskListAnddisplay();
}

//---------------------------------//    
//-- 3. Updating Task Status      --//
//---------------------------------//
function updateTaskStatus(id, newStatus) {
    taskList = taskList.map(task => task.id === id ? { ...task, status: newStatus } : task);
    saveTasksToLocalStorage();
    refreshTaskListAnddisplay();
}

//---------------------------------//    
//-- 4. Filtering Tasks List     --//  
//---------------------------------//
function filteredTaskList() {
    const filterCategory = filterCategoryInput.value.toLowerCase();
    const filterStatusFilter = filterStatusInput.value.toLowerCase();
    return taskList.filter(task => {
        const matchesCategory = filterCategory === "" || task.category.toLowerCase().includes(filterCategory);
        const matchesStatus = filterStatusFilter === "" || task.status.toLowerCase().includes(filterStatusFilter);
        return matchesCategory && matchesStatus;
    });
}

refreshTaskListAnddisplay();

//---------------------------------//    
//-- 6. Event Listeners          --//  
//---------------------------------//

purgeButton.addEventListener("click", (event) => {
    event.preventDefault();
    taskList = []; // Clear the array
    saveTasksToLocalStorage(); // Save the empty array to local storage
    confirmation.innerHTML = ""; // Clear any messages
    refreshTaskListAnddisplay(); // Refresh the task list
});

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask();
    taskForm.reset(); // Optional: clears the form after successful submission
});

filterCategoryInput.addEventListener("input", refreshTaskListAnddisplay);
filterStatusInput.addEventListener("change", refreshTaskListAnddisplay);
