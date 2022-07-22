import html from "../../../lib/html/html";
import For from "../../../lib/logic/For";
import createArrayState from "../../../lib/reactivity/create-array-state";
import { createState } from "../../../lib/reactivity/create-state";
import { ArrayState } from "../../../lib/reactivity/models/array-state";
import { Todo } from "../models/todo";
import TodoRowItem from "../TodoRowItem/TodoRowItem";
import "./TodoList.css";

const TodoList = () => {
  const todos: ArrayState<Todo> = createArrayState(
    ["Do something", "Do something else", "Fix this bug"].map(
      (description) => ({
        description: createState(description),
        done: createState(false),
      })
    )
  );

  let newItem = createState("");

  const addItem = (e: SubmitEvent): void => {
    e.preventDefault();

    if (newItem() === "") {
      return;
    }

    todos.push({
      description: createState(newItem()),
      done: createState(false),
    });

    newItem.set("");
  };

  return html`
    <main>
      <h1>Todo list</h1>
      <p class="subtitle">Powered by StupidJS</p>

      <form onsubmit=${addItem} class="add-item-form">
        <input
          value=${newItem}
          oninput=${(e: InputEvent) =>
            newItem.set((e.target as HTMLInputElement).value)}
        />

        <button type="submit">Add new item</button>
      </form>

      <button onclick=${() => todos.pop()}>Pop last item</button>

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
