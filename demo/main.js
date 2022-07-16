import html from "../lib/html/html";
import For from "../lib/logic/For";
import If from "../lib/logic/If";
import createArrayState from "../lib/reactivity/create-array-state";
import { createState } from "../lib/reactivity/create-state";
import Nested from "./components/Nested";
import "./main.css";

const Test = () => {
  const name = createState("Toto");
  const count = createState(0);
  const show = createState(true);
  const todos = createArrayState(["toto", "titi", "tata", "tutu"]);

  let newTodo = "";
  let newTodoIndex = 0;

  const onToto = (message) => alert(message);

  const addTodo = () => {
    if (!(0 <= newTodoIndex <= todos().length)) {
      alert("Index out of bound");
      return;
    }

    todos.splice(newTodoIndex, 0, newTodo);
  };

  return html`
    <input value=${name} oninput=${(e) => name.set(e.target.value)} />

    <input value=${name} oninput=${(e) => name.set(e.target.value)} />

    <p classList=${{ green: () => name() === "Nicolas" }}>
      The name is : ${name}
    </p>

    ${() =>
      Nested(count, () => html` <p>Name from inside : ${name}</p> `, onToto)}

    <p style=${{ color: () => (count() < 10 ? "blue" : "red") }}>
      Count from ouside : ${count}
    </p>

    <input
      type="checkbox"
      checked=${show}
      onchange=${(e) => show.set(e.target.checked)}
    />

    ${() => If(show, html`<p>The checkbox is checked !</p>`)}

    <ul>
      ${() =>
        For(
          todos,
          (item, index) =>
            html` <li>
              Item number ${() => index() + 1}: ${item}

              <button onclick=${() => todos.splice(index(), 1)}>Delete</button>
            </li>`
        )}
    </ul>

    <p>Mirror list</p>

    <ul>
      ${() =>
        For(
          todos,
          (item, index) =>
            html` <li>
              Item number ${() => index() + 1}: ${item}

              <button onclick=${() => todos.splice(index(), 1)}>Delete</button>
            </li>`
        )}
    </ul>

    <input oninput=${(e) => (newTodo = e.target.value)} />
    <input
      type="number"
      oninput=${(e) => (newTodoIndex = Number(e.target.value))}
    />

    <button onclick=${addTodo}>Add new todo</button>
  `;
};

const [fragment, unsubs] = Test();

document.querySelector("#app").appendChild(fragment);

{
  /* <ul>
${() =>
  For(
    todos,
    ([item, setItem], index) => html` <li>
      Item number ${index}: ${item}
    </li>`
  )}
</ul> */
}
