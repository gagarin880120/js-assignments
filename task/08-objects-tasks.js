
/** ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.__proto__.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and
 * pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and
 * implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear
 * and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify() =>
 *    '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify() =>
 *    'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify() =>
 *      'div#main.container.draggable + table#data ~ tr:nth-of-type(even) td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Builder {
  constructor() {
    this.result = '';
  }

  element(value) {
    this.errorHandler(1);
    this.result += value;
    this.index = 1;
    return this;
  }

  id(value) {
    this.errorHandler(2);
    this.result += `#${value}`;
    this.index = 2;
    return this;
  }

  class(value) {
    this.errorHandler(3);
    this.result += `.${value}`;
    this.index = 3;
    return this;
  }

  attr(value) {
    this.errorHandler(4);
    this.result += `[${value}]`;
    this.index = 4;
    return this;
  }

  pseudoClass(value) {
    this.errorHandler(5);
    this.result += `:${value}`;
    this.index = 5;
    return this;
  }

  pseudoElement(value) {
    this.errorHandler(6);
    this.result += `::${value}`;
    this.index = 6;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.result = `${
      selector1.stringify()
    } ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    return this.result;
  }

  errorHandler(index) {
    if (this.index > index) {
      throw new Error(
        'Selector parts should be arranged in the following order: ' +
        'element, id, class, attribute, pseudo-class, pseudo-element'
      );
    }
    if (this.index === index && (index === 1 || index === 2 || index === 6)) {
      throw new Error(
        'Element, id and pseudo-element should not occur ' +
        'more then one time inside the selector'
      );
    }
  }
}

const cssSelectorBuilder = {
  element: function(value) {
    const builder = new Builder();
    builder.element(value);
    return builder;
  },
  id: function(value) {
    const builder = new Builder();
    builder.id(value);
    return builder;
  },
  class: function(value) {
    const builder = new Builder();
    builder.class(value);
    return builder;
  },
  attr: function(value) {
    const builder = new Builder();
    builder.attr(value);
    return builder;
  },
  pseudoClass: function(value) {
    const builder = new Builder();
    builder.pseudoClass(value);
    return builder;
  },
  pseudoElement: function(value) {
    const builder = new Builder();
    builder.pseudoElement(value);
    return builder;
  },
  combine: function(selector1, combinator, selector2) {
    const builder = new Builder();
    builder.combine(selector1, combinator, selector2);
    return builder;
  }
};

module.exports = {
  Rectangle: Rectangle,
  getJSON: getJSON,
  fromJSON: fromJSON,
  cssSelectorBuilder: cssSelectorBuilder
};
