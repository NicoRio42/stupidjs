export type ClassListObject = Record<string, () => boolean>;

export type StyleObject = Record<string, () => string>;

export type Component = [DocumentFragment, Function[]];
