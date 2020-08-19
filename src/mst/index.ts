import { types, Instance, applySnapshot, onSnapshot, flow } from 'mobx-state-tree';
import {v4 as uuid } from "uuid";
import api from "axios";

const EmployeeModel = types.model("Employee", {
  id: types.identifier,
  name: types.string,
  hours_worked: types.number
})
.actions(self => {
  function edit_employee(name: string, hours_worked: number) {
    applySnapshot(self, {...self, name, hours_worked})
  }
  return { edit_employee }
})

const EmployerModel = types.model("Employer", {
  // uuid uses strings, identifier is a string
  id: types.identifier,
  name: types.string,
  location: types.string,
  employees: types.array(EmployeeModel)
})
// actions are the only way you can edit the tree
.actions(self => {
  function newEmployee(name: string, hours_worked: number) {
    // generates a random string id:
    const id = uuid();
    applySnapshot(self, {...self, employees: [{id, name, hours_worked}, ...self.employees]});
  }
  // function* is a generator function, works like async/await
  const save = flow(function* save(snapshot:any) {
    try {
      // yield is like await
    const response = yield api.post('/employers', {snapshot});
    console.log(response)
    } catch(e) {
      console.log(e)
    }
  })
  function afterCreate() {
    onSnapshot(self, (snapshot: any) => save(snapshot));
  }
  return { newEmployee, save, afterCreate }
})
.views(self => ({
  get num_employees() {
    return self.employees.length;
  },
  // memoization isn't used when a function has a parameter
  filtered_employees(searchString: string) {
    return self.employees.filter(employee => employee.name.includes(searchString))
  }
}))
// for issue #440, too many instances being created. however, is outside of snapshots
// .volatile(self => {
//   employees: []
// })

const RootModel = types.model("Root", {
  employer: EmployerModel
})

export { RootModel }

export type Root = Instance<typeof RootModel>
export type Employer = Instance<typeof EmployerModel>
export type Employee = Instance<typeof EmployeeModel>
