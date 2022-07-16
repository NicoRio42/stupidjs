import { createState } from "../reactivity/create-state";

const For = (array, component) => {
  const fragment = document.createDocumentFragment();
  const unsubs = [];
  const itemsNodes = [];

  const anchor = document.createComment("For");
  fragment.appendChild(anchor);

  array().forEach((arrayItem, i) => {
    const index = createState(i); // TODO: don't create a state if index is not used
    const [itemFragment, unsubscribtions] = component(arrayItem, index);

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

  const splice = (start, deleteCount, ...itemsToAdd) => {
    for (let i = start; i < start + deleteCount; i++) {
      itemsNodes[i].nodes.forEach((node) => node.remove());
      itemsNodes[i].unsubs.forEach((unsub) => unsub());
    }

    let anchorNode = start === 0 ? anchor : itemsNodes[start - 1].nodes.at(-1);

    const itemsNodesToAdd = itemsToAdd.map((itemToAdd, i) => {
      const index = createState(i + start); // TODO: don't create a state if index is not used
      const [itemFragment, unsubscribtions] = component(itemToAdd, index);

      const nodes = Array.from(itemFragment.childNodes);

      anchorNode.after(itemFragment);
      anchorNode = nodes.at(-1);

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
