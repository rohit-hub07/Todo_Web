const inputVal = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const ul = document.getElementById("ul-element");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
tasks.forEach(renderTask);

addBtn.addEventListener("click", function () {
  const val = inputVal.value.trim();
  if (!val) return;

  const taskObj = { text: val, completed: false };
  tasks.push(taskObj);
  saveTasks();
  renderTask(taskObj);

  inputVal.value = "";
});

function renderTask(taskObj, idx) {
  const task = document.createElement("li");
  task.className = "todo-item";
  if (taskObj.completed) task.classList.add("completed");

  const textSpan = document.createElement("span");
  textSpan.className = "todo-text";
  textSpan.textContent = taskObj.text;

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "todo-actions";

  const del = document.createElement("button");
  del.className = "todo-action-btn";
  del.textContent = "🗑️";

  const editbtn = document.createElement("button");
  editbtn.className = "todo-action-btn";
  editbtn.textContent = "✏️";

  actionsDiv.appendChild(editbtn);
  actionsDiv.appendChild(del);
  task.appendChild(textSpan);
  task.appendChild(actionsDiv);
  ul.appendChild(task);

  // Delete event
  del.addEventListener("click", function () {
    const index = Array.from(ul.children).indexOf(task);
    tasks.splice(index, 1);
    saveTasks();
    ul.removeChild(task);
  });

  // Edit event
  editbtn.addEventListener("click", function () {
    if (task.querySelector(".edit-input")) return;

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = textSpan.textContent;
    editInput.className = "todo-input edit-input";
    editInput.style.marginRight = "8px";
    editInput.style.flex = "1";

    task.replaceChild(editInput, textSpan);
    editInput.focus();

    function saveEdit() {
      const newValue = editInput.value.trim();
      if (newValue) {
        textSpan.textContent = newValue;
        const index = Array.from(ul.children).indexOf(task);
        tasks[index].text = newValue;
        saveTasks();
      }
      task.replaceChild(textSpan, editInput);
    }

    editInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        saveEdit();
      }
      if (e.key === "Escape") {
        task.replaceChild(textSpan, editInput);
      }
    });

    editInput.addEventListener("blur", saveEdit);
  });

  // Mark as completed on click
  textSpan.addEventListener("click", function () {
    task.classList.toggle("completed");
    const index = Array.from(ul.children).indexOf(task);
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
