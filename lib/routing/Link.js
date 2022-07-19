import { onPopState } from "./onpopstate";

const Link = (text, href) => {
  const a = document.createElement("a");
  a.textContent = text;
  a.href = href;

  a.onclick = (e) => {
    e.preventDefault();
    window.history.pushState(href, null, href);
    onPopState.dispatch({ state: href });
  };

  return [a, [() => (a.onclick = undefined)]];
};

export default Link;
