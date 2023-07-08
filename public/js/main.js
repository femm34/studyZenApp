// var myModal = document.getElementById("exampleModal");
// var myInput = document.getElementById("myInput");

// myModal.addEventListener("shown.bs.modal", function () {
//   myInput.focus();
// });

const updateMoneyAmountSubt = (id_user, addAmount) => {
  fetch(
    `http://localhost:3000/money-updateSubt-amount/${id_user}/${addAmount}`,
    {
      method: "PUT",
    }
  ).then((response) => location.reload());
};

const updateMoneyAmountAdd = (id_user, addAmount) => {
  fetch(
    `http://localhost:3000/money-updateAdd-amount/${id_user}/${addAmount}`,
    {
      method: "PUT",
    }
  ).then((response) => location.reload());
};

const updateUser = (id_user, newUsername) => {
  fetch(`http://localhost:3000/users-update/${id_user}/${newUsername}`, {
    method: "PUT",
  }).then((response) => location.reload());
};

const deleteUser = (id_user) => {
  fetch(`http://localhost:3000/users/${id_user}`, {
    method: "DELETE",
  }).then((response) => location.reload());
};

const updateTaskStatus = (id_task, id_user) => {
  fetch(`http://localhost:3000/tasks/${id_task}/${id_user}`, {
    method: "PUT",
  }).then((response) => location.reload());
};

const deleteTask = (id_task) => {
  fetch(`http://localhost:3000/delete-task/${id_task}`, {
    method: "DELETE",
  }).then((response) => location.reload());
};
