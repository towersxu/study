function Vehicle() {
  this.engines = 1
  this.type = 'tool'
}
Vehicle.prototype.getType = function(){
  console.log(this.type)
}
function Car(){
  var car = new Vehicle()
  car.branch = 'baoma'
  return car
}
var car = new Car()
car.getType()
Vehicle.prototype.getType = function(){
  console.log(this.type+'aa')
}
car.getType()
