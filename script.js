/**
 * TaskFlow | To-Do List Application
 * Professional JavaScript Implementation
 */

document.addEventListener("DOMContentLoaded", () => {
  // ================= ELEMENTS =================
  const inputBox = document.getElementById("input-box");
  const addBtn = document.getElementById("add-btn");
  const listContainer = document.getElementById("list-container");
  const emptyState = document.getElementById("empty-state");
  const searchInput = document.getElementById("search");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const deleteAllBtn = document.getElementById("delete-all-btn");

  // Counter Elements
  const allCounter = document.getElementById("all-counter");
  const completedCounter = document.getElementById("completed-counter");
  const pendingCounter = document.getElementById("pending-counter");
  const footerCompleted = document.getElementById("footer-completed");
  const footerPending = document.getElementById("footer-pending");

  // State
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";
  let searchQuery = "";

  // ================= INITIALIZATION =================
  init();

  function init() {
    renderTasks();
    setupSortable();

    // Event Listeners
    addBtn.addEventListener("click", addTask);
    inputBox.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addTask();
    });

    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderTasks();
    });

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.getAttribute("data-filter");
        renderTasks();
      });
    });

    deleteAllBtn.addEventListener("click", deleteAllTasks);
  }

  // ================= CORE FUNCTIONS =================

  function addTask() {
    const text = inputBox.value.trim();
    if (text === "") {
      showToast("Please enter a task!", "warning");
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.unshift(newTask);
    saveAndRender();
    inputBox.value = "";
    showToast("Task added successfully!", "success");
  }

  function toggleTask(id) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    saveAndRender();
  }

  function deleteTask(id) {
    const taskElement = document.querySelector(`[data-id="${id}"]`);
    taskElement.classList.add("fade-out");

    setTimeout(() => {
      tasks = tasks.filter((task) => task.id !== id);
      saveAndRender();
      showToast("Task deleted", "danger");
    }, 250);
  }

  function editTask(id) {
    const task = tasks.find((t) => t.id === id);
    const newText = prompt("Edit your task:", task.text);

    if (newText !== null && newText.trim() !== "") {
      tasks = tasks.map((t) =>
        t.id === id ? { ...t, text: newText.trim() } : t,
      );
      saveAndRender();
      showToast("Task updated!", "success");
    }
  }

  function deleteAllTasks() {
    if (tasks.length === 0) return;

    if (confirm("Are you sure you want to delete all tasks?")) {
      tasks = [];
      saveAndRender();
      showToast("All tasks cleared", "danger");
    }
  }

  // ================= RENDERING =================

  function renderTasks() {
    // Filter logic
    let filteredTasks = tasks.filter((task) => {
      const matchesSearch = task.text.toLowerCase().includes(searchQuery);
      const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "active" && !task.completed) ||
        (currentFilter === "completed" && task.completed);
      return matchesSearch && matchesFilter;
    });

    // Update Empty State
    if (filteredTasks.length === 0) {
      emptyState.style.display = "block";
      listContainer.innerHTML = "";
    } else {
      emptyState.style.display = "none";
      listContainer.innerHTML = filteredTasks
        .map((task) => create浸TaskHTML(task))
        .join("");
    }

    updateCounters();
  }

  function create浸TaskHTML(task) {
    return `
      <li class="${task.completed ? "completed" : ""}" data-id="${task.id}">
        <label>
          <input type="checkbox" ${task.completed ? "checked" : ""} 
            onchange="window.handleToggle('${task.id}')">
          <span>${escapeHTML(task.text)}</span>
        </label>
        <div class="task-actions">
          <button class="edit-btn" onclick="window.handleEdit('${task.id}')">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="delete-btn" onclick="window.handleDelete('${task.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </li>
    `;
  }

  function updateCounters() {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    allCounter.textContent = total;
    completedCounter.textContent = completed;
    pendingCounter.textContent = pending;

    footerCompleted.textContent = completed;
    footerPending.textContent = pending;
  }

  function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }

  // ================= UTILS =================

  function setupSortable() {
    new Sortable(listContainer, {
      animation: 150,
      ghostClass: "sortable-ghost",
      onEnd: function () {
        const newOrder = Array.from(listContainer.children).map((li) =>
          li.getAttribute("data-id"),
        );
        const reorderedTasks = [];
        newOrder.forEach((id) => {
          const task = tasks.find((t) => t.id === id);
          if (task) reorderedTasks.push(task);
        });
        tasks = reorderedTasks;
        localStorage.setItem("tasks", JSON.stringify(tasks));
      },
    });
  }

  function showToast(message, type) {
    let bgColor = "#3b82f6"; // primary
    if (type === "success") bgColor = "#22c55e";
    if (type === "danger") bgColor = "#ef4444";
    if (type === "warning") bgColor = "#f59e0b";

    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: bgColor,
        borderRadius: "10px",
      },
    }).showToast();
  }

  function escapeHTML(str) {
    const p = document.createElement("p");
    p.textContent = str;
    return p.innerHTML;
  }

  // Expose handlers to window for inline onclick attributes
  window.handleToggle = (id) => toggleTask(id);
  window.handleDelete = (id) => deleteTask(id);
  window.handleEdit = (id) => editTask(id);
});
