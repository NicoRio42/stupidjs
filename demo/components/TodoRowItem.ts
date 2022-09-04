import createReference from "../../lib/html/create-reference";
import html from "../../lib/html/html";
import render from "../../lib/html/render";
import If from "../../lib/logic/If";
import { createState } from "../../lib/reactivity/create-state";
import { State } from "../../lib/reactivity/models/state";
import { Todo } from "./models/todo";

const TodoRowItem = (
  { description, done }: Todo,
  index: State<number>,
  onDelete: Function
) => {
  const isEditing = createState(false);
  const descriptionInput = createReference<HTMLInputElement>();

  const handleDescriptionClick = (): void => {
    isEditing.set(true);
    descriptionInput()?.focus();
  };

  const handleBlurAndChange = (): void => isEditing.set(false);

  return render(
    html`
      <tr>
        <td classList=${{ done }}>
          ${() => index() + 1}:
          ${() =>
            If(
              isEditing,
              () => html`
                <input
                  ref=${descriptionInput}
                  bind:value=${description}
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

        <td><input type="checkbox" bind:checked=${done} /></td>

        <td>
          <button onclick=${onDelete}>Delete</button>
        </td>
      </tr>
    `,
    /*css*/ `
      .done {
        color: grey;
        text-decoration: line-through;
      }
  `
  );
};

export default TodoRowItem;
