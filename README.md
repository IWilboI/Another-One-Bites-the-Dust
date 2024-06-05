# Another-One-Bites-the-Dust

## User Story

```md
AS a bootcamp student with many homework assignments to organize
I WANT a task board to order porjects and tasks
SO THAT I can add individual project tasks, manage their state of progress and track overall project progress accordingly
```

## Acceptance Criteria

```md
GIVEN a task board to manage homework or a project
WHEN I open the task board
THEN the list of projects and homework tasks are displayed in columns representing the task progress state (Not Yet Started, In Progress, Completed)
WHEN I view the task board for the project or homework
THEN each task is color coded to indicate whether it is nearing the deadline (yellow) or is overdue (red)
WHEN I click on the button to define a new task
THEN I can enter the title, description and deadline date for the new task into a modal dialog
WHEN I click the save button for that task
THEN the properties for that task are saved in localStorage
WHEN I drag a task to a different progress column
THEN the task's progress state is updated accordingly and will stay in the new column after refreshing
WHEN I click the delete button for a task
THEN the task is removed from the task board and will not be added back after refreshing
WHEN I refresh the page
THEN the saved tasks persist


"C:\Users\Owner\OneDrive\Pictures\Coding Pics\BootCamp Pics\Task Board - Google Chrome 6_4_2024 6_45_16 PM.png"
