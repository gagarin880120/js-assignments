/**
 * Takes two strings including only letters from a to z.
 * Returns a new sorted string containing distinct letters.
 *
 * @param {string} value1
 * @param {string} value2
 * @return {string}
 *
 * @example
 *   'azy', 'bk' => 'abkyz'
 *   'zxxlal','laxk'    => 'aklxz'
 *   'abcdefghijklmnop',  'lmnopqrstuvwxyz'  => 'abcdefghijklmnopqrstuvwxyz'
 */
function distinctLettersString(value1, value2) {
  const arr = `${value1}${value2}`.split();
  return [...new Set(...arr)].sort().join('');
}


/**
 * Takes a string with any characters.
 * Returns an object containing appearence of every distinct letters in lower case.
 *
 * @param {string} value
 * @return {Object}
 *
 * @example
 *  'Who you are, Buddy?' => { a:1, d:2, e:1, h:1, o:2, r:1, u:2, y:2 }
 *
 */

function lowerLetters(value) {
  const arr = value.split('')
    .filter(v => v.charCodeAt(0) >= 97 && v.charCodeAt(0) <= 122);
  return arr.reduce((acc, val) => {
    acc[val] = arr.filter(v => v === val).length;
    return acc;
  }, {});
}

/**
 * Write a function that will convert a string into title case, given an optional
 * list of exception (minor words). The list of minor words will be given as a
 * string with each word separated by a space. Your function should ignore the
 * case of the minor words string - it should behave in the same way even if the
 * case of the minor word is changed
 *
 * @param {string} the original string to be converted
 * @param {string} list of minor words that must always be lowercase except for
 *                  the first word in the string
 * @return {string}
 *
 * @example
 *    'a clash if KINGS', 'a an the of'  =>  'A Clash of Kings'
 *    'THE WIND IN THE WILLOWS', 'The In'  => 'The Wind in the Willows'
 *    'the quick brown fox'  => 'The Quick Brown Fox'
 */

function titleCaseConvert(title, minorWords) {
  const arr = title.split(' ').map(v => v.toLowerCase());
  for (let i = 1; i < arr.length; i += 1) {
    if (!minorWords || !minorWords.toLowerCase().includes(arr[i])) {
      arr[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
    }
  }
  arr[0] = arr[0][0].toUpperCase() + arr[0].slice(1);
  return arr.join(' ');
}

/**
 * Your job is to create a calculator which evaluates expressions in Reverse Polish
 * notation (https://en.wikipedia.org/wiki/Reverse_Polish_notation). Empty expression
 * should evaluate to 0. Expression without operation returns the last number.
 *
 * @param {string} RPN string, each number and operation separated by a space
 *
 * @return {Number}
 *
 * @example
 *  ''  =>  0  // empty expression returns 0
 *  '1 2 3'  =>  3  // expression without operation returns the last number
 *  '4 2 +'  =>  6  // 4 + 2
 *  '2 5 * 2 + 3 /'  =>  4   //  ((5 * 2) + 2) / 3
 *  '5 1 2 + 4 * + 3 -'  =>  14   // 5 + ((1 + 2) * 4) -3
 */

function calcRPN(expr) {
  if (!expr.length) {
    return 0;
  }
  const arr = expr.split(' ');
  const operands = ['+', '-', '*', '/' ];

  if (!arr.includes(operands[0])
     && !arr.includes(operands[1])
     && !arr.includes(operands[2])
     && !arr.includes(operands[3])) {
    return arr[arr.length - 1];
  }

  const stack = [];
  let i = 0;

  stack.push(arr[i]);
  i += 1;

  while(i <= arr.length) {
    const item = arr[i];
    var index = operands.indexOf(item);
    if (index < 0) {
      stack.push(arr[i]);
    } else {
      if (index === 0) {
        const a = parseInt(stack.splice(-1)[0], 10);
        const b = parseInt(stack.splice(-1)[0], 10);
        stack.push(a + b);
      }
      if (index === 1) {
        const a = parseInt(stack.splice(-1)[0], 10);
        const b = parseInt(stack.splice(-1)[0], 10);
        stack.push(b - a);
      }
      if (index === 2) {
        const a = parseInt(stack.splice(-1)[0], 10);
        const b = parseInt(stack.splice(-1)[0], 10);
        stack.push(a * b);
      }
      if (index === 3) {
        const a = parseInt(stack.splice(-1)[0], 10);
        const b = parseInt(stack.splice(-1)[0], 10);
        stack.push(b / a);
      }
    }
    i += 1;
  }

  return parseInt(stack[0], 10);
}

module.exports = {
  distinctLettersString,
  lowerLetters,
  titleCaseConvert,
  calcRPN
};
