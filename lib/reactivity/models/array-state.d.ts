import { ForComponentModifiers } from "../../logic/models/for";
import { State } from "./state";

export interface ArrayState<T> {
  (): State<T>[];
  subscribe(forElement: ForComponentModifiers<T>): Function;
  splice(start: number, deleteCount: number, ...itemsToAdd: T[]): void;
  push(itemToAdd: T): void;
  pop(): T | undefined;
  set(newArray: T[]): void;
}
