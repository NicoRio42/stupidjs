import { createState } from "../reactivity/create-state";
import { ArrayState } from "../reactivity/models/array-state";
import { State } from "../reactivity/models/state";
import { ForComponentItem } from "./models/for";

/**
 * A component to iterate on an array state and render a child component for
 * every item
 * @param array An array state created with the createArrayState function
 * @param childComponent A component created with an html tagged string template
 * It takes two states as arguments: one for the item value, on for the index value
 */
const For = <T>(
  array: ArrayState<T>,
  childComponent: (
    arrayItem: State<T>,
    index: State<number>
  ) => [DocumentFragment, Function[]]
) => {
  const fragment = document.createDocumentFragment();
  const unsubs: Function[] = [];
  const itemsNodes: ForComponentItem<T>[] = [];

  const anchor = document.createComment("For");
  fragment.appendChild(anchor);

  array().forEach((arrayItem, i) => {
    const index = createState(i); // TODO: don't create a state if index is not used
    const [itemFragment, unsubscribtions] = childComponent(arrayItem, index);

    itemsNodes.push({
      item: arrayItem,
      index,
      nodes: Array.from(itemFragment.childNodes),
      unsubs: unsubscribtions,
    });

    fragment.appendChild(itemFragment);
  });

  unsubs.push(() =>
    itemsNodes.forEach((node) => node.unsubs.forEach((unsub) => unsub()))
  );

  const splice = (
    start: number,
    deleteCount: number,
    ...itemsToAdd: State<T>[]
  ) => {
    for (let i = start; i < start + deleteCount; i++) {
      itemsNodes[i].nodes.forEach((node) => node.remove());
      itemsNodes[i].unsubs.forEach((unsub) => unsub());
    }

    let startingNode =
      start === 0 ? anchor : itemsNodes[start - 1].nodes.at(-1);

    const itemsNodesToAdd = itemsToAdd.map((itemToAdd, i) => {
      const index = createState(i + start); // TODO: don't create a state if index is not used
      const [itemFragment, unsubscribtions] = childComponent(itemToAdd, index);

      const nodes = Array.from(itemFragment.childNodes);

      startingNode.after(itemFragment);
      startingNode = nodes.at(-1);

      return {
        item: itemToAdd,
        index,
        nodes,
        unsubs: unsubscribtions,
      };
    });

    itemsNodes.splice(start, deleteCount, ...itemsNodesToAdd);

    const itemsNodesLength = itemsNodes.length;

    for (let i = start + itemsToAdd.length; i < itemsNodesLength; i++) {
      itemsNodes[i].index.set(i);
    }
  };

  const set = (newArray) => {};

  unsubs.push(array.subscribe({ splice, set }));

  return [fragment, unsubs];
};

export default For;
