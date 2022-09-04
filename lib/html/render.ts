import { Component } from "./models/html";

const stylesMap = new Map<number, StyleReference>();

/**
 * Add css rules to the document, and scope it to a component
 * @param component
 * @param styles
 */
const render = (
  [documentFragment, unsubs]: Component,
  styles: string
): Component => {
  const hash = hashCode(getDocFragmentInnerHTML(documentFragment) + styles);

  const scopeClass = `stupid-${hash}`;
  scopeMarkup(documentFragment, scopeClass);

  const styleReference = stylesMap.get(hash);

  if (styleReference === undefined) {
    const styleElement: HTMLStyleElement = document.createElement("style");
    document.querySelector("html")?.append(styleElement);
    const styleSheet = styleElement.sheet as CSSStyleSheet;

    getRulesFromStyles(scopeStyles(styles, scopeClass)).forEach((rule) =>
      styleSheet.insertRule(rule)
    );

    stylesMap.set(hash, { styleElement, count: 0 });
  } else {
    styleReference.count++;
  }

  const cleanupStyles = () => {
    const styleRef = stylesMap.get(hash);

    if (styleRef === undefined) return;

    styleRef.count--;

    if (styleRef.count === 0) {
      styleRef.styleElement.remove();
      stylesMap.delete(hash);
    }
  };

  unsubs.push(cleanupStyles);

  return [documentFragment, unsubs];
};

const getRulesFromStyles = (styles: string): string[] => {
  const intermediateArray = styles.split("}");
  intermediateArray.pop();

  return intermediateArray.map((rule) => rule + "}");
};

/**
 * A very simple style scoper
 *
 * Doesn't support media queries.
 * @param styles
 * @param hash
 * @returns
 */
const scopeStyles = (styles: string, scopeClass: string): string => {
  return styles
    .replaceAll("\n", "")
    .replace(/  +/g, " ")
    .split(" {")
    .flatMap((rule) => rule.split("{"))
    .join(`:where(.${scopeClass}){`);
};

const scopeMarkup = (
  element: DocumentFragment | HTMLElement,
  scopeClass: string
): void => {
  element.childNodes.forEach((node) => {
    if (node.nodeType === 1) {
      (node as HTMLElement).classList.add(scopeClass);

      scopeMarkup(node as HTMLElement, scopeClass);
    }
  });
};

const getDocFragmentInnerHTML = (docFragment: DocumentFragment): string => {
  const clone = docFragment.cloneNode();
  const template = document.createElement("template") as HTMLTemplateElement;
  template.appendChild(clone);

  return template.innerHTML;
};

const hashCode = (s: string): number => {
  let h = 0;

  for (let i = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;

  return Math.abs(h);
};

interface StyleReference {
  styleElement: HTMLStyleElement;
  count: number;
}

export default render;
