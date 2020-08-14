// Index
// ______
//
// taskDataObj - if/else statement inside of the taskFormHandler function.
//


// Pseudocode/Code-Decryption
// __________________________
//  -----------------------
//
//  formEl {
//      "formEl" is defined at the top of the script. It is a variable with a selector, querySelector(). It selects the HTML <form> element via its ID
//      "#task-form".
//      ... A submit event listener is then attached to "formEl". This is located between the createTaskActions function and the editTasks function.
//      ... The default legacy "auto-refresh" behavior of the submit event is then prevented, via the preventDefault() method, used in 
//      the "taskFormHandler" event-handling function.
//  }
//  {
//      taskId -> data-task-id -> taskIdCounter
//  }



var tasks = [];
var taskIdCounter = 0;

// DOM element variables
var pageContentEl = document.querySelector("#page-content");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

// form handling function
var taskFormHandler = function(event) {

    // prevents page from refreshing upon submitting form input
    event.preventDefault();

    // set name value
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    // set type value
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    // reset task input field
    formEl.reset();

    // checks to see if task form has data attribute "data-task-id", thus checking if the form is editing a task
    var isEdit = formEl.hasAttribute("data-task-id");

    // if formEl carries data attribute, get task id, and call function used to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // if no data attribute, then create a new object. then, pass to createTaskEl function.
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        // initiate createTaskEl, sending taskDataObj as an argument to createTaskEl.
        createTaskEl(taskDataObj);
    }

    // this way, createTaskEl() will only get called if -isEdit- is -false-. If it's true, we'll call a new function, completeEditTask(), passing it three arguments: the name input value, type input value, and task ID.
};

// select task being edited and set new values to it
var completeEditTask = function(taskName, taskType, taskId) {
    
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    }

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
}

// task object-creating
var createTaskEl = function(taskDataObj) {
    
    console.log(taskDataObj);
    console.log(taskDataObj.status);

    // create list item
    // first step done of this assignment
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // the custom data attribute (format: ⭐data-attribute-name⭐ ... the attribute value can be any string [no caps].) data-task-id is set to the value of taskIdCounter.
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // make task item draggable
    listItemEl.setAttribute("draggable", "true");

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // add entire list item to list
    // second step done of this assignment
    tasksToDoEl.appendChild(listItemEl);

    // increment task counter for next unique id
    taskIdCounter++;
}

var createTaskActions = function(taskId) {

    // create a container for the other elements
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    // create dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i=0; i < statusChoices.length; i++) {
        
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var editTask = function(taskId) {

    // log the unique taskIdCounter value to the console
    console.log("editing task #" + taskId);

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name
    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    // get content from task type
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
}

var deleteTask = function(taskId) {

    // log the unique taskIdCounter value to the console
    console.log(taskId);

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
};

var taskButtonHandler = function(event) {

    // get target element from event
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    // delete button was clicked
    else if (event.target.matches(".delete-btn")) {
        // get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function(event) {

    console.log(event.target);

    console.log(event.target.getAttribute("data-task-id"));

    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(tasksSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update tasks in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (Tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    console.log(tasks);
};

var dragTaskHandler = function(event) {

    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);

    var getId = event.dataTransfer.getData("text/plain");
    console.log("getId:", getId, typeof getId);
};

var dropZoneDragHandler = function(event) {

    // the -closest- method searches up from the targeted elements to find a class "task-list".
    var taskListEl = event.target.closest(".task-list");

    // if the target contains the task-list class or is a child of it, then return the DOM element, which will evaluate to a truthy value.
    if (taskListEl) {

        // prevent the default dragevent behavior of preventing elements from being dropped onto one another, thus allowing elements to be dropped onto one another.
        event.preventDefault();

        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};

var dropTaskHandler = function(event) {

    var id = event.dataTransfer.getData("text/plain");

    var draggableElement = document.querySelector("[data-task-id='" + id + "']");

    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;

    // set status of task based on dropZone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    };

    dropZoneEl.removeAttribute("style");

    dropZoneEl.appendChild(draggableElement);

    // loop through tasks array to find and update the updated task's status
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    }

    console.log(tasks);
};

var dragLeaveHandler = function(event) {
    
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

// pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);

pageContentEl.addEventListener("dragstart", dragTaskHandler);

pageContentEl.addEventListener("dragover", dropZoneDragHandler);

pageContentEl.addEventListener("drop", dropTaskHandler);

pageContentEl.addEventListener("dragleave", dragLeaveHandler);