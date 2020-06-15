function add(...nums) {
  let res = sum(nums);

  queueMicrotask(() => {
    console.log(res)
  })

  function sum(nums) {
    return nums.reduce((a, b) => a + b);
  }

  return function addCurry(...nums) {
    if (nums.length === 0) return res;

    res += sum(nums);

    return addCurry;
  };
}

add(5, 4)(3, 2)(1)(3);
