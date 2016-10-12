var BufferCodec = require('../index');
var expect = require('chai').expect;
var bufferEqual = require('buffer-equal');

describe('#general', function () {

  it('should return buffer', function () {
    var buffer = new ArrayBuffer(1);
    var bufferView = new Int8Array(buffer);
    bufferView[0] = 42;

    var expectedBuffer = BufferCodec(buffer).getBuffer();
    
    var areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should return offsetted buffer', function () {
    var fullBuffer = new ArrayBuffer(2);
    var fullBufferView = new Int8Array(fullBuffer);
    fullBufferView[0] = 42;
    fullBufferView[1] = 84;

    var buffer = new ArrayBuffer(1);
    var bufferView = new Int8Array(buffer);
    bufferView[0] = 84;

    var codec = BufferCodec(fullBuffer);
    codec.offset++;

    var expectedBuffer = codec.getBuffer(true);
    
    var areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
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