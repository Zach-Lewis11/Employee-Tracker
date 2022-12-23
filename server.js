const connection = require('./config/connection');
const inquirer = require('inquirer');

const viewAllDep = () => {
    connection.query("SELECT department.id, department.name FROM department", (err, res) => {
        if(err)throw err
        console.table(res);
        runPrompt();
    })
};

const viewRoles = () => {
    connection.query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id", (err, res) => {
        if(err) throw err
        console.table(res);
        runPrompt();
    })
};

const viewAllEmployees = () => {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id", (err, res) => {
        if(err)throw err
        console.table(res);
        runPrompt();
    })
};

const viewEmployeesByDep = () => {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?", (err, res) => {
        if(err)throw err
        console.table(res);
        runPrompt()
    })
};

function addDep() {
    inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What department would you like to add?",
      }
    ]).then(function(res){
      connection.query("INSERT INTO department SET ?",
      {
        name: res.name
      },
      function(err){
        if (err) throw err
        console.log("Department added.");
        console.table(res);
        runPrompt();
      })
    })
};

function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role", (err, res)=>{
      if(err) throw err
      inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "What is the title of this Role?"
        },
        {
          name: "Salary",
          type: "input",
          message: "What is the salary for this role?",
        },
      ])
      .then(function(res){
        connection.query("INSERT INTO role SET ?",
        {
          title: res.Title,
          salary: res.Salary
        },
        function (err) {
          if (err) throw err;
          console.log("Added employee role")
          console.table(res);
          runPrompt();
        }
        );
      });
    })
 
};

function updateRole() {
  connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id")
    .then(([rows]) => {
      let employees = rows;
      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's role do you want to update?",
          choices: employeeChoices
        }
      ])
        .then(res => {
          connection.promise().query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id")
            .then(([rows]) => {
              let roles = rows;
              const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
              }));

              inquirer.prompt([
                {
                  type: "list",
                  name: "roleId",
                  message: "Which role do you want to assign the selected employee?",
                  choices: roleChoices
                }
              ])
                .then((res) => connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?"))
                .then(() => console.log("Updated employee's role"))
                .then(() => runPrompt())
            });
        });
    })
}

function addEmployee() {
  inquirer.prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ])
    .then((res) => {
      let firstName = res.first_name;
      let lastName = res.last_name;

      connection.promise().query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id")
        .then(([rows]) => {
          let roles = rows;
          const roleChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
          }));

          inquirer.prompt({
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleChoices
          })
            .then((res) => {
              let roleId = res.roleId;

              connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id")
                .then(([rows]) => {
                  let employees = rows;
                  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                  }));

                  managerChoices.unshift({ name: "None", value: null });

                  inquirer.prompt({
                    type: "list",
                    name: "managerId",
                    message: "Who is the employee's manager?",
                    choices: managerChoices
                  })
                    .then((res) => {
                      let employee = {
                        manager_id: res.managerId,
                        role_id: roleId,
                        first_name: firstName,
                        last_name: lastName
                      }

                      connection.query("INSERT INTO employee SET ?", employee)
                    })
                    .then(() => console.log(
                      `Added ${firstName} ${lastName} to the database`
                    ))
                    .then(() => runPrompt())
                })
            })
        })
    })
}

function removeEmployee() {
    connection.query("SELECT * FROM employee", (err, res)=> {
        if(err) throw err
        inquirer.prompt([
            {
                name: 'removeEmp',
                type: 'list',
                message: 'Select employee to remove',
                choices: res.map(employee => employee.id && employee.first_name)
            }
        ]).then((selection)=>{
            const selectEmployee = res.find(employee => employee.id && employee.first_name === selection.removeEmp);
            connection .query("DELETE FROM employee WHERE ?",
            [{
                id: selectEmployee.id
            }],
            (err, res) => {
                if(err) throw err
                console.log("Selected employee has been removed");
                runPrompt();
            }
            )
        })
    })
};


const runPrompt = () => {
    inquirer
      .prompt({
        name: 'options',
        type: 'list',
        message: 'Please select what you would like to do.',
        choices: [
          'View All Employees',
          'View All Employees By Department',
          'View All Departments',
          'View All Employee Roles',
          'Add Employee',
          'Remove Employee',
          'Update Employee Role',
          'Add Employee Role',
          'Add Department',
          'Finish Using App'
        ],
      })
      .then((answer) => {
        switch (answer.options) {
          case 'View All Employees':
            viewAllEmployees();
            break;
          
          case 'View All Employees By Department':
            viewEmployeesByDep();
            break;
  
          case 'View All Departments':
            viewAllDep();
            break;
  
          case 'View All Employee Roles':
            viewRoles();
            break;
  
          case 'Add Employee':
            addEmployee();
            break;
  
          case 'Remove Employee':
            removeEmployee();
            break;
  
          case 'Update Employee Role':
            updateRole();
            break;
  
          case 'Add Employee Role':
            addRole();
            break;
  
          case 'Add Department':
            addDep();
            break;
  
          default:
            console.log("Finished Using App!");
            process.exit();
        }
      });
  };
  
  runPrompt();