import { subscribe } from "../reactivity/create-state";

/**
 * A component that add/remove content to/from the DOM given the condition.
 * @param condition A function that returns a boolean
 * @param content The result of a html tagged string template
 */
const If = (
  condition: () => boolean,
  content: [DocumentFragment, Function[]]
): [DocumentFragment, Function[]] => {
  const [fragment, unsubs] = content;

  const nodes = Array.from(fragment.childNodes);

  const anchor = document.createComment("If");
  fragment.firstChild.before(anchor);

  let previousConditionResult: boolean;

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
