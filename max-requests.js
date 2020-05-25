const wait = () =>
  new Promise((resolve) => {
    setTimeout(resolve, 1000 * Math.random())
  })

const multiRequest = (urls, max = 1) => {
  return new Promise((resolve, reject) => {
    let rest = urls.slice()
    let finished = 0
    let currentIndex = 0
    let res = []

    const request = async (idx) => {
      if (rest.length === 0) {
        return
      }

      // 维护本次请求对应数组的下标
      // 由于请求一定是一个换一个的 所以这个下标是可以对应上的
      currentIndex++

      const url = rest.shift()
      try {
        await wait()
      } catch (error) {
        reject(error)
      }

      console.log('res: ', res);
      res[idx] = url
      
      // 请求
      finished++
      if (finished === urls.length) {
        return resolve(res)
      }

      request(currentIndex)
    }

    for (let i = 0; i < max; i++) {
      request(i)
    }
  })
}

console.log(
  multiRequest(["1", "2", "3", "4", "5", 6, 7, 8, 9, 10], 3).then((res) =>
    console.log("res", res),
  ),
)
