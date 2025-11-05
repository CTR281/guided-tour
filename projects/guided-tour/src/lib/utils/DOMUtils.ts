/**
 * A set of utils methods related to dom manipulation (mostly read operations and conversions)
 */
export abstract class DOMUtils {
  static toPixel(value: number | string): string;
  static toPixel(object: Record<string, string | number>): Record<string, string>;
  static toPixel(
    valueOrObject: number | string | Record<string, string | number>,
  ): string | Record<string, string> {
    if (typeof valueOrObject === 'number' || typeof valueOrObject === 'string') {
      return valueOrObject.toString().concat('px');
    } else {
      const result: Record<string, string> = {};
      for (const prop in valueOrObject) {
        if (Object.prototype.hasOwnProperty.call(valueOrObject, prop)) {
          result[prop] =
            typeof valueOrObject[prop] === 'string'
              ? (valueOrObject[prop] as string)
              : DOMUtils.toPixel(valueOrObject[prop]);
        }
      }
      return result;
    }
  }

  static pixelToNum(value: string): number;
  static pixelToNum(object: Record<string, string>): Record<string, number>;
  static pixelToNum(
    valueOrObject: string | Record<string, string>,
  ): number | Record<string, number> {
    if (typeof valueOrObject === 'string') {
      const num = valueOrObject.match(/\d+/);
      if (!num) {
        return 0;
      } else {
        return parseInt(num[0], 10);
      }
    } else {
      const result: Record<string, number> = {};
      for (const prop in valueOrObject) {
        if (Object.prototype.hasOwnProperty.call(valueOrObject, prop)) {
          result[prop] = DOMUtils.pixelToNum(valueOrObject[prop]);
        }
      }
      return result;
    }
  }

  static getStyle(element: Element, property: string) {
    return getComputedStyle(element).getPropertyValue(property);
  }

  static getStyleAsNumber(element: Element, property: string): number {
    return DOMUtils.pixelToNum(DOMUtils.getStyle(element, property));
  }

  static getDocumentOffset(element: Element) {
    if (!element.getClientRects().length) {
      return { top: 0, left: 0 };
    }

    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + scrollY,
      left: rect.left + scrollX,
    };
  }

  static isFixedElement(element: Element): boolean {
    let node: HTMLElement | null = element as HTMLElement;
    while (node && node.nodeName.toLowerCase() !== 'body') {
      if (DOMUtils.getStyle(node, 'position').match(/fixed|sticky/i)) {
        return true;
      }
      node = node.parentNode as HTMLElement;
    }
    return false;
  }

  static isNotVisible(element: Element): boolean {
    const offset = DOMUtils.getDocumentOffset(element);
    const { height, width } = element.getBoundingClientRect();
    return (
      offset.top + height <= 0 ||
      offset.left + width <= 0 ||
      !element.checkVisibility({ checkVisibilityCSS: true, checkOpacity: true })
    );
  }
}
