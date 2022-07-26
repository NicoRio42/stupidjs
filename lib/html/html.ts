import { subscribe } from "../reactivity/create-state";
import { State } from "../reactivity/models/state";
import createDocumentFragment from "./create-document-fragment";
import extractAttributeNameFromString from "./extract-attribute";
import { ClassListObject, Component, StyleObject } from "./models/html";
import { Reference } from "./models/reference";

const PLACEHOLDER = "$$stupidjs$$";

/**
 * Turns a tagged template into a list of reactive document fragment.
 */
const html = (
  strings: TemplateStringsArray,
  ...reactiveContents: (
    | Function
    | ClassListObject
    | StyleObject
    | State<unknown>
  )[]
): Component => {
  const unsubs: Function[] = [];
  // To pass the index's reference the handlers
  let reactiveContentIndex: [number] = [0];

  const docFragment = createDocumentFragment(strings.join(PLACEHOLDER));

  const childnodes = Array.from(docFragment.childNodes);
  childnodes.forEach((node) =>
    handleNode(node, strings, reactiveContents, reactiveContentIndex, unsubs)
  );

  return [docFragment, unsubs];
};

/**
 * Attach reactive callbacks to a DOM node
 */
const handleNode = (
  node: ChildNode,
  strings: TemplateStringsArray,
  reactiveContents: (
    | Function
    | ClassListObject
    | StyleObject
    | State<unknown>
  )[],
  reactiveContentIndex: [number],
  unsubs: Function[]
): void => {
  if (node.nodeType === 3) {
    handleTextNode(
      node as Text,
      reactiveContents as Function[],
      reactiveContentIndex,
      unsubs
    );
    return;
  }

  handleAttributes(
    node as HTMLElement,
    strings,
    reactiveContents,
    reactiveContentIndex,
    unsubs
  );

  Array.from(node.childNodes).forEach((n) =>
    handleNode(n, strings, reactiveContents, reactiveContentIndex, unsubs)
  );
};
const t = document.createTextNode("");
/**
 * Inject reactive text nodes or compoenents into a text node.
 */
const handleTextNode = (
  node: Text,
  reactiveContents: Function[],
  reactiveContentIndex: [number],
  unsubs: Function[]
) => {
  if (node.textContent === null) {
    return;
  }

  const contentArray = node.textContent.split(PLACEHOLDER);

  const l = contentArray.length;

  if (l === 1) {
    return;
  }

  for (let i = 0; i < l; i++) {
    if (contentArray[i] !== "") {
      const textNode = document.createTextNode(contentArray[i]);
      node.before(textNode);
    }

    if (i === l - 1) {
      break;
    }

    const callback = reactiveContents[reactiveContentIndex[0]];
    const callbackResult = callback();

    // If the result is an array, it means it is a component. If not, it is
    // a reactive string
    if (!Array.isArray(callbackResult)) {
      const reactiveTextNode = document.createTextNode("");

      unsubs.concat(
        subscribe(() => {
          reactiveTextNode.textContent = callback();
        })
      );

      node.before(reactiveTextNode);
    } else {
      const [fragment, unsubscibtions] = callbackResult as [
        DocumentFragment,
        Function[]
      ];
      node.before(fragment);
      unsubs.concat(unsubscibtions);
    }

    reactiveContentIndex[0]++;
  }

  node.remove();
};

/**
 * Inject reactive attributes to the DOM node
 */
const handleAttributes = (
  node: HTMLElement,
  strings: TemplateStringsArray,
  reactiveContents: (
    | Function
    | ClassListObject
    | StyleObject
    | State<unknown>
  )[],
  reactiveContentIndex: [number],
  unsubs: Function[]
): void => {
  const numberOfReactiveAttributes = Array.from(node.attributes).filter(
    (attribute) => attribute.value === PLACEHOLDER
  ).length;

  // We have to re-extract the attribute names from the string because the order
  // of node.attributes might not be the same than in our markup
  for (let i = 0; i < numberOfReactiveAttributes; i++) {
    const attribute = extractAttributeNameFromString(
      strings[reactiveContentIndex[0]]
    );

    const reactiveContent = reactiveContents[reactiveContentIndex[0]];

    if (attribute.startsWith("bind")) {
      const attributeToBind = attribute.replace("bind:", "");

      if (attributeToBind === "value") {
        node.oninput = (e) => reactiveContent.set(e.target.value);

        unsubs.concat(
          subscribe(() => {
            node[attributeToBind] = (reactiveContent as Function)();
          })
        );
      }

      if (attributeToBind === "checked") {
        node.oninput = (e) => reactiveContent.set(e.target.checked);

        unsubs.concat(
          subscribe(() => {
            node[attributeToBind] = (reactiveContent as Function)();
          })
        );
      }
    } else if (attribute.startsWith("on")) {
      if (attribute.includes("|")) {
        const [event, modifier] = attribute.split("|");

        node[event] = (e) => {
          e[modifier]();
          reactiveContent();
        };
      } else {
        node[attribute] = reactiveContent;
      }
    } else if (attribute === "classList") {
      handleClassList(node, reactiveContent as ClassListObject, unsubs);
    } else if (attribute === "style") {
      handleStyles(node, reactiveContent as StyleObject, unsubs);
    } else if (attribute === "value") {
      unsubs.concat(
        subscribe(() => {
          node[attribute] = (reactiveContent as Function)();
        })
      );
    } else if (attribute === "ref") {
      (reactiveContent as Reference<unknown>).set(node);
    } else {
      unsubs.concat(
        subscribe(() => {
          node.setAttribute(attribute, (reactiveContent as Function)());
        })
      );
    }

    reactiveContentIndex[0]++;
  }
};

const handleClassList = (
  node: HTMLElement,
  classes: ClassListObject,
  unsubs: Function[]
) => {
  for (const cls in classes) {
    unsubs.concat(
      subscribe(() => {
        const shouldAddClass = classes[cls]();

        if (shouldAddClass) {
          node.classList.add(cls);
          return;
        }

        node.classList.remove(cls);
      })
    );
  }
};

const handleStyles = (
  node: HTMLElement,
  styles: StyleObject,
  unsubs: Function[]
) => {
  for (const style in styles) {
    unsubs.concat(
      subscribe(() => {
        node.style[style] = styles[style]();
      })
    );
  }
};

export default html;
