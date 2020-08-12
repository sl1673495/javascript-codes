/**
const log = jest.fn();
const subFlow = createFlow([() => log('subFlow')]),

createFlow([
  () => log('a'),
  () => log('b'),
subFlow,
  [
    () => delay().then(() => log('c')),
    () => log('d'),
  ]
]).run(null, () => {
  expect(log.mock.calls[0][0]).toBe('a')
  expect(log.mock.calls[1][0]).toBe('b')
  expect(log.mock.calls[2][0]).toBe('subFlow')
  expect(log.mock.calls[3][0]).toBe('c')
  expect(log.mock.calls[4][0]).toBe('d')
})



按照上面的测试用例，实现 createFlow：

flow 是指一些列 effects（这里是普通的函数）组成的逻辑片段
flow 支持嵌套
effects 的执行只需要支持串行
*/

function createFlow(effects = []) {
  let sources = effects.slice().flat();
  function run(callback) {
    while (sources.length) {
      const task = sources.shift();
      if (typeof task === "function") {
        const res = task();
        if (res?.then) {
          res.then(createFlow(sources).run);
          break;
        }
      } else if (task?.isFlow) {
        task.run(createFlow(sources).run);
        break;
      }
    }
    callback?.();
  }
  return {
    run,
    isFlow: true,
  };
}

const delay = () => new Promise((resolve) => setTimeout(resolve, 1000));
createFlow([
  () => console.log("a"),
  () => console.log("b"),
  createFlow([() => console.log("c")]),
  [() => delay().then(() => console.log("d")), () => console.log("e")],
]).run();
