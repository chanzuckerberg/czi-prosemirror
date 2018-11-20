// @flow

import stable from 'stable';

const PSEUDO_ELEMENT_AFTER = /:after/;
const PSEUDO_ELEMENT_ANY = /:[a-z]+/;
const PSEUDO_ELEMENT_BEFORE = /:before/;
const NODE_NAME_SELECTOR = /^[a-zA-Z]+\d*$/;

import toHexColor from './ui/toHexColor';

type SelectorTextToCSSText = {
  afterContent: ?string,
  beforeContent: ?string,
  cssText: string,
  selectorText: string,
};

const DEFAULT_TEXT_COLOR = '#000000';
const DEFAULT_BACKGROUND_COLOR = '#ffffff';

// Node name only selector has less priority, we'll handle it
// separately

export default function applyInlineStyleSheetStyles(doc: Document): void {
  const els = Array.from(doc.querySelectorAll('style'));
  if (!els.length) {
    return;
  }

  const selectorTextToCSSTexts = [];

  els.forEach((styleEl: any) => {
    const sheet = styleEl.sheet;
    if (!sheet) {
      // TODO: Find out why the browser does not support this.
      console.error(`styleEl.sheet undefined`, styleEl);
      return;
    }
    const cssRules = sheet.cssRules;
    if (!cssRules) {
      // TODO: Find out why the browser does not support this.
      console.error(`sheet.cssRules undefined`, sheet);
      return;
    }

    Array.from(cssRules).forEach((rule, cssRuleIndex) => {
      const selectorText = String(rule.selectorText || '');
      if (!selectorText) {
        // This could be `CSSImportRule.` created by @import().
        // ignore it.
        return;
      }

      if (!rule.styleMap) {
        // TODO: Find out why the browser does not support this.
        console.error(`rule.styleMap undefined`, rule);
        return;
      }
      let cssText = '';
      rule.styleMap.forEach((cssStyleValue, key) => {
        // e.g. rules['color'] = 'red'.
        if (key === 'color') {
          const color = toHexColor(String(cssStyleValue));
          if (!color || color === DEFAULT_TEXT_COLOR) {
            return;
          }
        } else if (key === 'background-color') {
          const color = toHexColor(String(cssStyleValue));
          if (!color || color === DEFAULT_BACKGROUND_COLOR) {
            return;
          }
        }
        cssText += `${key}: ${cssStyleValue};`;
      });
      if (selectorText.indexOf(',') > -1) {
        selectorText.split(/\s*,\s*/).forEach(st => {
          buildSelectorTextToCSSText(selectorTextToCSSTexts, st, cssText);
        });
      } else {
        buildSelectorTextToCSSText(
          selectorTextToCSSTexts,
          selectorText,
          cssText,
        );
      }
    });
  });

  stable(selectorTextToCSSTexts, sortBySelectorText).
    reduce(buildElementToCSSTexts.bind(null, doc), new Map()).
    forEach(applyInlineStyleSheetCSSTexts);
}

function buildElementToCSSTexts(
  doc: Document,
  elementToCSSTexts: Map<HTMLElement, Array<string>>,
  bag: SelectorTextToCSSText,
): Map<HTMLElement, Array<string>> {
  const {selectorText, cssText} = bag;
  const els = Array.from(doc.querySelectorAll(selectorText));
  els.forEach(el => {
    const style = el.style;
    if (!style || !(el instanceof HTMLElement)) {
      return;
    }
    const cssTexts = elementToCSSTexts.get(el) || [];
    cssTexts.push(cssText);
    elementToCSSTexts.set(el, cssTexts);
  });
  return elementToCSSTexts;
};

function sortBySelectorText(
  one: SelectorTextToCSSText,
  two: SelectorTextToCSSText,
): boolean {
  // This is just the naive implementation of sorting selectors by css
  // specificity.
  // 1. NodeName selectors has less priority.
  const aa = NODE_NAME_SELECTOR.test(one.selectorText);
  const bb = NODE_NAME_SELECTOR.test(two.selectorText);
  if (!aa && bb) {
    return true;
  }
  return false;
}

function buildSelectorTextToCSSText(
  result: Array<SelectorTextToCSSText>,
  selectorText: string,
  cssText: string,
): void {
  let afterContent;
  let beforeContent;

  if (PSEUDO_ELEMENT_ANY.test(selectorText)) {
    // TODO: Handle this later.
    return;
  }

  result.push({
    selectorText,
    cssText,
    afterContent,
    beforeContent,
  });
}

function applyInlineStyleSheetCSSTexts(
  cssTexts: Array<string>,
  el: HTMLElement,
): void {
  if (cssTexts.length) {
    // console.log(el, el.style.cssText, cssTexts.join(';'));
    el.style.cssText = cssTexts.join(';') + ';' + el.style.cssText;
  }
}
