import { RouteMatcher } from "./models/router";

/**
 * Returns a matcher function from a route string template.
 * The route params should always be surrounded by slashes.
 */
const route = (
  routeFragments: TemplateStringsArray,
  ...params: string[]
): RouteMatcher => {
  if (routeFragments.length === 1) {
    return (rawRoute: string): [] | null =>
      rawRoute === routeFragments[0] ? [] : null;
  }

  return (rawRoute: string): (string | number)[] | null => {
    if (!isRouteMatchingTemplate(rawRoute, routeFragments)) {
      return null;
    }

    return extractParamsFromMatchingRoute(rawRoute, routeFragments);
  };
};

const isRouteMatchingTemplate = (
  rawRoute: string,
  routeFragments: TemplateStringsArray
): boolean => {
  if (!rawRoute.startsWith(routeFragments[0])) {
    return false;
  }

  rawRoute = rawRoute.replace(routeFragments[0], "");
  const l = routeFragments.length;

  for (let i = 1; i < l; i++) {
    if (!rawRoute.includes(routeFragments[i])) {
      return false;
    }

    rawRoute = rawRoute.split(routeFragments[i])[1];
  }

  return true;
};

const extractParamsFromMatchingRoute = (
  rawRoute: string,
  routeFragments: TemplateStringsArray
): (string | number)[] => {
  rawRoute = rawRoute.replace(routeFragments[0], "");
  const l = routeFragments.length;
  const params: (string | number)[] = [];

  for (let i = 1; i < l; i++) {
    const [rawParam, restOfTheRoute] =
      routeFragments[i] !== ""
        ? rawRoute.split(routeFragments[i])
        : [rawRoute, ""];

    rawRoute = restOfTheRoute;
    const intParam = parseInt(rawParam);

    params.push(isNaN(intParam) ? rawParam : intParam);
  }

  return params;
};

export default route;
