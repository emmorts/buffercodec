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
    
    var string = BufferCodec(buffer).parse({ type: 'string', length: now.length });
    
    expect(string).to.equal(now);
  });

  it('should decode a complex object', function () {
    var buffer = new ArrayBuffer(7);
    var bufferView = new DataView(buffer);
    bufferView.setUint8(0, 0x01);
    bufferView.setUint16(1, 0xFFFF, true);
    bufferView.setInt32(3, 0x7FFFFFFF, false);
    
    var obj = BufferCodec(buffer).parse([{
      name: 'test1',
      type: 'uint8'
    }, {
      name: 'test2',
      type: 'uint16le'
    }, {
      name: 'test3',
      type: 'int32be'
    }]);
    
    expect(obj).to.ok;
    expect(obj.test1).to.equal(0x01);
    expect(obj.test2).to.equal(0xFFFF);
    expect(obj.test3).to.equal(0x7FFFFFFF);
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