import html from "../../../lib/html/html";
import For from "../../../lib/logic/For";
import createArrayState from "../../../lib/reactivity/create-array-state";
import { createState } from "../../../lib/reactivity/create-state";
import TodoRowItem from "../TodoRowItem/TodoRowItem";
import "./TodoList.css";

const TodoList = () => {
  const todos = createArrayState(
    ["Do something", "Do something else", "Fix this bug"].map(
      (description) => ({
        description,
        done: createState(false),
      })
    )
  );

  let newItem = "";

  const addItem = (e) => {
    e.preventDefault();

    if (newItem === "") {
      return;
    }

    todos.splice(todos().length, 0, {
      description: newItem,
      done: createState(false),
    });
  };

  return html`
    <main>
      <h1>Todo list</h1>
      <p class="subtitle">Powered by STUPIJS</p>

      <form onsubmit=${addItem} class="add-item-form">
        <input oninput=${(e) => (newItem = e.target.value)} />

        <button type="submit">Add new item</button>
      </form>

      <table class="todos-table">
        <thead>
          <tr>
            <th>Description</th>

            <th>Status</th>

            <th></th>
          </tr>
        </thead>

        <tbody>
          ${() =>
            For(todos, (item, index) =>
              TodoRowItem(item(), index, () => todos.splice(index(), 1))
            )}
        </tbody>
      </table>
    </main>
  `;
};

export default TodoList;
