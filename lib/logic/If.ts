import { Component } from "../html/models/html";
import { subscribe } from "../reactivity/create-state";

/**
 * A component that add/remove content to/from the DOM given the condition.
 * @param condition A function that returns a boolean
 * @param content The result of a html tagged string template
 * @param fallback The result of a html tagged string template
 */
const If = (
  condition: () => boolean,
  content: () => Component,
  fallback?: () => Component
): Component => {
  const fragment = document.createDocumentFragment();
  const anchor = document.createComment("If");
  fragment.append(anchor);

  let currentNodes: ChildNode[] = [];
  let contentUnsubs: Function[] = [];
  let previousConditionResult: boolean;

  const unsubs = subscribe(() => {
    const newConditionResult = condition();

    if (previousConditionResult === newConditionResult) {
      return;
    }

    previousConditionResult = newConditionResult;

    currentNodes.forEach((node) => node.remove());
    contentUnsubs.forEach((unsub) => unsub());

    if (!newConditionResult && fallback === undefined) {
      currentNodes = [];
      contentUnsubs = [];
      return;
    }

    const [newFragment, newUnsubs] = newConditionResult
      ? content()
      : fallback();

    contentUnsubs = newUnsubs;
    currentNodes = Array.from(newFragment.childNodes);
    anchor.after(newFragment);
  });

  return [
    fragment,
    [
      () => unsubs.forEach((unsub) => unsub()),
      () => contentUnsubs.forEach((unsub) => unsub()),
    ],
  ];
};

export default If;
