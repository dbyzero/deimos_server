/**
 *
 * Vector2 utilty class
 *
 * @author dbyzero
 * @date : 2013/09/05
 *
 * */

/**
 * Vector2 constructor
 */

var Vector2 = function(x,y) {
    this.x = x ;
    this.y = y ;
}

Vector2.Sum = function(vector1,vector2) {
    return new Vector2(parseInt(vector1.x) + parseInt(vector2.x), parseInt(vector1.y) + parseInt(vector2.y)) ;
}

Vector2.Sub = function(vector1,vector2) {
    return new Vector2(parseInt(vector1.x) - parseInt(vector2.x), parseInt(vector1.y) - parseInt(vector2.y)) ;
}

Vector2.Dot = function(vector1,vector2) {
    return new Vector2(parseFloat(vector1.x) * parseFloat(vector2.x), parseFloat(vector1.y) * parseFloat(vector2.y)) ;
}

Vector2.Scalar = function(vector1,scal) {
    return new Vector2(parseFloat(vector1.x) * scal, parseFloat(vector1.y) * scal) ;
}

Vector2.getNullVector = function() {
    return new Vector2(0,0);
}

Vector2.prototype.add = function(vectorToAdd) {
    this.x = vectorToAdd.x + this.x ;
    this.y = vectorToAdd.y + this.y ;
}

Vector2.prototype.dot = function(vec_) {
    this.x = vec_.x * this.x ;
    this.y = vec_.y * this.y ;
}

Vector2.prototype.scalar = function(scal) {
    this.x = scal * this.x ;
    this.y = scal * this.y ;
}

Vector2.prototype.duplicate = function() {
    return new Vector2(this.x,this.y) ;
}

Vector2.prototype.lengthSquare = function() {
    return (this.x*this.x + this.y*this.y) ;
}

//if possible, prefeatr lengthSquare who is faster
Vector2.prototype.length = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y) ;
}

//return the Vector2 module
module.exports = Vector2 ;