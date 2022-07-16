import Reactivity from "./components/Reactivity";
import "./style.css";

const [reactivityElement, unsubscribe] = Reactivity();

const app = document.querySelector("#app");
app.appendChild(reactivityElement);
