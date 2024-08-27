const currentDate = new Date();
const dayName = currentDate.toLocaleString("default", { weekday: "long" });
const dateOnly = currentDate.getDate();
const monthName = currentDate.toLocaleDateString("default", { month: "long" });
const year = currentDate.getFullYear();
console.log(dayName, dateOnly, monthName, year);

const today = dayName + ", " + dateOnly + " " + monthName + " " + year;
const month = monthName + " " + year;

const categories = [
  { name: "Today", date: today },
  { name: "Week", date: "" },
  { name: "Month", date: month },
];

const allTasks = {};
const completedTasks = {};
const impTasks = {};

// DOM elements
const rightCont = document.getElementById("right_cont");
const impEle = document.getElementById("important");

// Initial Rendering of right section - byDefault category is set to Today
renderRightSection(categories[0]);

// Click Event for category - Today, Week, Month
categories.forEach((category) => {
  const categEle = document.getElementById(category.name.toLowerCase());
  categEle.addEventListener("click", () => {
    renderRightSection(category);
  });
});

// Click Event for Important category
impEle.addEventListener("click", () => {
  rightCont.innerHTML = "";
  const heading = `<h2 id="imp_h2">IMPORTANT TASKS</h2>
                   <div id="imp_tasks_cont"></div>`;
  rightCont.insertAdjacentHTML("beforeend", heading);
  renderImpAllTasks();
});

// ............................All Functions to render for categories............................
// function to render Complete right section
function renderRightSection(category) {
  rightCont.innerHTML = "";
  const data = `<div id="top_cont">
          <div id="heading">
            <h2>${category.name} </h2>
            <p><small>${category.date}</small></p>
          </div>

          <div id="addItem">
            <button id="addBtn">Add</button>
            <input type="text" placeholder="Add new task" id="addTask" autofocus />
          </div>

          <div id="taskCount">
            <p>Total tasks : 0</p>
          </div>
        </div>
        <div id="task_cont"></div>`;
  rightCont.insertAdjacentHTML("beforeend", data);
  totalTasks(category);
  renderAllTasks(category);

  const addInputEle = document.getElementById("addTask");
  addInputEle.focus();
  const addBtn = document.getElementById("addBtn");
  addBtn.addEventListener("click", () => {
    addTask(category, addInputEle);
  });
  addInputEle.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      // event.preventDefault();
      addBtn.click();
    }
  });
}

// funtion to Update Total tasks
function totalTasks(category) {
  const totalTasksEle = document.getElementById("taskCount").querySelector("p");
  if (!totalTasksEle) return;
  if (!allTasks[category.name]) return;
  totalTasksEle.textContent = `Total tasks : ${allTasks[category.name].size}`;
}

//  function to add new Task
function addTask(category, input) {
  if (!input.value) return;
  checkAndAddTask(allTasks, input.value, category);
  totalTasks(category);
  renderAllTasks(category);
  input.value = "";
  input.focus();

  console.log(`All Tasks :`, allTasks);
}

// funtion to render all tasks for selected category
function renderAllTasks(category) {
  if (!allTasks[category.name]) return;

  const tasksCont = document.getElementById("task_cont");
  tasksCont.innerHTML = "";
  allTasks[category.name].forEach((task) => {
    const taskDiv = `<div class="listItem">
            <div class="nameSection">
              <input type="checkbox" name="task" class="checkBox" />
              <label class="taskName">${task}</label>
            </div>
            <div class="iconsSection">
              <i class="fa-regular fa-star star"></i>
              <i class="fa-solid fa-circle-minus del"></i>
            </div>
          </div>`;

    tasksCont.insertAdjacentHTML("beforeend", taskDiv);
    const addedTaskDiv = tasksCont.querySelector(".listItem:last-of-type");
    const nameSection = addedTaskDiv.querySelector(".nameSection");
    const checkbox = addedTaskDiv.querySelector(".checkBox");
    const labelEle = addedTaskDiv.querySelector("label");
    const starIcon = addedTaskDiv.querySelector(".star");
    const delIcon = addedTaskDiv.querySelector(".del");
    if (completedTasks[category.name]) {
      if (completedTasks[category.name].has(labelEle.textContent)) {
        labelEle.style.textDecoration = "line-through";
        checkbox.checked = true;
      }
    }

    if (impTasks[category.name]) {
      if (impTasks[category.name].has(labelEle.textContent)) {
        starIcon.style.color = "rgb(249, 191, 91)";
      }
    }

    nameSection.addEventListener("click", (event) => {
      let isChecked;
      if (event.target == checkbox) {
        isChecked = checkbox.checked;
      } else {
        isChecked = checkbox.checked == true ? false : true;
        checkbox.checked = isChecked;
      }
      handleCheckBox(category, addedTaskDiv, isChecked);
    });

    starIcon.addEventListener("click", () => {
      handleStarIcon(starIcon, labelEle, category);
    });

    delIcon.addEventListener("click", () => {
      delTask(category, addedTaskDiv);
    });
  });
}

