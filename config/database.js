const mysql = require("mysql");
const db_name = "studyZenApp";

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
});

const createTableRoles = () => {
  connection.query(`CREATE TABLE roles (
  id_rol INT NOT NULL PRIMARY KEY,
  nombre_rol VARCHAR(25) NOT NULL
)`);
};

const createTableUsers = () => {
  connection.query(`CREATE TABLE users (
  id_user INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(70) NOT NULL,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
  id_rol INT,
  FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
)`);
};

const createTableTodoInfo = () => {
  connection.query(`CREATE TABLE todo_info (
  task_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  task_name VARCHAR(300) NOT NULL,
  id_user INT,
  task_status INT DEFAULT 1,
  FOREIGN KEY (id_user) REFERENCES users(id_user)
)`);
};

const createTableUsersAmount = () => {
  connection.query(`CREATE TABLE users_amount (
  amount_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  id_user INT,
  FOREIGN KEY (id_user) REFERENCES users(id_user)
)`);
};

const createTableDepositTracking = () => {
  connection.query(`CREATE TABLE deposit_tracking (
  amount DECIMAL(10, 2) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_deposit INT,
   id_user INT,
  FOREIGN KEY (id_user) REFERENCES users(id_user),
  FOREIGN KEY (id_deposit) REFERENCES deposit_history(id_deposit)
)`);
};

const createTableDepositHistory = () => {
  connection.query(`CREATE TABLE deposit_history (
  id_deposit INT primary key auto_increment not null,
  amount DECIMAL(10, 2) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_user INT,
  FOREIGN KEY (id_user) REFERENCES users(id_user)
)`);
};

const createTables = () => {
  createTableRoles();
  createTableUsers();
  createTableTodoInfo();
  createTableUsersAmount();
  createTableDepositHistory();
  createTableDepositTracking();
};

const createTriggerHandlingOfDepositHistories = () => {
  connection.query(`CREATE TRIGGER handling_of_deposit_histories
AFTER INSERT ON users_amount
FOR EACH ROW
BEGIN
    INSERT INTO deposit_history (amount, id_user) VALUES (NEW.amount, NEW.id_user);
END`);
};
//  --INSERT INTO deposit_tracking (amount, id_user) VALUES (NEW.amount, NEW.id_user);

const createTriggerhandling_of_id_deposit_tracking = () => {
  connection.query(`CREATE TRIGGER handling_of_id_deposit_tracking
BEFORE INSERT ON deposit_history
FOR EACH ROW
BEGIN
    INSERT INTO deposit_tracking (amount, id_deposit, id_user) VALUES (NEW.amount, NEW.id_deposit, NEW.id_user);
END`);
};

const createTriggerHandlingOfDepositHistoriesUpdate = () => {
  connection.query(`CREATE TRIGGER handling_of_deposit_histories_update
AFTER UPDATE ON users_amount
FOR EACH ROW
BEGIN
    INSERT INTO deposit_history (amount, id_user) VALUES (NEW.amount - OLD.amount, NEW.id_user);
END`);
};

const createTriggerHandlingOfDepositTrackingUpdate = () => {
  connection.query(`CREATE TRIGGER handling_of_deposit_tracking_update
AFTER INSERT ON deposit_history
FOR EACH ROW
BEGIN
    DECLARE total_amount INT;
    
    -- Obtener el total de "amount" desde deposit_history para el usuario actual
    SELECT SUM(amount) INTO total_amount
    FROM deposit_history
    WHERE id_user = NEW.id_user;
    
    -- Insertar el valor total en la tabla deposit_tracking
    INSERT INTO deposit_tracking (amount, id_deposit, id_user) VALUES (total_amount, NEW.id_deposit, NEW.id_user);
END`);
};

const createTriggerSettingInitialDeposit = () => {
  connection.query(`CREATE TRIGGER setting_initial_deposit
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO users_amount (amount, id_user) VALUES (0, NEW.id_user);
END`);
};

const createTriggers = () => {
  createTriggerHandlingOfDepositHistories();
  createTriggerSettingInitialDeposit();
  createTriggerHandlingOfDepositHistoriesUpdate();
  createTriggerHandlingOfDepositTrackingUpdate();
};

const createDatabase = (databaseName) => {
  connection.query(`create database ${databaseName}`, function (err, result) {
    if (err) {
      console.error(err.message);
    } else {
      connection.query(`use ${databaseName}`, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          createTables();
          createTriggers();
        }
      });
      console.log("database created successfully");
    }
  });
};

connection.connect(function (err) {
  // this line makes the connection, if connection is
  //failed, its send a error message
  if (err) {
    console.error("error connecting:" + err.stack);
  } else {
    // if connection is successful, eject the follow query and call the createDatabase method
    connection.query(
      `show databases like '%${db_name}%'`,
      function (err, result) {
        if (err) {
          console.error(err.message);
        } else {
          if (result.length === 0) {
            createDatabase(db_name);
          }
        }
      }
    );
  }
  connection.commit();
});

module.exports = connection;
