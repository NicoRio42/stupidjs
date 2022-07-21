export type Route = [
  RouteMatcher,
  (...args: unknown[]) => [DocumentFragment, Function[]]
];

export type RouteMatcher = (rawRoute: string) => (string | number)[] | null;
