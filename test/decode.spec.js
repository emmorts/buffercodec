var BufferCodec = require('../index');
var expect = require('chai').expect;
var bufferEqual = require('buffer-equal');

describe('#decode', function () {

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
    
    var result = BufferCodec(buffer).parse([{
      id: 'uint8',
      value: 'uint16le'
    }]);
    
    expect(result).to.be.ok;
    expect(result).to.deep.equal(objects);
  });

  it('should decode a complex object and transform it using schema', function () {
    var player = {
      id: '32165478-QWERTYUI-98765412-ASDFG',
      ownerId: 'ASDFGHJK-98765412-QWERTYUI-32165',
      targets: [{ id: 1 }, { id: 2 }, { id: 3 }],
      health: 50,
      x: 400,
      y: 200
    };

    var schema = new BufferCodec.Schema({
      id: 'string',
      ownerId: 'string',
      targets: [{ id: 'uint8' }],
      health: 'uint16le',
      x: 'float32le',
      y: 'float32le'
    }, function (object) {
      return {
        id: object.id,
        ownerId: object.ownerId,
        health: object.health,
        pos: {
          x: object.x,
          y: object.y
        }
      };
    });

    var buffer = schema.encode(player);

    var decodedObject = schema.decode(buffer);

    expect(decodedObject).to.be.ok;
    expect(decodedObject).to.deep.equal({
      id: player.id,
      ownerId: player.ownerId,
      health: player.health,
      pos: {
        x: player.x,
        y: player.y
      }
    });
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