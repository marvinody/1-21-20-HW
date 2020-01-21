const employees = [
    { id: 1, name: 'moe'},
    { id: 2, name: 'larry', managerId: 1},
    { id: 4, name: 'shep', managerId: 2},
    { id: 3, name: 'curly', managerId: 1},
    { id: 5, name: 'groucho', managerId: 3},
    { id: 6, name: 'harpo', managerId: 5},
    { id: 8, name: 'shep Jr.', managerId: 4},
    { id: 99, name: 'lucy', managerId: 1}
  ];
  
  const spacer = (text)=> {
    if(!text){
      return console.log('');
    }
    const stars = new Array(5).fill('*').join('');
    console.log(`${stars} ${text} ${stars}`);
  }
  
  function findEmployeeByName(name, empArr) {
    return empArr.reduce((accum, emp) => {
      if (emp.name === name) {
        accum = emp;
      }
      return accum;
    }, {})
  }
  
  spacer('findEmployeeByName Moe')
  // given a name and array of employees, return employee
  console.log(findEmployeeByName('moe', employees));//{ id: 1, name: 'moe' }
  spacer('')
  
  // function findManagerFor(empObj, empArr) {
  //   return empArr.reduce((accum, emp) => {
  //     if (emp === empObj) {
  //       let retVal = emp.managerId;
  //       accum = empArr
  //     }
  //     return accum;
  //   }, {})
  // }
  
  function findManagerFor(empObj, empArr) {
    const mgmtID = empArr.reduce((accum, emp) => {
      if (emp === empObj) {
        accum = emp.managerId;
      }
      return accum;
    }, 0)
  
    return empArr.reduce((accum, emp) => {
      if (emp.id === mgmtID) {
        accum = emp;
      }
      return accum;
    }, {})
  }
  
  spacer('findManagerFor Shep')
  //given an employee and a list of employees, return the employee who is the manager
  console.log(findManagerFor(findEmployeeByName('shep Jr.', employees), employees));//{ id: 4, name: 'shep', managerId: 2 }
  spacer('')
  
  function findCoworkersFor(empObj, empArr) {
    const retID = findManagerFor(empObj, empArr).id;
  
    return empArr.reduce((accum, emp) => {
      if (emp.managerId === retID && emp !== empObj) {
        accum.push(emp);
      }
      return accum
    }, [])
  }
  
  spacer('findCoworkersFor Larry')
  
  //given an employee and a list of employees, return the employees who report to the same manager
  console.log(findCoworkersFor(findEmployeeByName('larry', employees), employees));/*
  [ { id: 3, name: 'curly', managerId: 1 },
    { id: 99, name: 'lucy', managerId: 1 } ]
  */
  
  spacer('');
  
  function findManagementChainForEmployee(empObj, empArr) {
    let nextLevel = findManagerFor(empObj, empArr);
  
    if (!empObj.managerId) {
      return [];
    } else {
      let retArr = findManagementChainForEmployee(nextLevel, empArr);
      retArr.push(nextLevel);
      return retArr;
    }
  }
  
  spacer('findManagementChain for moe')
  //given an employee and a list of employees, return a the management chain for that employee. The management chain starts from the employee with no manager with the passed in employees manager 
  console.log(findManagementChainForEmployee(findEmployeeByName('moe', employees), employees));//[  ]
  spacer('');
  
  spacer('findManagementChain for shep Jr.')
  console.log(findManagementChainForEmployee(findEmployeeByName('shep Jr.', employees), employees));/*
  [ { id: 1, name: 'moe' },
    { id: 2, name: 'larry', managerId: 1 },
    { id: 4, name: 'shep', managerId: 2 }]
  */
  spacer('');
  
  // function generateManagementTree(empArr) {
  //   return empArr.map(emp => {
  //     emp.reports = [];
  
  //     for (let i=0; i<empArr.length; i++) {
  //       if (findManagementChainForEmployee(empArr[i], empArr).includes(emp) && !emp.reports.includes(empArr[i])) {
  //         emp.reports.push(empArr[i]);
  //       }
  //     }
      
  //     return emp;
  //   })
  // }
  
  // function generateManagementTree(employees) {
  //   const head = employees.find(employee => !employee.managerId)
  
  //   for (let i=0; i<employees.length; i++) {
  //     let currentEmployee = employees[i];
  
  //     currentEmployee.reports = [];
  
  //     if (currentEmployee === head) {
  //       return currentEmployee;
  //     } else {
  //       let managementChain = findManagementChainForEmployee(currentEmployee, employees);
  //       generateManagementTree(managementChain);
  //     }
  //   }
  // }
  
  function findEmployees(empObj, employees) {
    return employees.reduce((accum, employee) => {
        if (findManagerFor(employee, employees) === empObj) {
            accum.push(employee);
        }
        return accum;
    }, []);
  }
  
  function generateManagementTree(employees) {
    const root = employees.find(employee => !employee.managerId)
  
    root.reports = findEmployees(root, employees);
    
    let reports = root.reports;
    
    for (let i=0; i<reports.length; i++) {
        reports[i].reports = findEmployees(reports[i], employees);
    }
    
    for (i=0; i<reports.length; i++) {
        for (let j=0; j<reports[i].reports.length; j++) {
            reports[i].reports[j].reports = findEmployees(reports[i].reports[j], employees);
        }
    }
  
    return root;
  }
  
  // function generateManagementTree(employeesArr) {
  //   const root = employees.find(employee => !employee.managerId)
  
  //   root.reports = findEmployees(root, employeesArr);
    
  //   let reports = root.reports;
    
  //   for (let i=0; i<reports.length; i++) {
  //       reports[i].reports = findEmployees(reports[i], employeesArr);
  //   }
    
  //   for (i=0; i<reports.length; i++) {
  //       for (let j=0; j<reports[i].reports.length; j++) {
  //           reports[i].reports[j].reports = findEmployees(reports[i].reports[j], employeesArr);
  //       }
  //   }
  
  //   return root;
  // }
  
  spacer('generateManagementTree')
  //given a list of employees, generate a tree like structure for the employees, starting with the employee who has no manager. Each employee will have a reports property which is an array of the employees who report directly to them.
  console.log(JSON.stringify(generateManagementTree(employees), null, 2));
  /*
  {
    "id": 1,
    "name": "moe",
    "reports": [
      {
        "id": 2,
        "name": "larry",
        "managerId": 1,
        "reports": [
          {
            "id": 4,
            "name": "shep",
            "managerId": 2,
            "reports": [
              {
                "id": 8,
                "name": "shep Jr.",
                "managerId": 4,
                "reports": []
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "name": "curly",
        "managerId": 1,
        "reports": [
          {
            "id": 5,
            "name": "groucho",
            "managerId": 3,
            "reports": [
              {
                "id": 6,
                "name": "harpo",
                "managerId": 5,
                "reports": []
              }
            ]
          }
        ]
      },
      {
        "id": 99,
        "name": "lucy",
        "managerId": 1,
        "reports": []
      }
    ]
  }
  */
  spacer('');
  
  function displayManagementTree(mgmtTree) {
    let retArr = [];
  
    for (let employee in mgmtTree) {
      retArr.push(mgmtTree[employee]);
    }
  
    return retArr;
  }
  
  
  spacer('displayManagementTree')
  //given a tree of employees, generate a display which displays the hierarchy
  displayManagementTree(generateManagementTree(employees));/*
  moe
  -larry
  --shep
  ---shep Jr.
  -curly
  --groucho
  ---harpo
  -lucy
  */