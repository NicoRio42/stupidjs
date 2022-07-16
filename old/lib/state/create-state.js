function createState(value) {
  const subs = new Set();

  return {
    get: () => value,
    set: (newValue) => {
      value = newValue;
      subs.forEach((sub) => sub());
    },
    subscribe: (sub) => subs.add(sub),
    unsubscribe: (sub) => subs.delete(sub),
  };
}

function state(value) {
  const subs = new Set();

  const get = () => {
    if (window.sub) {
      subs.add(window.sub);
    }

    return value;
  };

  get.set = (newValue) => {
    value = newValue;
    subs.forEach((sub) => sub());
  };

  get.clean = (sub) => subs.delete(sub);

  return get;
}

export default createState;
