/**
 *
 * @param {string} str
 * @returns
 */
const createDocumentFragment = (str) => {
  const template = document.createElement("template");

  if (!str.includes("<tbody>")) {
    template.innerHTML = str;
    return template.content;
  }

  // Browsers automatically put chilnodes of tbody elements that are not tr
  // elements before the table element. The code below is for reinjecting
  // tbody elements content at the rigth place.
  const [stringWithoutTbodyElementsContent, tbodyElementsContent] =
    extractTbodyElementsContent(str);

  template.innerHTML = stringWithoutTbodyElementsContent;

  Array.from(template.content.querySelectorAll("tbody")).forEach(
    (tbody, i) => (tbody.innerHTML = tbodyElementsContent[i])
  );

  return template.content;
};

/**
 *
 * @param {string} str
 * @returns {[string, string[]]}
 */
const extractTbodyElementsContent = (str) => {
  const array = str.split("<tbody>");
  const arrayLength = array.length;
  const arrayWithTbodyTags = array.map((el, i) =>
    i !== arrayLength - 1 ? el + "<tbody>" : el
  );
  const splittedArray = arrayWithTbodyTags.flatMap((s) => {
    const a = s.split("</tbody>");

    if (a.length === 2) {
      a[1] = "</tbody>" + a[1];
    }

    return a;
  });

  const tbodyElementsContent = [];

  const stringWithoutTbodyElementsContent = splittedArray.reduce(
    (prev, current, index) => {
      if (index % 2 === 1) {
        tbodyElementsContent.push(current);
      }

      return index % 2 === 0 ? prev + current : prev;
    },
    ""
  );

  return [stringWithoutTbodyElementsContent, tbodyElementsContent];
};

export default createDocumentFragment;
