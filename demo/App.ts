import html from "../lib/html/html";
import { Component } from "../lib/html/models/html";
import { State } from "../lib/reactivity/models/state";
import Link from "../lib/routing/Link";
import { Route } from "../lib/routing/models/router";
import route from "../lib/routing/route";
import Router from "../lib/routing/Router";
import About from "./components/About";
import Index from "./components/Index";
import Post from "./components/Post";
import TodoList from "./components/TodoList";

const App = (): Component => {
  const routes: Route[] = [
    [route`/`, Index],
    [route`/about`, About],
    [route`/todo`, TodoList],
    [
      route`/posts/${"slug"}/numberOfViews/${"numberOfViews"}`,
      (slug: State<string>, numberOfViews: State<number>) =>
        Post(slug, numberOfViews),
    ],
    [route`/posts/${"slug"}`, (slug: State<string>) => Post(slug, undefined)],
  ];

  return html`
    <nav>
      <ul>
        <li>${() => Link("StupidJS", "/")}</li>

        <li>${() => Link("Todo list", "/todo")}</li>

        <li>${() => Link("About", "/about")}</li>

        <li>${() => Link("Post 1", "/posts/my-first-post")}</li>

        <li>
          ${() => Link("Post 2", "/posts/my-second-post/numberOfViews/30")}
        </li>
      </ul>
    </nav>

    ${() => Router(routes)}
  `;
};

export default App;
