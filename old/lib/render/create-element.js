function createElement(node) {
  const element = document.createElement(node.tag);
  const unsubs = [];

  initAttributes(element, node.attributes, unsubs);
  initEvents(element, node.events);
  initContent(element, node.content, unsubs);

  return [element, () => unsubs.forEach((unsub) => unsub())];
}

function initAttributes(element, attributes, unsubs) {
  for (let attributeName in attributes) {
    if (typeof attributes[attributeName] === "string") {
      element[attributeName] = attributes[attributeName];
      continue;
    }

    // Initialisation
    function callback() {
      element.setAttribute(attributeName, attributes[attributeName].value());
    }

    callback();

    attributes[attributeName].dependencies.forEach((dependency) => {
      dependency.subscribe(callback);
      unsubs.push(() => dependency.unsubscribe(callback));
    });
  }
}

function initEvents(element, events) {
  for (let eventName in events) {
    element[eventName] = events[eventName];
  }
}

function initContent(element, content, unsubs) {
  if (content === undefined) {
    return;
  }

  if (Array.isArray(content)) {
    content.forEach((singleContent) =>
      initSingleContent(element, singleContent, unsubs)
    );

    return;
  }

  initSingleContent(element, content, unsubs);
}

function initSingleContent(element, content, unsubs) {
  if (typeof content === "string") {
    element.textContent = content;
    return;
  }

  if (typeof content === "function") {
    const [fragment, unsubscribe] = content();
    element.appendChild(fragment);
    unsubs.push(unsubscribe);
    return;
  }

  // Content is reactive function
  // Initialisation
  function callback() {
    element.textContent = content.value();
  }

  callback();

  content.dependencies.forEach((dependency) => {
    dependency.subscribe(callback);
    unsubs.push(() => dependency.unsubscribe(callback));
  });
}

export default createElement;
