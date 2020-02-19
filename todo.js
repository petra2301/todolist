"use strict";
//cors key: 	5d9093301ce70f6379855131
//link https://todolist2019-e565.restdb.io/rest/addtaskform

const addForm = document.querySelector("form#addForm");
const addTaskBtn = document.querySelector(".addTaskBtn");
const editForm = document.querySelector("form#editForm");
const modal = document.querySelector(".modal");

document.addEventListener("DOMContentLoaded", function() {
  get();
});

addForm.addEventListener("submit", e => {
    e.preventDefault();
    addTaskBtn.textContent = "Waiting..."
    post();
  });

editForm.addEventListener("submit", e => {
    e.preventDefault();
    put();
    document.querySelector(".modal").classList.add("hide");
 })

modal.querySelector(".closeModal").addEventListener("click", () => {
    modal.classList.add("hide");
    document.querySelector(".taskOgName").textContent = "";
    editForm.reset();
})

modal.querySelector(".cancelEditing").addEventListener("click", () => {
    modal.classList.add("hide");
    document.querySelector(".taskOgName").textContent = "";
    editForm.reset();
})

function get() {
  fetch("https://todolist2019-e565.restdb.io/rest/addtaskform", {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": "5d9093301ce70f6379855131",
      "cache-control": "no-cache"
    }
  })
    .then(e => e.json())
    .then(tasks => {
      tasks.forEach(addTask);
    });
}

function post() {
    const data = {
      task: addForm.elements.task.value,
      when: addForm.elements.when.value,
      notes: addForm.elements.notes.value,
      done: addForm.elements.done.value,
    };
  
    const postData = JSON.stringify(data);
    fetch("https://todolist2019-e565.restdb.io/rest/addtaskform", {
      method: "post",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": "5d9093301ce70f6379855131",
        "cache-control": "no-cache"
      },
      body: postData
    })
      .then(res => res.json())
      .then(data => {
        addTask(data);
        showToast();
        addForm.reset();
        addTaskBtn.textContent = "Successfully added";
        addTaskBtn.style.backgroundColor = "green";
        setTimeout( function() {
            addTaskBtn.textContent = "Add task";
            addTaskBtn.style.backgroundColor = "#FA983A";
        }, 3000);
      });
  }

function deleteTaskAnimation(id) {
    const deletedTask = document.querySelector(`article[data-task-id="${id}"]`)
    deletedTask.classList.add("deleteTask");
    deletedTask.addEventListener("animationend", () => {
    deleteTask(id)
});
}

function deleteTask(id) {
    fetch("https://todolist2019-e565.restdb.io/rest/addtaskform/" + id, {
      method: "delete",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": "5d9093301ce70f6379855131",
        "cache-control": "no-cache"
      }
    })
    
       .then(res => res.json())
       .then(data => {
         document.querySelector(`article[data-task-id="${id}"]`).remove();
       });
}

function put() {
    let data = {
        task: editForm.elements.task.value,
        when: editForm.elements.when.value,
        notes: editForm.elements.notes.value
    };

    let postData = JSON.stringify(data);

    const taskId = editForm.elements.id.value;

    fetch("https://todolist2019-e565.restdb.io/rest/addtaskform/" + taskId,
    {
        method: "put",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": "5d9093301ce70f6379855131",
            "cache-control": "no-cache"
        },
        body: postData
    }
)
.then(d => d.json())
.then( updatedTask => {
    const parentElement = document.querySelector(`article[data-task-id="${updatedTask._id}"]`);
    
    parentElement.querySelector("h2").textContent = updatedTask.task;
    parentElement.querySelector(".taskDate").textContent = updatedTask.when;
    parentElement.querySelector(".taskNotes").textContent = updatedTask.notes;
});
}

function editTask(id){
    //fetchAndPopulate in Jonas' example
    document.querySelector(".modal").classList.remove("hide");

    fetch(`https://todolist2019-e565.restdb.io/rest/addtaskform/${id}`, {
        method: "get",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-apikey": "5d9093301ce70f6379855131",
          "cache-control": "no-cache"
        }
      })
        .then(e => e.json())
        .then(tasks => {
        document.querySelector(".taskOgName").textContent = tasks.task;
          editForm.elements.task.value=tasks.task;
          editForm.elements.when.value=tasks.when;
          editForm.elements.notes.value=tasks.notes;
          editForm.elements.id.value=tasks._id;
        });
}

function addTask(task) {
    const template = document.querySelector("template").content;
    const clone = template.cloneNode(true);
  
    clone.querySelector("article").dataset.taskId = task._id;
    clone.querySelector("h2").textContent = task.task;
    clone.querySelector(".taskDate").textContent = task.when;
    clone.querySelector(".taskNotes").textContent = task.notes;
    clone.querySelector(`input[type="number"]`).value = task.done;
  
    clone.querySelector(".deleteBtn").addEventListener("click", () => {
      deleteTaskAnimation(task._id);
    });
  
    clone.querySelector(".editBtn").addEventListener("click", e => {
        editTask(task._id);
    });

    clone.querySelector("#toggleStatusBtn").addEventListener("click", () => {
      changeStatus(task._id);
  });
 
  if (task.done === 1) {
    clone.querySelector(`article[data-task-id="${task._id}"]`).classList.add("done");
    clone.querySelector("#toggleStatusBtn").classList.remove("doneBtn");
    clone.querySelector("#toggleStatusBtn").classList.add("notDoneBtn");
  }

    document.querySelector("main").prepend(clone);
  }

function showToast() {
    const toast = document.querySelector(".toast")
    toast.classList.add("taskAdded");
    setTimeout(function(){
        toast.classList.remove("taskAdded");
    }, 4000);
}

function changeStatus(id) {
  const parentElement = document.querySelector(`article[data-task-id="${id}"]`);

  //toggle visuals first to avoid lag
  document.querySelector(`article[data-task-id="${id}"]`).classList.toggle("done");
  parentElement.querySelector("#toggleStatusBtn").classList.toggle("doneBtn");
  parentElement.querySelector("#toggleStatusBtn").classList.toggle("notDoneBtn");

  //actually update the db
    if (parentElement.querySelector(`input[type="number"`).value === "1") {
    parentElement.querySelector(`input[type="number"`).value = "2";
  } else {
    parentElement.querySelector(`input[type="number"`).value = "1";
  };

  let data = {
        done: parentElement.querySelector(`input[type="number"`).value
        
  };

  let postData = JSON.stringify(data);
console.log("https://todolist2019-e565.restdb.io/rest/addtaskform/" + id);
  fetch("https://todolist2019-e565.restdb.io/rest/addtaskform/" + id,
    {
        method: "put",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "x-apikey": "5d9093301ce70f6379855131",
            "cache-control": "no-cache"
        },
        body: postData
    }
)
.then(d => d.json());
}