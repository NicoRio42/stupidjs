import html from "../lib/html/html";
import Link from "../lib/routing/Link";
import route from "../lib/routing/route";
import Router from "../lib/routing/Router";
import About from "./components/About";
import Index from "./components/Index";
import Post from "./components/Post";
import TodoList from "./components/TodoList/TodoList";

const App = () => {
  const routes = [
    [route`/`, Index],
    [route`/about`, About],
    [route`/todo`, TodoList],
    [
      route`/posts/${"slug"}/numberOfViews/${"numberOfViews"}`,
      (slug, numberOfViews) => Post(slug, numberOfViews),
    ],
    [route`/posts/${"slug"}`, (slug) => Post(slug)],
  ];

  return html`
    <ul>
      <li>${() => Link("StupidJS", "/")}</li>

      <li>${() => Link("Todo list", "/todo")}</li>

      <li>${() => Link("About", "/about")}</li>

      <li>${() => Link("Post 1", "/posts/my-first-post")}</li>

      <li>${() => Link("Post 2", "/posts/my-second-post/numberOfViews/30")}</li>
    </ul>

    ${() => Router(routes)}
  `;
};

export default App;
