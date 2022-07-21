import html from "../../../lib/html/html";
import { Component } from "../../../lib/html/models/html";
import If from "../../../lib/logic/If";
import { State } from "../../../lib/reactivity/models/state";
import "./TodoRowItem.css";

const TodoRowItem = (
  { description, done },
  index: State<number>,
  onDelete: Function
): Component => html`
  <tr>
    <td classList=${{ done }}>${() => index() + 1}: ${() => description}</td>

    <td>
      <button
        style=${{ color: () => (done() ? "green" : "black") }}
        onclick=${() => done.set(!done())}
      >
        ${() => If(done, html` Done `)} ${() => If(() => !done(), html` Todo `)}
      </button>
    </td>

    <td>
      <button onclick=${onDelete}>Delete</button>
    </td>
  </tr>
`;

export default TodoRowItem;
