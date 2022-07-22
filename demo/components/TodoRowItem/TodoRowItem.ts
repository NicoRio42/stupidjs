import html from "../../../lib/html/html";
import If from "../../../lib/logic/If";
import { createState } from "../../../lib/reactivity/create-state";
import { State } from "../../../lib/reactivity/models/state";
import { Todo } from "../models/todo";
import "./TodoRowItem.css";

const TodoRowItem = (
  { description, done }: Todo,
  index: State<number>,
  onDelete: Function
) => {
  const isEditing = createState(false);
  const descriptionInput = createState<HTMLInputElement>();

  const handleDescriptionClick = (): void => {
    isEditing.set(true);
    descriptionInput()?.focus();
  };

  const handleBlurAndChange = (): void => isEditing.set(false);

  return html`
    <tr>
      <td classList=${{ done }}>
        ${() => index() + 1}:
        ${() =>
          If(
            isEditing,
            () => html`
              <input
                ref=${descriptionInput}
                value=${description}
                oninput=${(e: InputEvent) =>
                  description.set((e.target as HTMLInputElement).value)}
                onchange=${handleBlurAndChange}
                onblur=${handleBlurAndChange}
              />
            `,
            () =>
              html`<span onclick=${handleDescriptionClick}
                >${description}</span
              >`
          )}
      </td>

      <td>
        <button
          style=${{ color: () => (done() ? "green" : "black") }}
          onclick=${() => done.set(!done())}
        >
          ${() =>
            If(
              done,
              () => html` Done `,
              () => html` Todo `
            )}
        </button>
      </td>

      <td>
        <button onclick=${onDelete}>Delete</button>
      </td>
    </tr>
  `;
};

export default TodoRowItem;
