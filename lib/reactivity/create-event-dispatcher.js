export const createEventDispatcher = () => {
  const subs = new Set();

  return {
    dispatch: (e) => subs.forEach((sub) => sub(e)),
    subscribe: (callback) => {
      subs.add(callback);
      return () => subs.delete(callback);
    },
  };
};
