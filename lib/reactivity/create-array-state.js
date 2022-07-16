import { createState } from "./create-state";

/**
 *
 * @param {*} array
 * @returns {Function}
 */
const createArrayState = (array) => {
  const forElements = new Set();

  const reactiveArray = array.map((item) => createState(item));
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

  return get;
};

export default createArrayState;
