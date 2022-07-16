import TodoList from "./components/TodoList/TodoList";
import "./main.css";

const [fragment, unsubs] = TodoList();

document.querySelector("body").firstChild.before(fragment);
