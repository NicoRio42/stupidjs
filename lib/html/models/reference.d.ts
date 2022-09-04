export interface Reference<T> {
  (): T | undefined;
  set(newValue: T): void;
}
