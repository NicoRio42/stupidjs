import render from "../../lib/render/render";
import createState from "../../lib/state/create-state";

export default Exemple = () => {
  const name = createState("Nicolas");

  return render([
    {
      t: "label",
      a: { for: "name" },
      i: "Name",
    },
    {
      t: "input",
      a: { value: () => name(), id: "name" },
      e: { oninput: (e) => name.set(e.target.value) },
    },
    {
      t: "p",
      i: () => `The name is ${name()}`,
    },
  ]);
};
