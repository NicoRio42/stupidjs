export interface State<T> {
  (): T;
  set(newValue: T): void;
}
