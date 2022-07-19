/**
 * Returns a matcher function from a route string template.
 * The route params should always be surrounded by slashes.
 * @param {TemplateStringsArray} routeFragments
 * @param  {string[]} pathParams
 * @returns {(string) => (string | number)[] | null}
 */
const route = (routeFragments, ...pathParams) => {
  if (routeFragments.length === 1) {
    return (route) => (route === routeFragments[0] ? [] : null);
  }

  return (route) => {
    if (!isRouteMatchingTemplate(route, routeFragments)) {
      return null;
    }

    return extractParamsFromMatchingRoute(route, routeFragments);
  };
};

/**
 * @param {string} route
 * @param {TemplateStringsArray} routeFragments
 * @returns
 */
const isRouteMatchingTemplate = (route, routeFragments) => {
  if (!route.startsWith(routeFragments[0])) {
    return false;
  }

  route = route.replace(routeFragments[0], "");
  const l = routeFragments.length;

  for (let i = 1; i < l; i++) {
    if (!route.includes(routeFragments[i])) {
      return false;
    }

    route = route.split(routeFragments[i])[1];
  }

  return true;
};

/**
 * @param {string} route
 * @param {TemplateStringsArray} routeFragments
 * @return {(string | number)[]}
 */
const extractParamsFromMatchingRoute = (route, routeFragments) => {
  route = route.replace(routeFragments[0], "");
  const l = routeFragments.length;
  const params = [];

  for (let i = 1; i < l; i++) {
    const [rawParam, restOfTheRoute] =
      routeFragments[i] !== "" ? route.split(routeFragments[i]) : [route, ""];

    route = restOfTheRoute;
    const intParam = parseInt(rawParam);

    params.push(isNaN(intParam) ? rawParam : intParam);
  }

  return params;
};

export default route;
