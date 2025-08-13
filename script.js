// script.js
let currentFilter = "all";

const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let searchKeyword = "";

window.onload = () => {
  todos.forEach(todo => addTodoToDOM(todo));
  setupFilterButtons();

};

function addTodo() {
 const todoText = todoInput.value.trim();
  if (todoText === "") {
    alert("Lütfen bir görev girin!");
    return;
  }

  const newTodo = {
    text: todoText,
    completed: false
  };

  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
  todoInput.value = "";
  renderTodos(); // ✅ Sadece bu
}


function addTodoToDOM(todoObj) {
  const li = document.createElement("li");
  li.setAttribute("draggable", "true"); // Sürüklenebilir yap

  const label = document.createElement("label");
  label.style.display = "flex";
  label.style.alignItems = "center";
  label.style.gap = "10px";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todoObj.completed;
  checkbox.addEventListener("change", () => {
    todoObj.completed = checkbox.checked;
    updateTodos();
    span.classList.toggle("completed", todoObj.completed);
  });

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = todoObj.text;
  if (todoObj.completed) {
    span.classList.add("completed");
  }

  // 🕒 Uzun basma ile düzenleme
  let pressTimer;
  span.addEventListener("mousedown", () => {
    pressTimer = setTimeout(() => {
      enterEditMode();
    }, 800); // 800ms basılı tutma süresi
  });

  span.addEventListener("mouseup", () => clearTimeout(pressTimer));
  span.addEventListener("mouseleave", () => clearTimeout(pressTimer));

  function enterEditMode() {
    const input = document.createElement("input");
    input.type = "text";
    input.value = todoObj.text;
    input.className = "edit-input";
    input.style.flexGrow = "1";

    input.addEventListener("blur", saveEdit);
    input.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        saveEdit();
      }
    });

    label.replaceChild(input, span);
    input.focus();
  }

  function saveEdit() {
    const input = label.querySelector(".edit-input");
    const newText = input.value.trim();
    if (newText === "") return;

    todoObj.text = newText;
    updateTodos();

    span.textContent = newText;
    label.replaceChild(span, input);
  }

  label.appendChild(checkbox);
  label.appendChild(span);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "✖";
  deleteBtn.addEventListener("click", () => {
    todos = todos.filter(t => t !== todoObj);
    updateTodos();
    renderTodos();
  });

  li.appendChild(label);
  li.appendChild(deleteBtn);
  todoList.appendChild(li);

  // ———— Buraya drag & drop eventleri ekle ————

  li.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", todos.indexOf(todoObj)); // Taşınacak elemanın indexi
    li.classList.add("dragging");
  });

  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
  });

  li.addEventListener("dragover", (e) => {
    e.preventDefault(); // Bırakılabilir alan olarak tanımla
    const draggingEl = document.querySelector(".dragging");
    if (draggingEl === li) return; // Kendi üzerine bırakma

    const bounding = li.getBoundingClientRect();
    const offset = e.clientY - bounding.top;
    const halfHeight = bounding.height / 2;

    const todoListChildren = Array.from(todoList.children);
    const draggingIndex = todoListChildren.indexOf(draggingEl);
    const targetIndex = todoListChildren.indexOf(li);

    if (offset > halfHeight) {
      todoList.insertBefore(draggingEl, li.nextSibling);
      moveInTodosArray(draggingIndex, targetIndex + 1);
    } else {
      todoList.insertBefore(draggingEl, li);
      moveInTodosArray(draggingIndex, targetIndex);
    }
  });
}




function updateTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

addBtn.addEventListener("click", addTodo);

todoInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addTodo();
  }
});
function setupFilterButtons() {
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Aktif class'ı güncelle
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Filtre tipini güncelle
      currentFilter = btn.dataset.filter;

      // Listeyi tekrar yükle
      renderTodos();
    });
  });
}
function renderTodos() {
  todoList.innerHTML = ""; // Önce temizle

  const filteredTodos = todos.filter(todo => {
    return (
      currentFilter === "all" ||
      (currentFilter === "completed" && todo.completed) ||
      (currentFilter === "uncompleted" && !todo.completed)
    );
  });

  if (filteredTodos.length === 0) {
  const emptyMessage = document.createElement("li");
  emptyMessage.textContent = "Henüz görev yok.";
  emptyMessage.style.textAlign = "center";
  emptyMessage.style.color = "#777";
  emptyMessage.style.padding = "15px";
  emptyMessage.style.fontStyle = "italic";
  emptyMessage.style.fontSize = "16px";
  todoList.appendChild(emptyMessage);
  return;
  }



  filteredTodos.forEach(todo => {
    addTodoToDOM(todo);
  });
}
window.addEventListener("DOMContentLoaded", () => {
  todos.forEach(todo => addTodoToDOM(todo));
  setupFilterButtons();
  renderTodos();
});
function moveInTodosArray(fromIndex, toIndex) {
  if (toIndex > fromIndex) toIndex--;
  const item = todos.splice(fromIndex, 1)[0];
  todos.splice(toIndex, 0, item);
  updateTodos();
}
const themeToggle = document.getElementById("themeToggle");

// Daha önce seçilmiş tema varsa onu uygula
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // İkonu değiştir
  if (document.body.classList.contains("dark")) {
    themeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "light");
  }
});

