import createElement from "./create-element";

function render(nodes) {
  const fragment = document.createDocumentFragment();
  const unsubs = [];

  nodes.forEach((node) => {
    const [element, unsub] = createElement(node);
    fragment.appendChild(element);
    unsubs.push(unsub);
  });

  return [fragment, () => unsubs.forEach((unsub) => unsub())];
}

export default render;
