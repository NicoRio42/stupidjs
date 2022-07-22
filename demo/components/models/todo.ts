import { State } from "../../../lib/reactivity/models/state";

export interface Todo {
  description: State<string>;
  done: State<boolean>;
}
