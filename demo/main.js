import App from "./App";
import "./main.css";

const [fragment, unsubs] = App();

document.querySelector("body").firstChild.before(fragment);
