const express = require("express");
const connection = require("../config/database");
const router = express.Router();
const session = require("express-session");

const app = require("../app");

router.get("/pomodoro-timer", (req, res) => {
  if (req.session.isLoggedIn) {
    res.render("../views/templates/index", { req: req });
  } else {
    res.send("you are not logged in");
  }
});

router.get("/zenGPT", (req, res) => {
  if (req.session.isLoggedIn) {
    res.render("../views/templates/index", { req: req });
  } else {
    res.send("you are not logged in");
  }
});

router.get("/advices", (req, res) => {
  if (req.session.isLoggedIn) {
    res.render("../views/templates/index", { req: req });
  } else {
    res.send("you are not logged in");
  }
});

router.get("/money-manager", (req, res) => {
  if (req.session.isLoggedIn) {
    connection.query("use studyZenApp", (err, result) => {
      if (err) {
        console.error(err);
      } else {
        connection.query(
          `SELECT u.id_user, u.username, ua.amount, dh.amount AS deposit, dt.amount AS tracking
          FROM users u
          INNER JOIN users_amount ua on u.id_user = ua.id_user
          INNER JOIN deposit_history dh ON u.id_user = dh.id_user
          INNER JOIN deposit_tracking dt ON dh.id_deposit = dt.id_deposit
          WHERE u.id_user = ${req.session.id_user}`,
          (err, result) => {
            if (err) {
              console.error(err);
            } else {
              console.log(result);
              let amountsDepo = new Array();
              for (let data of result) {
                amountsDepo.push(data.tracking);
              }
              res.render("../views/templates/index", {
                req: req,
                amount: result,
                depositos: amountsDepo,
              });
            }
          }
        );
      }
    });
  } else {
    res.send("you are not logged in");
  }
});

router.delete("/delete-task/:idTask", (req, res) => {
  const idTask = req.params.idTask;
  connection.query("USE studyZenApp", (err, results) => {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        `delete from todo_info where task_id = ${idTask}`,
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            console.log("task was deleted successfully");
            res.redirect("/todo-list");
          }
        }
      );
    }
  });
});

router.put("/tasks/:idTask/:idUser", (req, res) => {
  const idTask = req.params.idTask;
  const idUser = req.params.idUser;
  console.log(idTask, idUser);
  connection.query("use studyZenApp", (err, results) => {
    if (err) {
      console.error(err);
    } else {
      connection.query(
        `update todo_info task_status set task_status = case when task_status = 1 then 0 when task_status = 0 then 1 else null end where task_id =  ${idTask} and id_user = ${idUser}`,
        (err, result) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Task status was updated");
            res.redirect("/todo-list");
          }
        }
      );
    }
  });
});

router.put("/money-updateSubt-amount/:id/:addAmount", (req, res) => {
  const idUser = req.params.id;
  const subtAmount = req.params.addAmount;
  connection.query("USE studyZenApp", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      connection.query(
        `UPDATE users_amount SET amount = amount - CAST(${subtAmount} AS DECIMAL(10, 2)) WHERE id_user = ${idUser}`,
        (err, result) => {
          if (err) {
            console.error(err);
          } else {
            console.log("amount updated successfully");
            res.redirect("/money-manager");
          }
        }
      );
    }
  });
});

router.put("/money-updateAdd-amount/:id/:addAmount", (req, res) => {
  const idUser = req.params.id;
  const addAmount = req.params.addAmount;
  connection.query("USE studyZenApp", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      connection.query(
        `UPDATE users_amount SET amount = amount + CAST(${addAmount} AS DECIMAL(10, 2)) WHERE id_user = ${idUser}`,
        (err, result) => {
          if (err) {
            console.error(err);
          } else {
            console.log("amount updated successfully");
            res.redirect("/money-manager");
          }
        }
      );
    }
  });
});

