import { createState } from "./create-state";

/**
 *
 * @param {*} array
 * @returns {Function}
 */
const createArrayState = (array) => {
  const forElements = new Set();

  let reactiveArray = array.map((item) => createState(item));
  const get = () => reactiveArray;

  get.subscribe = (forElement) => {
    forElements.add(forElement);
    return () => forElements.delete(forElement);
  };

  get.splice = (start, deleteCount, ...itemsToAdd) => {
    const reactiveItemsToAdd = itemsToAdd.map((item) => createState(item));

    reactiveArray.splice(start, deleteCount, ...reactiveItemsToAdd);

    forElements.forEach((forElement) =>
      forElement.splice(start, deleteCount, ...reactiveItemsToAdd)
    );
  };

  get.set = (newArray) => {
    const newReactiveArray = newArray.map((newItem, i) =>
      reactiveArray[i] !== undefined && newItem === reactiveArray[i]()
        ? reactiveArray[i]()
        : createState(newItem)
    );

    reactiveArray = newReactiveArray;

    forElements.forEach((forElement) => forElement.set(newReactiveArray));
  };

  return get;
};

export default createArrayState;
