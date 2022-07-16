import render from "../../lib/render/render";
import createState from "../../lib/state/create-state";
import Child from "./Child";

function Reactivity() {
  const value1 = createState(1);
  const value2 = createState(2);

  return render([
    {
      tag: "label",
      attributes: { for: "value1" },
      content: "First value",
    },
    {
      tag: "input",
      attributes: {
        id: "value1",
        type: "number",
        value: {
          value: () => String(value1.get()),
          dependencies: [value1],
        },
      },
      events: { oninput: (e) => value1.set(Number(e.target.value)) },
    },
    {
      tag: "label",
      attributes: { for: "value2" },
      content: "Second value",
    },
    {
      tag: "input",
      attributes: {
        id: "value2",
        type: "number",
        value: {
          value: () => String(value2.get()),
          dependencies: [value2],
        },
      },
      events: { oninput: (e) => value2.set(Number(e.target.value)) },
    },
    {
      tag: "p",
      content: {
        value: () => {
          console.log("toto");
          return `The sum of the two values is ${value1.get() + value2.get()}`;
        },
        dependencies: [value1, value2],
      },
    },
    {
      tag: "div",
      content: () => Child(value1),
    },
  ]);
}

export default Reactivity;
