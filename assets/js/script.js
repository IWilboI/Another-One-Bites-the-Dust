// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Create a function to generate a unique task id
function generateTaskId() {
    const currentId = nextId;
    nextId++;
    localStorage.setItem('nextId', JSON.stringify(nextId));
    return currentId;
}

// JavaScript for Modal
function createTaskCard(task) {
    return `
      <div id="task-${task.id}" class="card mb-3" style="cursor: move;">
        <div class="card-body">
          <h5 class="card-title">${task.name}</h5>
          <p class="card-text">${task.description}</p>
          <button class="btn btn-danger btn-sm delete-task" data-task-id="${task.id}">Delete</button>
        </div>
      </div>
    `;
}

// Create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        $(`#${task.status}-cards`).append(taskCard);
    });

    $(".card").draggable({
        revert: "invalid",
        helper: "clone"
    });

    $(".delete-task").click(handleDeleteTask);
}

// Create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    console.log('Form submitted');

    const taskName = $('#taskName').val();
    const taskDescription = $('#taskDescription').val();

    console.log('Task Name:', taskName);
    console.log('Task Description:', taskDescription);

    const newTask = {
        id: generateTaskId(),
        name: taskName,
        description: taskDescription,
        status: 'to-do'
    };

    taskList.push(newTask);
    console.log('New Task:', newTask);

    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList();

    $('#taskName').val('');
    $('#taskDescription').val('');

    $('#formModal').modal('hide');
}

// Create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).data('task-id');
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// Create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr('id').split('-')[1];
    const newStatus = $(event.target).closest('.lane').attr('id');
    const taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));
    taskList[taskIndex].status = newStatus;
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
}

// When the page loads, render the task list, add event listeners, make lanes droppable
$(document).ready(function () {
    renderTaskList();

    $('#taskForm').submit(handleAddTask);

    $('.lane').droppable({
        accept: '.task-card',
        drop: handleDrop
    });
});