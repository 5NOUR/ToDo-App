const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  let task = inputBox.value.trim();
  if (!task) {
    alert("Please Write Down A Task");
    return;
  }
  const li = document.createElement("li");
  li.innerHTML = `
    <label>
        <input type="Checkbox">
        <span>${task}</span>
    </label>
    <span class="edit-btn">Edit</span>
    <span class="delete-btn">Delete</span>
`;
  listContainer.appendChild(li);
  inputBox.value = "";
  const checkbox = li.querySelector("input");
  const editBtn = li.querySelector(".edit-btn");
  const taskSpan = li.querySelector("span");
  const deleteBtn = li.querySelector(".delete-btn");
  checkbox.addEventListener("click", function () {
    li.classList.toggle("completed", checkbox.checked);
  });
  editBtn.addEventListener("click", function () {
    const update = prompt("Edit Task", taskSpan.textContent);
    if (update !== null) {
      taskSpan.textContent = update;
      li.classList.remove("completed");
    }
    checkbox.checked = false;
    updateCounter();
  });
  const completedCounter = document.getElementById("completed-counter");
  const uncompletedCounter = document.getElementById("uncompleted-counter");
  function updateCounter() {
    const completedTasks = document.querySelectorAll(".completed").length;
    const uncompletedTasks =
      document.querySelectorAll("li:not(.completed)").length;
    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
  }
  checkbox.addEventListener("click", function () {
    li.classList.toggle("completed", checkbox.checked);
    updateCounter();
  });
  function updateCounter() {
    const completedTasks = document.querySelectorAll(".completed").length;
    const uncompletedTasks =
      document.querySelectorAll("li:not(.completed)").length;
    completedCounter.textContent = completedTasks;
    uncompletedCounter.textContent = uncompletedTasks;
  }
  checkbox.addEventListener("click", function () {
    li.classList.toggle("completed", checkbox.checked);
    updateCounter();
  });
  deleteBtn.addEventListener("click", function () {
    if (confirm("Are You Sure You Want To Delete This Task?")) {
      li.remove();
      updateCounter();
    }
  });
  updateCounter();
}
