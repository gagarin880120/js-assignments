
/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist
 * in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account
 * that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it
 * into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
  const digits = [
    ' _ | ||_|', '     |  |', ' _  _||_ ',
    ' _  _| _|', '   |_|  |', ' _ |_  _|',
    ' _ |_ |_|', ' _   |  |', ' _ |_||_|', ' _ |_| _|'
  ];
  let rows = bankAccount.split('\n');

  rows.pop();
  let result = 0;
  while (rows[0].length > 0) {
    result = result * 10 + digits.indexOf(
      rows[0].slice(0, 3) + rows[1].slice(0, 3) + rows[2].slice(0, 3)
    );
    rows = rows.map(v => v.slice(3));
  }
  return result;
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make
 * sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>
 *      'The String global object',
 *      'is a constructor for',
 *      'strings, or a sequence of',
 *      'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>
 *      'The String',
 *      'global',
 *      'object is a',
 *      'constructor',
 *      'for strings,',
 *      'or a',
 *      'sequence of',
 *      'characters.'
 */
function* wrapText(text, columns) {
  if (columns > text.length) {
    yield text;
  } else {
    const arr =  text.split(' ');
    let str = '';
    let prev = '';
    for (let i = 0; i < arr.length; i += 1) {
      str += `${arr[i]} `;
      if (str.length > columns + 1) {
        yield prev.trim();
        str =  `${arr[i]} `;
      }
      if (i === arr.length - 1) {
        yield `${arr[i]}`;
      }
      prev = str;
    }
  }

}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
  StraightFlush: 8,
  FourOfKind: 7,
  FullHouse: 6,
  Flush: 5,
  Straight: 4,
  ThreeOfKind: 3,
  TwoPairs: 2,
  OnePair: 1,
  HighCard: 0
};

function getPokerHandRank(hand) {
  const straightCases = [
    ['2', '3', '4', '5', '6'], ['3', '4', '5', '6', '7'],
    ['4', '5', '6', '7', '8'], ['5', '6', '7', '8', '9'],
    ['6', '7', '8', '9', '10'], ['7', '8', '9', '10', 'J'],
    ['8', '9', '10', 'J', 'Q'], ['9', '10', 'J', 'Q', 'K'],
    ['10', 'J', 'Q', 'K', 'A']
  ];
  const cardCheck = arr => {
    const ranks = [...new Set(arr.map(v => v.slice(0, -1)))];
    for (let j = 0; j < straightCases.length; j += 1) {
      let counter = 0;
      for (let i = 0; i < ranks.length; i+= 1) {
        const filtered = arr.filter(v => v.slice(0, -1) === ranks[i]);
        if (ranks.length === 2) {
          if (filtered.length === 4) {
            return 'fourOfKind';
          }
        }
        if (ranks.length === 3) {
          if (filtered.length === 3) {
            return 'threeOfKind';
          }
          if (filtered.length === 2) {
            return 'twoPairs';
          }
        }
        if (ranks.length === 4) {
          if (filtered.length === 2) {
            return 'onePair';
          }
        }
        if (straightCases[j].includes(ranks[i])) {
          counter += 1;
          if (counter === 5
            || ((j === 0 && counter === 4)
            && ranks.includes('A'))) {
            return 'straight';
          }
        }
      }
      if (ranks.length === 2
        && ([...new Set(arr.map(v => v.slice(-1)))].length >= 3)) {
        return 'fullHouse';
      }
    }
  };
  const suits = hand.map(v => v.slice(-1));
  if (cardCheck(hand) === 'straight') {
    if ([...new Set(suits)].length === 1) {
      return PokerRank.StraightFlush;
    }
    return PokerRank.Straight;
  }
  if (cardCheck(hand) === 'fourOfKind') {
    return PokerRank.FourOfKind;
  }
  if (cardCheck(hand) === 'fullHouse') {
    return PokerRank.FullHouse;
  }
  if (cardCheck(hand) === 'threeOfKind') {
    return PokerRank.ThreeOfKind;
  }
  if (cardCheck(hand) === 'twoPairs') {
    return PokerRank.TwoPairs;
  }
  if (cardCheck(hand) === 'onePair') {
    return PokerRank.OnePair;
  }
  if ([...new Set(suits)].length === 1) {
    return PokerRank.Flush;
  }
  return PokerRank.HighCard;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +,
 * vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 *
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 *
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+        '+------------+\n'+
 *    '|            |\n'+        '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+   =>   '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+        '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'         '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
  const arr = figure.split('\n').filter(Boolean);
  const results = [];
  if (!figure.includes('-') && !figure.includes('|')) {
    for (let i = 0; i < arr.length; i += 1) {
      let counter = 0;
      let leftTopCorner = 0;
      let rightTopCorner = 0;
      for (let j = 0; j < arr[i].length; j += 1) {
        if (arr[i][j] === '+' && arr[i + 1] && arr[i + 1][j] === '+') {
          counter += 1;
        }
        if (counter === 1 && arr[i + 1][j] === '+') {
          leftTopCorner = j;
        }
        if (counter === 2) {
          rightTopCorner = j;
          const rect = `++\n++\n`;
          results.push(rect);
          j -= 1;
          counter = 0;
        }
      }
    }
  }

  function createRectangle(str, n) {
    const lateral = '|' + ' '.repeat(str.length - 2) + '|' + '\n';
    return str + '\n' + lateral.repeat(n) + str + '\n';
  }

  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i].includes('+')) {
      let counter = 0;
      let leftTopCorner = 0;
      let rightTopCorner = 0;
      for (let j = 0; j < arr[i].length; j += 1) {
        if (arr[i][j] === '+' && arr[i + 1] && arr[i + 1][j] === '|') {
          counter += 1;
        }
        if (counter === 1 && arr[i + 1][j] === '|') {
          leftTopCorner = j;
        }
        if (counter === 2) {
          rightTopCorner = j;
          const h = arr.slice(i + 1).findIndex(v => v.includes('+'));
          if (h > 0) {
            const str = `+${'-'.repeat(rightTopCorner - leftTopCorner - 1)}+`;
            results.push(createRectangle(str, h));
            j -= 1;
            counter = 0;
          }
        }
      }
    }
  }
  for (let i = 0; i < results.length; i += 1) {
    yield results[i];
  }
  // throw new Error('Not implemented');
}

module.exports = {
  parseBankAccount: parseBankAccount,
  wrapText: wrapText,
  PokerRank: PokerRank,
  getPokerHandRank: getPokerHandRank,
  getFigureRectangles: getFigureRectangles
};
