import html from "../../lib/html/html";
import render from "../../lib/html/render";
import For from "../../lib/logic/For";
import createArrayState from "../../lib/reactivity/create-array-state";
import { createState } from "../../lib/reactivity/create-state";
import { ArrayState } from "../../lib/reactivity/models/array-state";
import { Todo } from "./models/todo";
import TodoRowItem from "./TodoRowItem";

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
    if (newItem() === "") {
      return;
    }

    todos.push({
      description: createState(newItem()),
      done: createState(false),
    });

    newItem.set("");
  };

  return render(
    html`
      <main>
        <h1>Todo list</h1>
        <p class="subtitle">Powered by StupidJS</p>

        <form onsubmit|preventDefault=${addItem} class="add-item-form">
          <input bind:value=${newItem} />

          <button type="submit">Add new item</button>
        </form>

        <button onclick=${() => todos.pop()}>Pop last item</button>

        <table class="todos-table">
          <thead>
            <tr>
              <th>Description</th>

              <th>Status</th>

              <th></th>

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
    `,
    /*css*/ `
      main {
        display: block;
        margin: 0 auto;
        max-width: 30rem;
      }
      
      h1 {
        text-transform: capitalize;
        font-size: 3rem;
        margin-bottom: 0;
      }
      
      .subtitle {
        margin: 0;
        font-size: 1.5rem;
      }
      
      .add-item-form {
        margin-top: 2rem;
      }
      
      .todos-table {
        margin-top: 2rem;
      }
  `
  );
};

export default TodoList;
