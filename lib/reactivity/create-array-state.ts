import { ForComponentModifiers } from "../logic/models/for";
import { createState } from "./create-state";
import { ArrayState } from "./models/array-state";
import { State } from "./models/state";

const createArrayState = <T>(array: T[]): ArrayState<T> => {
  const forComponentsModifiers = new Set<ForComponentModifiers<T>>();

  let reactiveArray = array.map((item) => createState<T>(item));
  const get = (): State<T>[] => reactiveArray;

  get.subscribe = (forComponentsModifier: ForComponentModifiers<T>) => {
    forComponentsModifiers.add(forComponentsModifier);

    return () => forComponentsModifiers.delete(forComponentsModifier);
  };

  get.splice = (
    start: number,
    deleteCount: number,
    ...itemsToAdd: T[]
  ): void => {
    const reactiveItemsToAdd = itemsToAdd.map((item) => createState(item));

    reactiveArray.splice(start, deleteCount, ...reactiveItemsToAdd);

    forComponentsModifiers.forEach((forElement) =>
      forElement.splice(start, deleteCount, ...reactiveItemsToAdd)
    );
  };

  get.push = (itemToAdd: T): void => {
    const reactiveItemToAdd = createState(itemToAdd);

    forComponentsModifiers.forEach((forElement) =>
      forElement.splice(reactiveArray.length, 0, reactiveItemToAdd)
    );

    reactiveArray.push(reactiveItemToAdd);
  };

  get.pop = (): T | undefined => {
    if (reactiveArray.length === 0) {
      return;
    }

    forComponentsModifiers.forEach((forElement) =>
      forElement.splice(reactiveArray.length - 1, 1)
    );

    return reactiveArray.pop()();
  };

  get.set = (newArray: T[]): void => {
    const newReactiveArray: State<T>[] = newArray.map((newItem, i) =>
      reactiveArray[i] !== undefined && newItem === reactiveArray[i]()
        ? reactiveArray[i]
        : createState(newItem)
    );

    reactiveArray = newReactiveArray;

    // forComponentsModifiers.forEach((forElement) => forElement.set(newReactiveArray));
  };

  return get;
};

export default createArrayState;
