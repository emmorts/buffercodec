var BufferCodec = require('../index');
var expect = require('chai').expect;
var bufferEqual = require('buffer-equal');

describe('#decode', function () {

  it('should decode a string', function () {
    var now = new Date().toString();

    var buffer = new ArrayBuffer(now.length * 2);
    var bufferView = new Uint16Array(buffer);
    for (var i = 0, strLen = now.length; i < strLen; i++) {
      bufferView[i] = now.charCodeAt(i);
    }
    
    var result = BufferCodec(buffer).parse({
      date: { type: 'string', length: now.length }
    });
    
    expect(result.date).to.equal(now);
  });

  it('should decode a complex object', function () {
    var buffer = new ArrayBuffer(7);
    var bufferView = new DataView(buffer);
    bufferView.setUint8(0, 0x01);
    bufferView.setUint16(1, 0xFFFF, true);
    bufferView.setInt32(3, 0x7FFFFFFF, false);
    
    var obj = BufferCodec(buffer).parse({
      test1: 'uint8',
      test2: 'uint16le',
      test3: { type: 'int32be' },
    });
    
    expect(obj).to.be.ok;
    expect(obj.test1).to.equal(0x01);
    expect(obj.test2).to.equal(0xFFFF);
    expect(obj.test3).to.equal(0x7FFFFFFF);
  });

  it('should decode a complex object and transform it', function () {
    var buffer = new ArrayBuffer(7);
    var bufferView = new DataView(buffer);
    bufferView.setUint8(0, 0x01);
    bufferView.setUint16(1, 0xFFFF, true);
    bufferView.setInt32(3, 0x7FFFFFFF, false);
    
    var obj = BufferCodec(buffer).parse({
      test1: 'uint8',
      test2: 'uint16le',
      test3: { type: 'int32be' },
    }, function (result) {
      return [
        result.test1,
        result.test2,
        result.test3
      ];
    });
    
    expect(obj).to.be.ok;
    expect(obj[0]).to.equal(0x01);
    expect(obj[1]).to.equal(0xFFFF);
    expect(obj[2]).to.equal(0x7FFFFFFF);
  });
  
  it('should decode an array', function () {
    var objects = [1, 2, 3].map(function (number) {
      return { id: number, value: number*number };
    });
    
    var buffer = new ArrayBuffer(1 + objects.length * 3);
    var bufferView = new DataView(buffer);
    var offset = 0;
    
    bufferView.setUint8(offset++, objects.length);
    
    objects.forEach(function (object) {
      bufferView.setUint8(offset++, object.id);
      bufferView.setUint16(offset, object.value, true);
      offset += 2;
    });
    
    var result = BufferCodec(buffer).parse({
      test: [{
        id: 'uint8',
        value: 'uint16le'
      }]
    });
    
    expect(result.test).to.be.ok;
    expect(result.test).to.deep.equal(objects);
  });

});

function areBuffersEqual(bufferA, bufferB) {
  return bufferEqual(toBuffer(bufferA), toBuffer(bufferB));
}

function toBuffer(ab) {
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}