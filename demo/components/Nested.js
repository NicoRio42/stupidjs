import html from "../../lib/html/html";

const Nested = (count, slot, onToto) => html`
  <input
    id="nested"
    type="number"
    value=${count}
    oninput=${(e) => count.set(Number(e.target.value))}
  />

  <button
    onclick=${() => {
      count.set(count() + 1);
      if (count() > 10) {
        onToto("Count is higher than 10 !");
      }
    }}
  >
    Incremment
  </button>

  ${slot}
`;

export default Nested;
