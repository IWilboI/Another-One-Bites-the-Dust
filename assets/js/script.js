// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
let nextId = JSON.parse(localStorage.getItem('nextId')) || 1;

// Function to generate a unique task ID
function generateTaskId() {
  const currentId = nextId++;
  localStorage.setItem('nextId', JSON.stringify(nextId));
  return currentId;
}

// Create task card with color coding for deadlines
function createTaskCard(task) {
  const isOverdue = dayjs(task.deadline).isBefore(dayjs(), 'day');
  const isNearDeadline = dayjs(task.deadline).diff(dayjs(), 'day') <= 2;
  const cardClass = isOverdue ? 'overdue' : isNearDeadline ? 'near-deadline' : '';

  return `
    <div id="task-${task.id}" class="card mb-3 ${cardClass}" style="cursor: move;">
      <div class="card-body">
        <h5 class="card-title">${task.name}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text"><small>Deadline: ${task.deadline}</small></p>
        <button class="btn btn-danger btn-sm delete-task" data-task-id="${task.id}">Delete</button>
      </div>
    </div>
  `;
}

// Render tasks
function renderTaskList() {
  $('#todo-cards, #in-progress-cards, #done-cards').empty();

  taskList.forEach(task => {
    const taskCard = createTaskCard(task);
    $(`#${task.status}-cards`).append(taskCard);
  });

  $('.delete-task').click(handleDeleteTask);
  $('.card').draggable({ revert: 'invalid', helper: 'clone' });
}

// Add a new task
function handleAddTask(event) {
  event.preventDefault();

  const newTask = {
    id: generateTaskId(),
    name: $('#taskName').val(),
    description: $('#taskDescription').val(),
    deadline: $('#taskDeadline').val(),
    status: 'to-do'
  };

  taskList.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();

  $('#taskForm')[0].reset();
  $('#formModal').modal('hide');
}

// Delete a task
function handleDeleteTask(event) {
  const taskId = $(event.target).data('task-id');
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}

// Update task status on drop
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr('id').split('-')[1];
  const newStatus = $(event.target).closest('.lane').attr('id');
  const taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));
  taskList[taskIndex].status = newStatus;
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}

// Initialize
$(document).ready(() => {
  renderTaskList();

  $('#taskForm').submit(handleAddTask);

  $('.lane').droppable({
    accept: '.card',
    drop: handleDrop
  });
});
