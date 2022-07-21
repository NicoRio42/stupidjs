import { State } from "../../reactivity/models/state";

export interface ForComponentModifiers<T> {
  set: (newArray: T[]) => void;
  splice: (
    start: number,
    deleteCount: number,
    ...itemsToAdd: State<T>[]
  ) => void;
}

export interface ForComponentItem<T> {
  item: State<T>;
  index: State<number>;
  nodes: ChildNode[];
  unsubs: Function[];
}
