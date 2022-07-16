import html from "../../../lib/html/html";
import If from "../../../lib/logic/If";
import "./TodoRowItem.css";

const TodoRowItem = ({ description, done }, index, onDelete) => html`
  <tr classList=${{ done }}>
    <td>${() => index() + 1}: ${() => description}</td>

    <td style=${{ color: () => (done() ? "green" : "black") }}>
      ${() => If(done, html` Done `)} ${() => If(() => !done(), html` Todo `)}
    </td>

    <td>
      <button onclick=${() => done.set(!done())}>Toggle</button>

      <button onclick=${onDelete}>Delete</button>
    </td>
  </tr>
`;

export default TodoRowItem;
