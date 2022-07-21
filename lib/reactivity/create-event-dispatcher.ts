import { EventDispatcher } from "./models/event-dispatcher";

export const createEventDispatcher = (): EventDispatcher => {
  const subs = new Set<Function>();

  return {
    dispatch: (e: unknown): void => subs.forEach((sub) => sub(e)),
    subscribe: (callback: Function) => {
      subs.add(callback);
      return () => subs.delete(callback);
    },
  };
};
