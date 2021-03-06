const employees = [
  { id: 1, name: 'moe' },
  { id: 2, name: 'larry', managerId: 1 },
  { id: 4, name: 'shep', managerId: 2 },
  { id: 3, name: 'curly', managerId: 1 },
  { id: 5, name: 'groucho', managerId: 3 },
  { id: 6, name: 'harpo', managerId: 5 },
  { id: 8, name: 'shep Jr.', managerId: 4 },
  { id: 99, name: 'lucy', managerId: 1 }
]

const spacer = (text) => {
  if (!text) {
    return console.log('')
  }
  const stars = new Array(5).fill('*').join('')
  console.log(`${stars} ${text} ${stars}`)
}

// cool use of reduce
// reduce can emulate a lot of the array prototype methods
// but I'm gonna blow your mind
// you actually wrote a .find using reduce
// good variable names too
function findEmployeeByName(name, empArr) {
  return empArr.reduce((accum, emp) => {
    if (emp.name === name) {
      accum = emp
    }
    return accum
  }, {})
}

spacer('findEmployeeByName Moe')
// given a name and array of employees, return employee
console.log(findEmployeeByName('moe', employees))//{ id: 1, name: 'moe' }
spacer('')

function findManagerFor(empObj, empArr) {
  // so this is getting the mgmt id for the object?
  // but you already have the object!
  const mgmtID = empArr.reduce((accum, emp) => {
    if (emp === empObj) {
      accum = emp.managerId
    }
    return accum
  }, 0)

  // just like the other func, you remade .find
  // if you have time, going back and trying to rewrite them in that way might be good practice
  // to familiarize with the other methods
  return empArr.reduce((accum, emp) => {
    if (emp.id === mgmtID) {
      accum = emp
    }
    return accum
  }, {})
}

spacer('findManagerFor Shep')
//given an employee and a list of employees, return the employee who is the manager
console.log(findManagerFor(findEmployeeByName('shep Jr.', employees), employees))//{ id: 4, name: 'shep', managerId: 2 }
spacer('')

function findCoworkersFor(empObj, empArr) {
  const retID = findManagerFor(empObj, empArr).id

  // you are a pro with reduce, let me tell you
  // you are re-creating array methods with just reduce
  // that's not bad in any way, I just want to be sure you're comfortable
  // using all array methods
  return empArr.reduce((accum, emp) => {
    if (emp.managerId === retID && emp !== empObj) {
      accum.push(emp)
    }
    return accum
  }, [])
}

spacer('findCoworkersFor Larry')

//given an employee and a list of employees, return the employees who report to the same manager
console.log(findCoworkersFor(findEmployeeByName('larry', employees), employees))/*
[ { id: 3, name: 'curly', managerId: 1 },
  { id: 99, name: 'lucy', managerId: 1 } ]
*/

spacer('')

// extremely elegant recursive soultion
// variable names could use a bit of touch-up but that's my only complaint here
// good job
function findManagementChainForEmployee(empObj, empArr) {
  let nextLevel = findManagerFor(empObj, empArr)

  if (!empObj.managerId) {
    return []
  } else {
    let retArr = findManagementChainForEmployee(nextLevel, empArr)
    retArr.push(nextLevel)
    return retArr
  }
}

spacer('findManagementChain for moe')
//given an employee and a list of employees, return a the management chain for that employee. The management chain starts from the employee with no manager with the passed in employees manager
console.log(findManagementChainForEmployee(findEmployeeByName('moe', employees), employees))//[  ]
spacer('')

spacer('findManagementChain for shep Jr.')
console.log(findManagementChainForEmployee(findEmployeeByName('shep Jr.', employees), employees))/*
[ { id: 1, name: 'moe' },
  { id: 2, name: 'larry', managerId: 1 },
  { id: 4, name: 'shep', managerId: 2 }]
*/
spacer('')

function generateManagementTree(employees) {
  // wait, you used find here!
  // now go back up and redo the others with find
  const root = employees.find(employee => !employee.managerId)

  // when do you use map vs forEach?
  employees.map(currentReport => {
    let lowerLevel = employees.reduce((accum, employee) => {
      if (findManagerFor(employee, employees) === currentReport) {
        accum.push(employee)
      }
      return accum
    }, [])

    // if the length is 0, what is lowerLevel?
    if (lowerLevel.length === 0) {
      currentReport.reports = []
    } else {
      currentReport.reports = lowerLevel
    }

    return currentReport
  })

  return root
}

spacer('generateManagementTree')
//given a list of employees, generate a tree like structure for the employees, starting with the employee who has no manager. Each employee will have a reports property which is an array of the employees who report directly to them.
console.log(JSON.stringify(generateManagementTree(employees), null, 2))
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
spacer('')

// I'll give you credit on the approach, but anytime you have something that can
// be arbitrarily nested, it should yell "RECURSION" moving forward.
// what if there were six nested levels of reports?
// the recursive approach isn't super clear at first but we can go over it during office hours if you want
function displayManagementTree(mgmt) {
  let retStr = mgmt.name

  for (let i = 0; i < mgmt.reports.length; i++) {
    let currentEmployee = mgmt.reports[i]

    let nextLevel = currentEmployee.reports

    if (nextLevel.length === 0) {
      retStr += '\n-' + currentEmployee.name
    } else {
      retStr += '\n-' + currentEmployee.name

      for (let j = 0; j < nextLevel.length; j++) {
        let currentEmployeeJ = nextLevel[j]

        let nextLevelJ = currentEmployeeJ.reports

        if (nextLevelJ.length === 0) {
          retStr += '\n--' + currentEmployeeJ.name
        } else {
          retStr += '\n--' + currentEmployeeJ.name

          for (let k = 0; k < nextLevelJ.length; k++) {
            let currentEmployeeK = nextLevelJ[k]

            let nextLevelK = currentEmployeeK.reports

            if (nextLevelK.length === 0) {
              retStr += '\n---' + currentEmployeeK.name
            }
          }
        }
      }
    }
  }

  return retStr
}

spacer('displayManagementTree')
//given a tree of employees, generate a display which displays the hierarchy
console.log(displayManagementTree(generateManagementTree(employees)))/*
moe
-larry
--shep
---shep Jr.
-curly
--groucho
---harpo
-lucy
*/
