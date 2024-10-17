let taskList = [];

// Rendering the task list on load
$(document).ready(function () {
    console.log('Document ready');
    renderTaskList();
});

// Render tasks from taskList
function renderTaskList() {
    console.log('Rendering task list...', taskList);
    $('#to-do-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    taskList.forEach(task => {
        renderTask(task);
    });
}

// Render a single task
function renderTask(task) {
    const taskCard = $(`<div class="task-card" draggable="true" data-id="${task.id}">
                            <h5>${task.name}</h5>
                            <p>${task.description}</p>
                            <p>Deadline: ${task.deadline}</p>
                            <button class="btn btn-danger btn-sm delete-task">Delete</button>
                        </div>`);
    
    taskCard.on('dragstart', (event) => {
        event.originalEvent.dataTransfer.setData('text/plain', task.id);
    });

    taskCard.on('dragend', (event) => {
        event.preventDefault();
    });

    $('#to-do-cards').append(taskCard);
}

// Add a new task
$('#taskForm').on('submit', function (event) {
    event.preventDefault();
    const newTask = {
        id: taskList.length + 1,
        name: $('#taskName').val(),
        description: $('#taskDescription').val(),
        deadline: $('#taskDeadline').val(),
    };
    
    taskList.push(newTask);
    console.log('Updated taskList:', taskList);
    renderTaskList();
    $('#formModal').modal('hide');
    this.reset();
});

// Handle deleting a task
$(document).on('click', '.delete-task', function () {
    const taskId = $(this).closest('.task-card').data('id');
    taskList = taskList.filter(task => task.id !== taskId);
    renderTaskList();
});

// Allow dropping on columns
$('.task-list').on('dragover', (event) => {
    event.preventDefault();
});

// Handle dropping tasks
$('.task-list').on('drop', (event) => {
    event.preventDefault();
    const taskId = event.originalEvent.dataTransfer.getData('text/plain');
    const task = taskList.find(t => t.id == taskId);

    // Append the dragged task to the new column
    if (task) {
        const target = $(event.target).closest('.task-list'); // Get the closest task list
        target.append($(`.task-card[data-id="${task.id}"]`)); // Move the task card to the new column
    }
});
