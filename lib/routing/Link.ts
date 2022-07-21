import { onPopState } from "./onpopstate";

const Link = (text: string, href: string): [DocumentFragment, Function[]] => {
  const fragment = document.createDocumentFragment();

  const a = document.createElement("a");
  a.textContent = text;
  a.href = href;

  a.onclick = (e: MouseEvent) => {
    e.preventDefault();
    window.history.pushState(href, null, href);
    onPopState.dispatch({ state: href });
  };

  fragment.appendChild(a);

  return [fragment, [() => (a.onclick = undefined)]];
};

export default Link;
