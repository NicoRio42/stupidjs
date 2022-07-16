import { subscribe } from "../reactivity/create-state";

/**
 * A component that add/remove content to/from the DOM given the condition.
 * @param {() => boolean} condition
 * @param {[DocumentFragment, Function[]]} content
 */
const If = (condition, content) => {
  const [fragment, unsubs] = content;

  const nodes = Array.from(fragment.childNodes);

  const anchor = document.createComment("If");
  fragment.firstChild.before(anchor);

  let previousConditionResult;

  unsubs.concat(
    subscribe(() => {
      const newConditionResult = condition();

      if (previousConditionResult === newConditionResult) {
        return;
      }

      previousConditionResult = newConditionResult;

      if (newConditionResult) {
        const l = nodes.length;

        for (let i = l - 1; i >= 0; i--) {
          anchor.after(nodes[i]);
        }

        return;
      }

      nodes.forEach((node) => node.remove());
    })
  );

  return [fragment, unsubs];
};

export default If;
