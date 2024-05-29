// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    return`
    <div class ="card mb-3" id="task-${task.id}">
        <dic class="card-body">
            <h5 class="card-title">${task.name}</h5>
            <p class="card-text">${task.description}</p>
        </div>
    </div>
    `;   
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        $(`#${task.status}-cards`).append(taskCard);
      });
    
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault(); 

   
    const taskName = $('#taskName').val();
    const taskDescription = $('#taskDescription').val();
  
    
    const newTask = {
      id: generateTaskId(),
      name: taskName,
      description: taskDescription,
      status: 'to-do' 
    };
  
   
    taskList.push(newTask);
  
    
    localStorage.setItem('tasks', JSON.stringify(taskList));
  
 
    renderTaskList();
  
    
    $('#taskName').val('');
    $('#taskDescription').val('');
  }


// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(event.target).closest('.card').attr('id').split('-')[1];
    taskList = taskList.filter(task => task.id !== parseInt(taskId));
    localStorage.setItem('tasks', JSON.stringify(taskList));
    $(event.target).closest('.card').remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr('id').split('-')[1];
    const newStatus = $(event.target).closest('.lane').attr('id');
    const taskIndex = taskList.findIndex(task => task.id === parseInt(taskId));
    taskList[taskIndex].status = newStatus;
    localStorage.setItem('tasks', JSON.stringify(taskList));
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    taskList = JSON.parse(localStorage.getItem('tasks')) || [];
    nextId = JSON.parse(localStorage.getItem('nextId')) || 1;
  
    renderTaskList();
  
   
    $('#taskForm').submit(handleAddTask);
  

    $('.lane').droppable({
      accept: '.card',
      drop: handleDrop
    });
});
