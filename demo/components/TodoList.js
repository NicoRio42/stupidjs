import html from "../../lib/html/html";
import For from "../../lib/logic/For";
import createArrayState from "../../lib/reactivity/create-array-state";
import { createState } from "../../lib/reactivity/create-state";
import TodoRowItem from "./TodoRowItem/TodoRowItem";

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
    <h1>Todo list powered by stupijs!</h1>

    <form onsubmit=${addItem}>
      <input oninput=${(e) => (newItem = e.target.value)} />

      <button type="submit">Add new item</button>
    </form>

    <table>
      <thead>
        <tr>
          <th>Description</th>

          <th>Status</th>

          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        ${() =>
          For(todos, (item, index) =>
            TodoRowItem(item(), index, () => todos.splice(index(), 1))
          )}
      </tbody>
    </table>
  `;
};

export default TodoList;
