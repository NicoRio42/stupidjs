import { State } from "./models/state";

const context: Function[] = [];
let unsubs: Function[] = [];

/**
 * Create an observable with auto subscribtion
 * @param initialValue
 * @returns A function that returns the current value, and has a set property
 * that is a function to set a new value
 */
export const createState = <T>(initialValue: T): State<T> => {
  const subs = new Set<Function>();

  const get = (): T => {
    if (context.length !== 0) {
      const currentCallback = context[0];
      subs.add(currentCallback);
      unsubs.push(() => subs.delete(currentCallback));
    }

    return initialValue;
  };

  get.set = (newValue: T): void => {
    initialValue = newValue;

    subs.forEach((sub) => sub());
  };

  return get;
};

/**
 * This is a function that subscribe the callback given as a parameter to
 * observable that are read during its execution (inspired from SolidJS signals)
 * @param callback
 * @returns An array of unsubsciption functions
 */
export const subscribe = (callback: Function): Function[] => {
  context.push(callback);
  unsubs = [];

  callback();

  context.pop();
  const unsubscriptions = [...unsubs];
  unsubs = [];

  return unsubscriptions;
};