router.put("/users-update/:id/:newUsername", (req, res) => {
  const idUser = req.params.id;
  const newUsername = req.params.newUsername;
  connection.query("studyZenApp", (err, results) => {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        `update users username set username = '${newUsername}' where id_user = ${idUser};`,
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            console.log("user was updated");
            res.redirect("/dashboard");
          }
        }
      );
    }
  });
});

router.delete("/users/:id", function (req, res) {
  const idUser = req.params.id;
  connection.query(
    `delete from deposit_tracking where id_user = ${idUser}`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        connection.query(
          `delete from deposit_history where id_user = ${idUser}`,
          (err, results) => {
            if (err) {
              console.log(err);
            } else {
              connection.query(
                `delete from users_amount where id_user = ${idUser}`,
                (err, results) => {
                  if (err) {
                    console.log(err);
                  } else {
                    connection.query(
                      `delete from todo_info where id_user = ${idUser}`,
                      (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                          connection.query(
                            `delete from users where id_user = ${idUser}`,
                            (err, result) => {
                              if (err) {
                                console.log(err);
                              } else {
                                console.log("users deleted");
                                res.redirect("/dashboard");
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

router.get("/", function (req, res) {
  res.render("../views/templates/index", { req: req });
});

router.get("/dashboard", (req, res) => {
  if (req.session.isLoggedIn) {
    connection.query("use studyZenApp", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        connection.query("select * from users", (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.render("../views/templates/index", {
              req: req,
              users: result,
            });
          }
        });
      }
    });
  } else {
    res.send("you must be logged in");
  }
});

router.get("/register", (req, res) => {
  res.render("../views/templates/index", { req: req });
});

router.get("/login", (req, res) => {
  res.render("../views/templates/index", { req: req });
});

router.post("/login", function (req, res) {
  connection.query(`USE studyZenApp`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        `SELECT * FROM users where username = '${req.body.username}' 
        and password = '${req.body.password}'`,
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            if (result.length > 0) {
              req.session.isLoggedIn = true; // this code activates the session
              req.session.username = req.body.username;
              req.session.id_rol = result[0].id_rol;
              req.session.id_user = result[0].id_user;
              console.log(
                result[0].id_rol,
                req.session.isLoggedIn,
                req.session,
                req.session.id_user
              );

              res.redirect("/cards");
            }
          }
        }
      );
    }
  });
});

router.post("/register", function (req, res) {
  // res.render("../views/templates/index", { req: req });
  connection.query(`USE studyZenApp`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        `INSERT INTO users(email,username,password) values ('${req.body.email}','${req.body.username}','${req.body.password}')`,
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log("register success");
            res.redirect("/");
          }
        }
      );
    }
  });
});

router.get("/todo-list", (req, res) => {
  // console.log(req);
  if (req.session.isLoggedIn) {
    connection.query("use studyZenApp", (err, result) => {
      if (err) {
        console.error(err);
      } else {
        connection.query(
          `SELECT users.id_user, users.username, todo_info.task_name, todo_info.task_status, todo_info.task_id FROM users INNER JOIN todo_info ON users.id_user = todo_info.id_user where users.id_user = ${req.session.id_user}`,
          (err, result) => {
            if (err) {
              console.error(err);
            } else {
              // console.log(result);
              res.render("../views/templates/index", {
                req: req,
                tasks: result,
              });
            }
          }
        );
      }
    });
  } else {
    res.send("you are not logged in");
  }
});

router.post("/todo-list", (req, res) => {
  connection.query("USE studyZenApp", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        `insert into todo_info(task_name, id_user) values ('${req.body.inputTask}','${req.session.id_user}')`,
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log("tasks was added successfully");
            res.redirect("/todo-list");
          }
        }
      );
    }
  });
});

router.get("/cards", (req, res) => {
  if (req.session.isLoggedIn) {
    res.render("../views/templates/index", { req: req });
  } else {
    res.send("you are not logged in");
  }
});

router.post("/logout", (req, res) => {
  req.session.isLoggedIn = !req.session.isLoggedIn;
  res.redirect("/");
});

module.exports = router;