// function to handle checkbox
function handleCheckBox(category, addedTaskDiv, isChecked) {
  const labelEle = addedTaskDiv.querySelector("label");

  if (isChecked === true) {
    labelEle.style.textDecoration = "line-through";
    checkAndAddTask(completedTasks, labelEle.textContent, category);
  } else {
    labelEle.style.textDecoration = "none";
    completedTasks[category.name].delete(labelEle.textContent);
  }
  console.log(`Completed Tasks :`, completedTasks);
}

// funtion to add tasks to important
function handleStarIcon(starIcon, labelEle, category) {
  const newColor =
    starIcon.style.color == "rgb(249, 191, 91)" ? "black" : "rgb(249, 191, 91)";
  starIcon.style.color = newColor;
  if (newColor == "rgb(249, 191, 91)") {
    starIcon.classList.add("starClicked");
    checkAndAddTask(impTasks, labelEle.textContent, category);
  } else {
    starIcon.classList.remove("starClicked");
    impTasks[category.name].delete(labelEle.textContent);
  }
  console.log("Imp Tasks:", impTasks);
}

// function to check for property in tasks Object & then add task
function checkAndAddTask(taskObj, task, category) {
  if (taskObj[category.name]) {
    taskObj[category.name].add(task);
  } else {
    taskObj[category.name] = new Set();
    taskObj[category.name].add(task);
  }
}

// function to delete task
function delTask(category, addedTaskDiv) {
  const labelEle = addedTaskDiv.querySelector("label");
  allTasks[category.name].delete(labelEle.textContent);
  if (impTasks[category.name].has(labelEle.textContent))
    impTasks[category.name].delete(labelEle.textContent);
  totalTasks(category);
  renderAllTasks(category);
}

// ............................All Functions for Important section............................
// function to render complete important section
function renderImpAllTasks() {
  const impTasksCont = document.getElementById("imp_tasks_cont");
  impTasksCont.innerHTML = "";
  categories.forEach((c) => {
    if (impTasks[c.name] && impTasks[c.name].size !== 0) {
      insertImpCategory(c, impTasksCont);
    }
  });
}

// function to add category for important section
function insertImpCategory(category, impTasksCont) {
  const data = `<section id="imp_${category.name}" class="imp_section">
  <h3>${category.name}</h3>
  <ul class="imp_ul"></ul>
  </section>`;
  impTasksCont.insertAdjacentHTML("beforeend", data);
  const ulEle = document
    .getElementById(`imp_${category.name}`)
    .querySelector(".imp_ul");
  insertImpTasks(category, ulEle);
}

// function to insert tasks to different categories
function insertImpTasks(category, ulEle) {
  impTasks[category.name].forEach((task) => {
    const taskLi = `<li>
                <span>${task}</span>
                <i class="fa-regular fa-star imp_star"></i>
              </li>`;
    ulEle.insertAdjacentHTML("beforeend", taskLi);
    const addedLi = ulEle.querySelector("li:last-of-type");
    const spanEle = addedLi.querySelector("span");
    const impStarIcon = addedLi.querySelector(".imp_star");
    impStarIcon.addEventListener("click", () => {
      impTasks[category.name].delete(spanEle.textContent);
      renderImpAllTasks();
    });
  });
}
