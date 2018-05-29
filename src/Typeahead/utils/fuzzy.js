class Fuzzy {
  // Return all elements of `array` that have a fuzzy
  // match against `pattern`.
  simpleFilter = (pattern, array) => array.filter(str => this.test(pattern, str));

  // Does `pattern` fuzzy match `str`?
  test = (pattern, str) => this.match(pattern, str) !== null;

  // If `pattern` matches `str`, wrap each matching character
  // in `opts.pre` and `opts.post`. If no match, return null
  match = (pattern, str, opts = {}) => {
    let patternIdx = 0;
    const result = [];
    const len = str.length;
    let totalScore = 0;
    let currScore = 0;

    const // prefix
      pre = opts.pre || '';

    const // suffix
      post = opts.post || '';

    const // String to compare against. This might be a lowercase version of the
    // raw string
      compareString = (opts.caseSensitive && str) || str.toLowerCase();

    let ch;

    /* eslint-disable no-param-reassign */
    pattern = (opts.caseSensitive && pattern) || pattern.toLowerCase();

    // For each character in the string, either add it to the result
    // or wrap in template if it's the next string in the pattern
    for (let idx = 0; idx < len; idx += 1) {
      ch = str[idx];
      if (compareString[idx] === pattern[patternIdx]) {
        ch = pre + ch + post;
        patternIdx += 1;

        // consecutive characters should increase the score more than linearly
        currScore += 1 + currScore;
      } else {
        currScore = 0;
      }
      totalScore += currScore;
      result[result.length] = ch;
    }

    // return rendered string if we have a match for every char
    if (patternIdx === pattern.length) {
      // if the string is an exact match with pattern, totalScore should be maxed
      totalScore = compareString === pattern ? Infinity : totalScore;
      return { rendered: result.join(''), score: totalScore };
    }

    return null;
  };

  // The normal entry point. Filters `arr` for matches against `pattern`.
  // It returns an array with matching values of the type:
  //
  //     [{
  //         string:   '<b>lah' // The rendered string
  //       , index:    2        // The index of the element in `arr`
  //       , original: 'blah'   // The original element in `arr`
  //     }]
  //
  // `opts` is an optional argument bag. Details:
  //
  //    opts = {
  //        // string to put before a matching character
  //        pre:     '<b>'
  //
  //        // string to put after matching character
  //      , post:    '</b>'
  //
  //        // Optional function. Input is an entry in the given arr`,
  //        // output should be the string to test `pattern` against.
  //        // In this example, if `arr = [{crying: 'koala'}]` we would return
  //        // 'koala'.
  //      , extract: function(arg) { return arg.crying; }
  //    }

  filter = (pattern, arr, opts = {}) => {
    if (!arr || arr.length === 0) {
      return [];
    }

    if (typeof pattern !== 'string') {
      return arr;
    }

    return (
      arr
        .reduce((prev, element, idx) => {
          let str = element;
          if (opts.extract) {
            str = opts.extract(element);
          }
          const rendered = this.match(pattern, str, opts);
          if (rendered != null) {
            /* eslint-disable no-param-reassign */
            prev[prev.length] = {
              string: rendered.rendered,
              score: rendered.score,
              index: idx,
              original: element,
            };
          }
          return prev;
        }, [])

        // Sort by score. Browsers are inconsistent wrt stable/unstable
        // sorting, so force stable by using the index in the case of tie.
        // See http://ofb.net/~sethml/is-sort-stable.html
        .sort((a, b) => {
          const compare = b.score - a.score;
          if (compare) return compare;
          return a.index - b.index;
        })
    );
  };
}

export default new Fuzzy();
