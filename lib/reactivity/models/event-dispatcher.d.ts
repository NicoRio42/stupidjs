export interface EventDispatcher {
  dispatch: (e: unknown) => void;
  subscribe: (callback: Function) => Function;
}
