// Get DOM elements
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const allFilter = document.getElementById("all");
const completedFilter = document.getElementById("completed");
const pendingFilter = document.getElementById("pending");

// Task array that will be saved in localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to display tasks
function displayTasks(tasksToDisplay) {
  taskList.innerHTML = '';  // Clear the list before re-rendering
  tasksToDisplay.forEach(task => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    if (task.completed) {
      taskItem.classList.add("completed");
    }

    taskItem.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button class="editBtn" data-id="${task.id}">Edit</button>
        <button class="completeBtn" data-id="${task.id}">${task.completed ? "Undo" : "Complete"}</button>
        <button class="deleteBtn" data-id="${task.id}">Delete</button>
      </div>
    `;
    taskList.appendChild(taskItem);
  });

  // Attach event listeners for the buttons
  document.querySelectorAll('.editBtn').forEach(button => {
    button.addEventListener('click', handleEdit);
  });
  document.querySelectorAll('.completeBtn').forEach(button => {
    button.addEventListener('click', handleComplete);
  });
  document.querySelectorAll('.deleteBtn').forEach(button => {
    button.addEventListener('click', handleDelete);
  });
}

// Function to add task
function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') return;

  const newTask = {
    id: Date.now(), // Unique ID based on timestamp
    text: taskText,
    completed: false
  };

  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = '';  // Clear input field
  displayTasks(tasks);   // Re-render tasks
}

// Function to edit a task
function handleEdit(event) {
  const taskId = parseInt(event.target.getAttribute('data-id'));
  const task = tasks.find(t => t.id === taskId);
  const newText = prompt("Edit Task:", task.text);

  if (newText !== null && newText.trim() !== '') {
    task.text = newText.trim();
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks(tasks);  // Re-render tasks
  }
}

// Function to mark task as complete or undo
function handleComplete(event) {
  const taskId = parseInt(event.target.getAttribute('data-id'));
  const task = tasks.find(t => t.id === taskId);
  task.completed = !task.completed;  // Toggle completion
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks(tasks);  // Re-render tasks
}

// Function to delete a task
function handleDelete(event) {
  const taskId = parseInt(event.target.getAttribute('data-id'));
  tasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks(tasks);  // Re-render tasks
}

// Filter tasks based on selected filter
function filterTasks(status) {
  let filteredTasks = tasks;

  if (status === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (status === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  displayTasks(filteredTasks);
}

// Event listeners
addTaskButton.addEventListener('click', addTask);
allFilter.addEventListener('click', () => filterTasks('all'));
completedFilter.addEventListener('click', () => filterTasks('completed'));
pendingFilter.addEventListener('click', () => filterTasks('pending'));

// Initial display of tasks
displayTasks(tasks);
