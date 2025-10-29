const todoInput = document.getElementById("todoInput");
const dateInput = document.getElementById("dateInput");
const addBtn = document.getElementById("addBtn");
const todoBody = document.getElementById("todoBody");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const filterBtn = document.getElementById("filterBtn");
const resetBtn = document.getElementById("resetBtn");

const modal = document.getElementById("filterModal");
const applyFilter = document.getElementById("applyFilter");
const closeFilter = document.getElementById("closeFilter");

let todos = [];

function renderTodos(list = todos) {
  todoBody.innerHTML = "";
  if (list.length === 0) {
    todoBody.innerHTML = `<tr><td colspan="4" class="no-task">No task found</td></tr>`;
    return;
  }

  list.forEach((todo, index) => {
    const row = document.createElement("tr");
    const doneBtnText = todo.done ? "Cancel" : "Done";
    const doneBtnClass = todo.done ? "cancel-btn" : "done-btn";

    row.innerHTML = `
      <td>${escapeHtml(todo.text)}</td>
      <td>${escapeHtml(todo.date)}</td>
      <td>${todo.done ? "✅ Done" : "⏳ Pending"}</td>
      <td>
        <button class="action-btn ${doneBtnClass}" onclick="toggleDone(${index})">${doneBtnText}</button>
        <button class="action-btn delete-btn" onclick="deleteTodo(${index})">Delete</button>
      </td>
    `;
    todoBody.appendChild(row);
  });
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

addBtn.addEventListener("click", () => {
  const text = todoInput.value.trim();
  const date = dateInput.value;

  if (!text || !date) {
    alert("Please fill in both task and date!");
    return;
  }

  todos.push({ text, date, done: false });
  todoInput.value = "";
  dateInput.value = "";
  renderTodos();
});

function toggleDone(index) {
  todos[index].done = !todos[index].done;
  renderTodos();
}

function deleteTodo(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    todos.splice(index, 1);
    renderTodos();
  }
}

deleteAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    todos = [];
    renderTodos();
  }
});

filterBtn.addEventListener("click", () => {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
});

closeFilter.addEventListener("click", () => {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }
});

applyFilter.addEventListener("click", () => {
  const filterTypeElem = document.querySelector('input[name="filterType"]:checked');
  const filterType = filterTypeElem ? filterTypeElem.value : 'all';
  const start = document.getElementById("filterStart").value;
  const end = document.getElementById("filterEnd").value;

  let filtered = todos.slice();

  if (filterType === "done") filtered = filtered.filter(t => t.done);
  else if (filterType === "pending") filtered = filtered.filter(t => !t.done);

  if (start && end) {
    filtered = filtered.filter(t => t.date >= start && t.date <= end);
  } else if (start && !end) {
    filtered = filtered.filter(t => t.date >= start);
  } else if (!start && end) {
    filtered = filtered.filter(t => t.date <= end);
  }

  renderTodos(filtered);
  resetBtn.classList.remove("hidden");
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
});

resetBtn.addEventListener("click", () => {
  renderTodos();
  resetBtn.classList.add("hidden");
});
