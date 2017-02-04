class Vehicle {
  constructor () {
    this.engine = 1
  }
  ignition () {
    console.log(this)
    console.log('Truning on my engine' + this.engine)
  }

  drive() {
    this.ignition();
    console.log('Steering and moving forward!')
  }
}
class Car extends Vehicle {
  constructor () {
    super()
    this.engine = 2
  }
  ignition () {
    console.log(this)
    console.log('Truning on my engine' + this.engine)
  }
  // this.wheels = 4
}
var vehicle = new Vehicle()
vehicle.drive()

var car = new Car();
car.drive()
