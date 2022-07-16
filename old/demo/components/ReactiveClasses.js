import render from "../../lib/render/render";
import createState from "../../lib/state/create-state";

function ReactiveClasses() {
  const checked = createState(false);

  return render([
    {
      tag: "input",
      attributes: { type: "checkbox" },
      events: { oninput: (e) => checked.set(e.target.checked) },
    },
    {
      tag: "p",
      classes: [
        "text",
        {
          value: "green",
          shouldDisplay: () => checked.get(),
          dependencies: [checked],
        },
      ],
      content: "Checked",
    },
  ]);
}

export default ReactiveClasses;
