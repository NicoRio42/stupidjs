import TodoList from "./components/TodoList";
import "./main.css";

const [fragment, unsubs] = TodoList();

document.querySelector("#app").appendChild(fragment);
