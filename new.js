function myNew(Ctor, ...args) {
  if (!Ctor.prototype) {
    throw new Error(`${Ctor.toString()} is not a constructor`)
  }

  myNew.target = Ctor

  const instance = {}
  Object.setPrototypeOf(instance, Ctor.prototype)

  const res = Ctor.apply(instance, args)

  const isObject = typeof res === "object" && res !== null
  const isFunction = typeof res === "function"

  if (isObject || isFunction) {
    return res
  } else {
    return instance
  }
}

function Dog(name) {
  this.name = name
}

Dog.prototype.bark = function () {
  console.log(`我是${this.name}，汪汪汪`)
}

let dog = myNew(Dog, "Husky")

dog.bark()
