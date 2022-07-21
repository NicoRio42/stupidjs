import { createState } from "../reactivity/create-state";
import { Route } from "./models/router";
import { onPopState } from "./onpopstate";

const Router = (routes: Route[]): [DocumentFragment, Function[]] => {
  let fragment = document.createDocumentFragment();
  let unsubs: Function[] = [];

  const anchor = document.createComment("Router");
  fragment.appendChild(anchor);

  let nodes: ChildNode[] = [];
  let currentHref: string;

  const handlePopState = (e: PopStateEvent) => {
    if (currentHref === e.state) {
      return;
    }

    currentHref = e.state;

    for (const [matcher, component] of routes) {
      const params = matcher(currentHref);

      if (params !== null) {
        nodes.forEach((node) => node.remove());
        unsubs.forEach((unsub) => unsub());

        const [newFragment, newUnsubs] = component(
          ...params.map((param) => createState(param))
        );

        nodes = Array.from(newFragment.childNodes);
        unsubs = newUnsubs;

        anchor.after(newFragment);
        return;
      }
    }
  };

  const unsubToOnPushState = onPopState.subscribe(handlePopState);
  window.addEventListener("popstate", handlePopState);

  // Init
  const popStateEvent = new PopStateEvent("popstate", {
    state: window.location.pathname,
  });
  handlePopState(popStateEvent);

  // cant return the unsub array directly because it is dynamic
  return [
    fragment,
    [
      () => unsubs.forEach((unsub) => unsub()),
      unsubToOnPushState,
      () => window.removeEventListener("popstate", handlePopState),
    ],
  ];
};

export default Router;
