import { Reference } from "./models/reference";

const createReference = <T>(initialValue?: T): Reference<T> => {
  const get = () => initialValue;

  get.set = (newValue: T): void => {
    initialValue = newValue;
  };

  return get;
};

export default createReference;
