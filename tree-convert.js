// https://shimo.im/forms/yXUgGENQI5kRr88f

/**
 * 假设后端同学通过接口向前端返回了天猫的行业信息，为了取用方便，我们希望可以将其转换为树状格式，例如：
{
  "数码": {
    "电脑配件": {
        "内存" : {}
     }
  },
  "女装" : {
     "连衣裙": {},
    "半身裙": {},
    "A字裙": {}
  }
}
实现一个方法完成这个转换
function convert_format(data)
*/

let list = [
  {
    parent_ind: '女装',
    name: '连衣裙',
  },
  {
    name: '女装',
  },
  {
    parent_ind: '女装',
    name: '半身裙',
  },
  {
    parent_ind: '女装',
    name: 'A字裙',
  },
  {
    name: '数码',
  },
  {
    parent_ind: '数码',
    name: '电脑配件',
  },
  {
    parent_ind: '电脑配件',
    name: '内存',
  },
]

let convert = list => {
  let res = {}
  let copy = list.slice()
  let nodeMap = {undefined: res}

  while (copy.length) {
    let cachedLen = copy.length

    for (let i = copy.length - 1; i >= 0; i--) {
      let item = copy[i]
      let {parent_ind: parentName, name} = item
      let parent = nodeMap[parentName]
      if (parent) {
        let node = {}
        parent[name] = node
        nodeMap[name] = node
        copy.splice(i, 1)
      }
    }

    if (cachedLen === copy.length) {
      break
    }
  }
  return res
}

console.log(convert(list))

/**
 * 大数据量
    list = []
    for (let i = 0; i < 100; i++) {
    list.push({ name: `层级${i}` })
    }

    for (let i = 0; i < 10000; i++) {
    let pl = i % 100
    list.push({ parent_ind: `层级${pl}`, name: `层级${pl}-${i}` })
    }

    for (let i = 0; i < 10000; i++) {
    let ppl = i % 100
    list.push({ parent_ind: `层级${ppl}-${i}`, name: `层级${ppl}-${i}-${i}` })
    }

    list.sort((a, b) => Math.random() - 0.5)
 */
