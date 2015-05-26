var ISOFile = function(arrayBuffer) {
  this._raw = new DataView(arrayBuffer);
  this._cursor = new ISOBoxer.Cursor();
  this.boxes = [];
}

ISOFile.prototype.fetch = function(type) {
  var result = this.fetchAll(type);
  return (result.length ? result[0] : null);
}

ISOFile.prototype.fetchAll = function(type) {
  var result = [];
  ISOFile._sweep.call(this, type, result);
  return result;
}

ISOFile.prototype.parse = function() {
  this._cursor.offset = 0;
  this.boxes = [];
  while (this._cursor.offset < this._raw.byteLength) {
    var box = ISOBox.parse(this);

    // Box could not be parsed
    if (typeof box.type === 'undefined') break;

    this.boxes.push(box);
  }
  return this;
}

ISOFile._sweep = function(type, result) {
  if (this.type && this.type == type) result.push(this);
  for (var box in this.boxes) {
    ISOFile._sweep.call(this.boxes[box], type, result);
  }
}