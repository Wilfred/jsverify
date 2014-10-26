"use strict";

var environment = require("./environment.js");
var typify = require("./typify.js");
var utils = require("./utils.js");

/**
  - `suchthat(arb: arbitrary a, p : a -> bool): arbitrary a`
      Arbitrary of values that satisfy `p` predicate. It's advised that `p`'s accept rate is high.
*/
function suchthat(arb, predicate) {
  arb = typeof arb === "string" ? typify.parseTypify(environment, arb) : arb;
  arb = utils.force(arb);

  return {
    generator: function (size) {
      for (var i = 0; ; i++) {
        // if 5 tries failed, increase size
        if (i > 5) {
          i = 0;
          size += 1;
        }

        var x = arb.generator(size);
        if (predicate(x)) {
          return x;
        }
      }
    },

    shrink: function (x) {
      return arb.shrink(x).filter(predicate);
    },

    show: arb.show,
  };
}

module.exports = {
  suchthat: suchthat,
};