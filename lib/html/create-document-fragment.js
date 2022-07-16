const createDocumentFragment = (str) => {
  const template = document.createElement("template");
  template.innerHTML = str;

  return template.content;
};

export default createDocumentFragment;
