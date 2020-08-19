import { RootModel } from '.'
import { onSnapshot, getSnapshot, applySnapshot } from 'mobx-state-tree';
// create a function to create a RootTree instance
export const setupRootStore = () => {
  const rootTree = RootModel.create({
    employer: {
      id: "1",
      name: "Bob's Burgers",
      location: "New York, NY",
      employees: []
    }
  })
  onSnapshot(rootTree, (snapshot) => console.log('snapshot: ', snapshot));
  const currentRootTree = getSnapshot(rootTree);
  applySnapshot(rootTree, {...currentRootTree, employer: {...currentRootTree.employer, location: "Manhattan, NY"}})
  return { rootTree };
}
