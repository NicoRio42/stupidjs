const context = [];
let unsubs = [];

/**
 * Create an observable with auto subscribtion
 * @param {unknown} value
 * @returns {() => unknown}
 */
export const createState = (value) => {
  const subs = new Set();

  const get = () => {
    if (context.length !== 0) {
      const currentCallback = context[0];
      subs.add(currentCallback);
      unsubs.push(() => subs.delete(currentCallback));
    }

    return value;
  };

  get.set = (newValue) => {
    value = newValue;

    subs.forEach((sub) => sub());
  };

  return get;
};

/**
 *
 * @param {Function} callback
 * @returns {Function[]}
 */
export const subscribe = (callback) => {
  context.push(callback);
  unsubs = [];

  callback();

  context.pop();
  const unsubscriptions = [...unsubs];
  unsubs = [];

  return unsubscriptions;
};
