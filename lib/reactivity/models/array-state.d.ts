export interface ArrayState<T> {
  (): State<T>[];
  subscribe(forElement: ForComponentModifiers): Function;
  splice(start: number, deleteCount: number, ...itemsToAdd: T[]): void;
  set(newArray: T[]): void;
}
