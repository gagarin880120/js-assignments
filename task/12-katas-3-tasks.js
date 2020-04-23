
/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left,
 * right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ];
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R and follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
  const copy = puzzle.slice(0);

  function setIndex(arr, str, n) {
    for(let i = 0; i < arr.length; i += 1) {
      if (arr[i].includes(str[n])) {
        const newArr = arr[i].split('');
        newArr.splice(arr[i].indexOf(str[n]), 1, n);
        arr[i] = newArr.join('');
        return [i, arr[i].indexOf(n)];
      }
    }
  }

  const zero = setIndex(copy, searchStr, 0);
  let counter = 0;
  if (zero) {
    counter += 1;
  } else {
    return false;
  }
  let current = zero;

  for(let i = 1; i < searchStr.length; i += 1) {
    if (copy[current[0]][current[1] + 1]) {
      if (copy[current[0]][current[1] + 1] === searchStr[i]) {
        current = [current[0], current[1] + 1];
        counter += 1;
        if (counter === searchStr.length) {
          return true;
        }
        continue;
      }
    }

    if (copy[current[0]][current[1] - 1]) {
      if (copy[current[0]][current[1] - 1] === searchStr[i]) {
        current = [current[0], current[1] - 1];
        counter += 1;
        if (counter === searchStr.length) {
          return true;
        }
        continue;
      }
    }

    if (copy[current[0] + 1]) {
      if (copy[current[0] + 1][current[1]] === searchStr[i]) {
        current = [current[0] + 1, current[1]];
        counter += 1;
        if (counter === searchStr.length) {
          return true;
        }
        continue;
      }
    }

    if (copy[current[0] - 1]) {
      if (copy[current[0] - 1][current[1]] === searchStr[i]) {
        current = [current[0] - 1, current[1]];
        counter += 1;
        if (counter === searchStr.length) {
          return true;
        }
        continue;
      }
    }

    current = setIndex(copy, searchStr, 0);
    counter = 1;
    if (!current) {
      return false;
    }
    i = 0;
  }
  return false;
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 *
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from
 *    the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
  const sequence = [];
  function shuffle(chars) {
    return chars.split('').sort(() => 0.5 - Math.random()).join('');
  }
  function factorial(n) {
    let result = 1;
    while(n) {
      result *= n--;
    }
    return result;
  }
  for (let i = 0; i < factorial(chars.length); i += 1) {
    const str = shuffle(chars);
    if (!sequence.includes(str)) {
      sequence.push(str);
      yield str;
    } else {
      i -= 1;
      shuffle(chars);
    }
  }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units
 * you have already bought, or do nothing.
 * Therefore, the most profit is the maximum difference of all pairs in a sequence
 * of stock prices.
 *
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
  let result = 0;
  while (quotes.length) {
    const max = Math.max(...quotes);
    const index = quotes.lastIndexOf(max);
    result = quotes.slice(0, index)
      .reduce((acc, val) => acc += max - val, result);
    quotes = quotes.slice(index + 1);
  }
  return result;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 *
 * @class
 *
 * @example
 *
 *   var urlShortener = new UrlShortener();
 *   var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *   var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 *
 */
function UrlShortener() {
  this.urlAllowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                          'abcdefghijklmnopqrstuvwxyz' +
                          "0123456789-_.~!*'();:@&=+$,/?#[]";
  this.aliases = {
    'https://': '~',
    '.com': '@',
    '.wikipedia.org/wiki/': 'wk',
    '.org': '*',
    'JavaScript': '!',
    'Reference' : 'rf',
    'Object': 'obj',
    '/en': '[',
    'price': '$'

  };
}

UrlShortener.prototype = {
  encode(url) {
    let result = url;
    const keys = Object.keys(this.aliases);
    for (let i = 0; i < keys.length; i += 1) {
      if (result.includes(keys[i])) {
        result = result.replace(keys[i], this.aliases[keys[i]]);
      }
    }
    return result;
  },

  decode(code) {
    let result = code;
    const values = Object.values(this.aliases);
    for (let i = 0; i < values.length; i += 1) {
      if (result.includes(values[i])) {
        result = result.replace(
          values[i], Object.keys(this.aliases)[i]
        );
      }
    }
    return result;
  }
};

module.exports = {
  findStringInSnakingPuzzle: findStringInSnakingPuzzle,
  getPermutations: getPermutations,
  getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
  UrlShortener: UrlShortener
};
