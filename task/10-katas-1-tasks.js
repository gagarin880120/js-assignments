
/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints(sides = ['N', 'E', 'S', 'W']) {
  /* use array of cardinal directions only! it is a default parameter! */
  const result = [];
  const getSide = (sides, angle) => {
    if (!(angle % 90)) {
      return sides[angle / 90];
    }
    const mainSideIndex = Math.floor(angle / 90);
    const mainDirection = sides[mainSideIndex];
    if (angle % 90 === 11.25) {
      return `${mainDirection}b${sides[mainSideIndex + 1] || sides[0]}`;
    } else if (angle % 90 === 22.5) {
      if (angle % 180 === 112.5) {
        return `${mainDirection}${
          sides[mainSideIndex + 1] || sides[0]
        }${mainDirection}`;
      }
      return `${mainDirection.repeat(2)}${sides[mainSideIndex + 1]}`;
    } else if (angle % 90 === 33.75) {
      if (angle % 180 === 33.75) {
        return `${mainDirection}${
          sides[mainSideIndex + 1] || sides[0]
        }b${mainDirection}`;
      }
      return `${
        sides[mainSideIndex + 1] || sides[0]
      }${mainDirection}b${mainDirection}`;
    } else if (angle % 90 === 45) {
      if (angle % 180 === 45) {
        return `${mainDirection}${
          sides[mainSideIndex + 1] || sides[0]
        }`;
      }
      return `${sides[mainSideIndex + 1] || sides[0]}${mainDirection}`;
    } else if (angle % 90 === 56.25) {
      if (angle % 180 === 56.25) {
        return `${mainDirection}${
          sides[mainSideIndex + 1] || sides[0]
        }b${
          sides[mainSideIndex + 1] || sides[0]
        }`;
      }
      return `${
        sides[mainSideIndex + 1] || sides[0]
      }${mainDirection}b${
        sides[mainSideIndex + 1] || sides[0]
      }`;
    } else if (angle % 90 === 67.5) {
      if (angle % 180 === 67.5) {
        return `${sides[mainSideIndex + 1]}${mainDirection}${
          sides[mainSideIndex + 1]
        }`;
      }
      return `${
        (sides[mainSideIndex + 1] || sides[0]).repeat(2)
      }${mainDirection}`;
    } else if (angle % 90 === 78.75) {
      return `${sides[mainSideIndex + 1] || sides[0]}b${mainDirection}`;
    }
  };
  for (let i = 0; i < 360; i += 11.25) {
    const obj = {
      abbreviation: getSide(sides, i),
      azimuth: i
    };
    result.push(obj);
  }
  return result;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear
 * at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
  function haveNested(srcStr, n) {
    for (let i = n; i < srcStr.length; i += 1) {
      if (srcStr[i] === '}') {
        return false;
      }
      if (srcStr[i] === '{') {
        return true;
      }
    }
  }

  function getNested(srcStr, n) {
    let counter = 0;
    const obj = {};
    for (let i = n; i < srcStr.length; i += 1) {
      if (srcStr[i] === '}') {
        counter += 1;
      }
      if (counter === 2) {
        obj.str = srcStr.slice(n, i);
        obj.num = i;
        break;
      }
    }
    return obj;
  }

  function getResults(string) {
    const obj = {};
    let key = -1;
    let isInside = false;
    let result = '';

    if (!string.includes('}')) {
      return [string];
    }

    for (let i = 0; i < string.length; i += 1) {
      if (!isInside) {
        if (string[i] !== '{') {
          result += string[i];
        }
      }
      if (string[i] === '{') {
        if (haveNested(string, i + 1)) {
          key += 1;
          obj[key] = [...new Set(
            getResults(getNested(string, i + 1).str).join(',').split(',')
          )].join(',');
          i = getNested(string, i + 1).num;
        } else {
          key += 1;
          obj[key] = '';
        }
        isInside = true;
        result += key;
      }
      if (isInside) {
        if (string[i] !== '{' && string[i] !== '}') {
          obj[key] += string[i];
        }
      }
      if (string[i] === '}') {
        isInside = false;
      }
    }
    const results = [];
    const resultsLength = Object.keys(obj).length > 1 ?
      Object.values(obj).map(v => v.split(','))
        .reduce((a, b) => a.length * b.length) :
      obj[0].split(',').length;

    for (let i = 0; i < resultsLength; i += 1) {
      const resStr = result.split('')
        .map(v => Object.keys(obj).includes(v)
          ? obj[v].split(',').sort(() => 0.5 - Math.random())[0] : v)
        .join('');
      if (!results.includes(resStr)) {
        results.push(resStr);
      } else {
        i -= 1;
      }
    }
    return results;
  }

  const res = getResults(str);
  for (let i = 0; i < res.length; i += 1) {
    yield res[i];
  }
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient
 * of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
  const matrix = Array.from({length: n}, v => []);
  let i = 1;
  let j = 1;
  for (let k = 0; k < n * n; k += 1) {
    matrix[i-1][j-1] = k;
    if ((i + j) % 2 === 0) {
      if (j < n) {
        j += 1;
      } else {
        i += 2;
      }
      if (i > 1) {
        i -= 1;
      }
    } else {
      if (i < n) {
        i += 1;
      }
      else {
        j += 2;
      }
      if (j > 1) {
        j--;
      }
    }
  }
  return matrix;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row
 *  (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
  const arr = [];
  arr.push(dominoes[0]);
  dominoes = dominoes.filter(v => v !== arr[0]);
  for (let i = 0; i < dominoes.length; i += 1) {
    if (dominoes[i].includes(arr[0][1])) {
      if (dominoes[i][1] === arr[0][1]) {
        dominoes[i].reverse();
      }
      arr.pop();
      arr.push(dominoes[i]);
      dominoes = dominoes.filter(v => v !== arr[0]);
      i = -1;
    }
    if (!dominoes.length) {
      return true;
    }
  }
  return false;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end
 *     integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to
 *     more than two values.
 *
 * @params {array} nums
 * @return {string}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
  const result = [];
  function getRange(n, arr) {
    const range = [];
    range.push(arr[n]);
    for (let i = n; i < arr.length; i += 1) {
      if (arr[i] + 1 === arr[i + 1]) {
        range.push(arr[i + 1]);
      } else {
        break;
      }
    }
    return range.length >= 3 ?
      `${range[0]}-${range[range.length - 1]}` : arr[n];
  }
  for (let i = 0; i < nums.length; i += 1) {
    const str = getRange(i, nums);
    result.push(str);
    i = `${str}`.includes('-') ?
      nums.indexOf(+str.slice(str.indexOf('-') + 1)) :
      nums.indexOf(str);
  }
  return result.join(',');
}

module.exports = {
  createCompassPoints : createCompassPoints,
  expandBraces : expandBraces,
  getZigZagMatrix : getZigZagMatrix,
  canDominoesMakeRow : canDominoesMakeRow,
  extractRanges : extractRanges
};
