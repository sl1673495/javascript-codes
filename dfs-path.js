const test = {
  a: {
    c: {
      w: 2,
      r: {
        q: 4,
      },
    },
    d: 1,
    f: 2,
    e: 3,
  },
  b: {
    h: 4,
    i: {
      p: {
        q: 5,
      },
    },
  },
};

let find = (obj, key, value) => {
  let res;
  let helper = (subObj, path) => {
    if (res) {
      return;
    }
    if (subObj[key] === value) {
      res = path.concat(key);
    }
    Object.keys(subObj).forEach((subKey) => {
      let sub = subObj[subKey];
      if (typeof sub === "object") {
        helper(sub, [...path, subKey]);
      }
    });
  };
  helper(obj, []);
  return res || null;
};

console.log(find(test, "q", 5));
console.log(find(test, "q", 4));
console.log(find(test, "m", 100));


