const sequelize = require('./config/connection')
const inquirer = require('inquirer');

const viewAllDep = () => {
    sequelize.query("SELECT name AS Departments FROM department", (err, res) => {
        if(err)throw err
        console.table(res);
        runPrompt();
    })
};

const viewRoles = () => {
    sequelize.query("SELECT title, salary FROM role", (err, res) => {
        if(err) throw err
        console.table(res);
        runPrompt();
    })
};

const viewAllEmployees = () => {
    sequelize.query("SELECT employee.id, employee.first_name, employee.last_name, role.title AS Title, department.name AS Department, role.salary AS Salary FROM employee INNER JOIN employee_role on employee_role.id = employee.role_id INNER JOIN department on department.id = employee_role.department_id", (err, res) => {
        if(err)throw err
        console.table(res);
        runPrompt();
    })
};

const viewEmployeesByDep = () => {
    sequelize.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id", (err, res) => {
        if(err)throw err
        console.table(res);
        runPrompt()
    })
};

const addDep = () => {
    inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What department would you like to add?",
      }
    ]).then(function(answer){
      sequelize.query("INSERT INTO department SET ?",
      {
        name: answer.name
      },
      function(err){
        if (err) throw err
        console.log("Department added.");
        console.table(answer);
        runPrompt();
      })
    })
};

const addRole = () => {
    sequelize.query("SELECT role.title AS Title, role.salary AS Salary FROM role", (err, res)=>{
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
      .then((answers) =>{
        
      })
    })
 
};

const updateRole = () => {

};

const addEmployee = () => {
    sequelize.query("SELECT * FROM role", (err, res)=>{
        if(err) throw err
        inquirer.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'Enter the employee first name.'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'Enter the employee first name.'
            },
            {
                name: 'role_id',
                type: 'list',
                message: 'Select employee role.',
                choices: res.map((item)=> item.title)
            },
        ]).then((answers) => {
            const firstName = answers.first_name;
            const lastName = answers.last_name
        });
        
    });
};

const removeEmployee = () => {
    sequelize.query("SELECT * FROM employee", (err, res)=> {
        if(err) throw err
        inquirer.prompt([
            {
                name: 'removeEmp',
                type: 'list',
                message: 'Select employee to remove',
                choices: res.map(emp => emp.id && emp.first_name)
            }
        ]).then((selection)=>{
            const selectEmp = res.find(emp => emp.id && emp.first_name === selection.removeEmp);
            sequelize.query("DELETE FROM employee WHERE ?",
            [{
                id: selectEmp.id
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
            break;
        }
      });
  };
  