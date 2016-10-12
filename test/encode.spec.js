var BufferCodec = require('../index');
var expect = require('chai').expect;
var bufferEqual = require('buffer-equal');

describe('#encode', function () {

  it('should encode a string', function () {
    var now = new Date().toString();
    var codec = new BufferCodec();
    var buffer = codec.string(now).result();

    var expectedBuffer = new ArrayBuffer(now.length * 2);
    var expectedBufferView = new Uint16Array(expectedBuffer);
    for (var i = 0, strLen = now.length; i < strLen; i++) {
      expectedBufferView[i] = now.charCodeAt(i);
    }
    
    var areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode int8', function () {
    var codec = new BufferCodec();
    var buffer = codec.int8(-255).result();

    var expectedBuffer = new ArrayBuffer(1);
    var expectedBufferView = new Int8Array(expectedBuffer);
    expectedBufferView[0] = -255;
    
    var areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode uint8', function () {
    var codec = new BufferCodec();
    var buffer = codec.uint8(255).result();

    var expectedBuffer = new ArrayBuffer(1);
    var expectedBufferView = new Uint8Array(expectedBuffer);
    expectedBufferView[0] = 255;
    
    var areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode int16le', function () {
    var codec = new BufferCodec();
    var buffer = codec.int16le(-65535).result();

    var expectedBuffer = new ArrayBuffer(2);
    var expectedBufferView = new Int16Array(expectedBuffer);
    expectedBufferView[0] = -65535;
    
    var areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode int16be', function () {
    var codec = new BufferCodec();
    var buffer = codec.int16be(-65535).result();

    var expectedBuffer = new ArrayBuffer(2);
    var expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setInt16(0, -65535, false);
    
    var areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode multiple types', function () {
    var codec = new BufferCodec();
    var buffer = codec
      .int8(0x1)
      .uint16le(Math.pow(2, 10))
      .uint16le(Math.pow(2, 8))
      .float32le(Math.PI)
      .result();

    var expectedBuffer = new ArrayBuffer(9);
    var expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setUint8(0, 0x1);
    expectedBufferView.setUint16(1, Math.pow(2, 10), true);
    expectedBufferView.setUint16(3, Math.pow(2, 8), true);
    expectedBufferView.setFloat32(5, Math.PI, true);
    
    var areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode a complex object using schema', function () {
    var schema = new BufferCodec.Schema({
      id: { type: 'string', length: 32 },
      ownerId: { type: 'string', length: 32},
      name: 'string',
      targets: [{ id: 'uint8' }],
      health: 'uint16le',
      x: 'float32le',
      y: 'float32le'
    }, function (object) {
      return {
        id: object.id,
        ownerId: object.ownerId,
        name: object.name,
        health: object.health,
        pos: {
          x: object.x,
          y: object.y
        }
      };
    });

    var player = {
      id: '32165478-QWERTYUI-98765412-ASDFG',
      ownerId: 'ASDFGHJK-98765412-QWERTYUI-32165',
      name: 'Maria Magdalena',
      targets: [{ id: 1 }, { id: 2 }, { id: 3 }],
      health: 50,
      x: 400.5,
      y: 200.1
    };

    var buffer = schema.encode(player);

    var expectedBuffer = new BufferCodec()
      .uint8(player.id.length)
      .string(player.id)
      .uint8(player.ownerId.length)
      .string(player.ownerId)
      .uint8(player.name.length)
      .string(player.name)
      .uint8(player.targets.length)
      .uint8(player.targets[0].id)
      .uint8(player.targets[1].id)
      .uint8(player.targets[2].id)
      .uint16le(player.health)
      .float32le(player.x)
      .float32le(player.y)
      .result();
    
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