// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Generate a unique task id
function generateTaskId() {
  const currentId = nextId;
  nextId++;
  localStorage.setItem("nextId", JSON.stringify(nextId));
  return currentId;
}

// Create a task card with color coding based on the deadline
function createTaskCard(task) {
  const deadline = dayjs(task.deadline);
  const today = dayjs();
  let bgColor = '';

  if (deadline.isBefore(today, 'day')) {
    bgColor = 'bg-danger text-white'; // Overdue
  } else if (deadline.diff(today, 'day') <= 2) {
    bgColor = 'bg-warning'; // Nearing deadline
  }

  return `
    <div id="task-${task.id}" class="card mb-3 task-card ${bgColor}" style="cursor: move;">
      <div class="card-body">
        <h5 class="card-title">${task.name}</h5>
        <p class="card-text">${task.description}</p>
        <p class="card-text"><small>Deadline: ${task.deadline}</small></p>
        <button class="btn btn-danger btn-sm delete-task" data-task-id="${task.id}">Delete</button>
      </div>
    </div>
  `;
}

// Render the task list and make tasks draggable
function renderTaskList() {
  $('#todo-cards, #in-progress-cards, #done-cards').empty();

  taskList.forEach(task => {
    const taskCard = createTaskCard(task);
    $(`#${task.status}-cards`).append(taskCard);
  });

  $('.task-card').draggable({
    revert: "invalid",
    helper: "clone"
  });

  $('.delete-task').click(handleDeleteTask);
}

// Handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const taskName = $('#taskName').val();
  const taskDescription = $('#taskDescription').val();
  const taskDeadline = $('#taskDeadline').val();

  const newTask = {
    id: generateTaskId(),
    name: taskName,
    description: taskDescription,
    deadline: taskDeadline,
    status: 'to-do'
  };

  taskList.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();

  $('#taskForm')[0].reset();
  $('#formModal').modal('hide');
}

// Handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(event.target).data('task-id');
  taskList = taskList.filter(task => task.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}

// Handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.attr('id').split('-')[1];
  const newStatus = $(event.target).closest('.lane').attr('id');
  const taskIndex = taskList.findIndex(task => task.id == taskId);
  taskList[taskIndex].status = newStatus;
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}

$(document).ready(() => {
  renderTaskList();
  $('#taskForm').submit(handleAddTask);

  $('.lane').droppable({
    accept: '.task-card',
    drop: handleDrop
  });
});
