import render from "../../lib/render/render";

function Child(value) {
  return render([
    {
      tag: "button",
      events: { onclick: () => alert(`Value is ${value.get()}`) },
      content: "Alert",
    },
  ]);
}

export default Child;
