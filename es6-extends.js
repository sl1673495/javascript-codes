function inherits(Sub, Sup) {
  // 静态方法继承
  Sub.__proto__ = Sup

  // 原型链继承
  Sub.prototype = Object.create(Sup.prototype)
  Sub.prototype.constructor = Sub
}

function Animal(name) {
  this.name = name
}

Animal.staticSay = function() {
  console.log("我是静态方法")
}

Animal.prototype.say = function () {
  console.log("我会说话")
}

function Dog(name) {
  if (new.target !== Dog) {
    throw new TypeError("Class constructor A cannot be invoked without 'new'")
  }
  Animal.call(this, name)
  this.type = "Dog"
}

inherits(Dog, Animal)

Dog.prototype.bark = function () {
  console.log("汪汪汪")
}

let dog = new Dog("wangcai")

dog.bark()
dog.say()

Dog.staticSay()