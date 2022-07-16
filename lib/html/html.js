import { subscribe } from "../reactivity/create-state";
import createDocumentFragment from "./create-document-fragment";
import extractAttributeNameFromString from "./extract-attribute";

const CALLBACKS_PLACEHOLDER = "$$stupidjs$$";

/**
 * Turns a tagged template into a list of reactive document fragment.
 * @param {TemplateStringsArray} strings  The strings from the tagged template
 * @param  {Function[] | Object} callbacks The reactive callbacks
 * @returns {[DocumentFragment, Function[]]}
 */
const html = (strings, ...callbacks) => {
  const unsubs = [];
  // To pass the index's reference the handlers
  let callbackIndex = [0];

  const docFragment = createDocumentFragment(
    strings.join(CALLBACKS_PLACEHOLDER)
  );

  const childnodes = Array.from(docFragment.childNodes);
  childnodes.forEach((node) =>
    handleNode(node, strings, callbacks, callbackIndex, unsubs)
  );

  return [docFragment, unsubs];
};

/**
 * Attach reactive callbacks to a DOM node
 * @param {ChildNode} node The DOM node
 * @param {TemplateStringsArray} strings  The strings from the tagged template
 * @param {Function[] | Object} callbacks The list of reactive callbacks
 * @param {number[]} callbackIndex The index of the next callback to inject
 * @param {Function[]} unsubs The list of unsubscribtions
 * @returns {void}
 */
const handleNode = (node, strings, callbacks, callbackIndex, unsubs) => {
  if (node.nodeType === 3) {
    handleTextNode(node, callbacks, callbackIndex, unsubs);
    return;
  }

  handleAttributes(
    /** @type {HTMLElement}*/ (node),
    strings,
    callbacks,
    callbackIndex,
    unsubs
  );

  const childnodes = Array.from(node.childNodes);
  childnodes.forEach((n) =>
    handleNode(n, strings, callbacks, callbackIndex, unsubs)
  );
};

/**
 * Inject reactive text nodes into a text node.
 * @param {ChildNode} node The text element to split
 * @param {Function[] | Object} callbacks The list of reactive callbacks
 * @param {number[]} callbackIndex The index of the next callback to inject
 * @param {Function[]} unsubs The list of unsubscribtions
 * @returns {void}
 */
const handleTextNode = (node, callbacks, callbackIndex, unsubs) => {
  const contentArray = node.textContent.split(CALLBACKS_PLACEHOLDER);
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

    const callback = callbacks[callbackIndex[0]];
    const callbackResult = callback();

    if (!Array.isArray(callbackResult)) {
      const reactiveTextNode = document.createTextNode("");

      unsubs.concat(
        subscribe(() => {
          reactiveTextNode.textContent = callback();
        })
      );

      node.before(reactiveTextNode);
    } else {
      const [fragment, unsubscibtions] = callbackResult;
      node.before(fragment);
      unsubs.concat(unsubscibtions);
    }

    callbackIndex[0]++;
  }

  node.remove();
};

/**
 * Inject reactive attributes to the DOM node
 * @param {HTMLElement} node The DOM node
 * @param {TemplateStringsArray} strings  The strings from the tagged template
 * @param {Function[] | Object} callbacks The list of reactive callbacks
 * @param {number[]} callbackIndex The index of the next callback to inject
 * @param {Function[]} unsubs The list of unsubscribtions
 * @returns {void}
 */
const handleAttributes = (node, strings, callbacks, callbackIndex, unsubs) => {
  const a = Array.from(node.attributes).filter(
    (attribute) => attribute.value === CALLBACKS_PLACEHOLDER
  );
  const numberOfReactiveAttributes = a.length;

  // We have to re-extract the attribute names from the string because the order
  // of node.attributes might not be the same than in our markup
  for (let i = 0; i < numberOfReactiveAttributes; i++) {
    const attribute = extractAttributeNameFromString(strings[callbackIndex[0]]);

    if (attribute.startsWith("on")) {
      node[attribute] = callbacks[callbackIndex[0]];
    } else if (attribute === "classList") {
      handleClassList(node, callbacks[callbackIndex[0]], unsubs);
    } else if (attribute === "style") {
      handleStyles(node, callbacks[callbackIndex[0]], unsubs);
    } else {
      const callback = callbacks[callbackIndex[0]];

      unsubs.concat(
        subscribe(() => {
          node.setAttribute(attribute, callback());
        })
      );
    }

    callbackIndex[0]++;
  }
};

/**
 *
 * @param {HTMLElement} node
 * @param {Object} classes
 * @param {Function[]} unsubs The list of unsubscribtions
 */
const handleClassList = (node, classes, unsubs) => {
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

/**
 *
 * @param {HTMLElement} node
 * @param {Object} styles
 * @param {Function[]} unsubs The list of unsubscribtions
 */
const handleStyles = (node, styles, unsubs) => {
  for (const style in styles) {
    unsubs.concat(
      subscribe(() => {
        node.style[style] = styles[style]();
      })
    );
  }
};

export default html;
