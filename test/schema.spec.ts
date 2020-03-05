import { BufferSchema, BufferCodec } from '../lib';
import { expect } from 'chai';
import { areBuffersEqual } from './utils';

describe('#schema', () => {

  it('should encode an object', () => {
    const expectedBuffer = new ArrayBuffer(1);
    const expectedBufferDataView = new DataView(expectedBuffer);
    expectedBufferDataView.setInt8(0, 0x7F);

    const schema = new BufferSchema({
      foo: 'int8'
    });

    const schemaBuffer = schema.encode({
      foo: 0x7F
    });

    const areEqual = areBuffersEqual(schemaBuffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should decode an object', () => {
    const buffer = new ArrayBuffer(1);
    const bufferView = new DataView(buffer);
    bufferView.setInt8(0, 0x7F);

    const schema = new BufferSchema({
      foo: 'int8'
    });

    const decodedObject = schema.decode(buffer);

    expect(decodedObject).to.deep.eq({
      foo: 0x7F
    });
  });

  it('should encode an array', () => {
    const expectedBuffer = new ArrayBuffer(3);
    const expectedBufferDataView = new DataView(expectedBuffer);
    expectedBufferDataView.setUint8(0, 2);
    expectedBufferDataView.setUint8(1, 4);
    expectedBufferDataView.setUint8(2, 9);

    const schema = new BufferSchema({
      foo: ['uint8']
    });

    const schemaBuffer = schema.encode({
      foo: [4, 9]
    });

    const areEqual = areBuffersEqual(schemaBuffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should decode an array', () => {
    const buffer = new ArrayBuffer(3);
    const bufferDataView = new DataView(buffer);
    bufferDataView.setUint8(0, 2);
    bufferDataView.setUint8(1, 4);
    bufferDataView.setUint8(2, 9);

    const schema = new BufferSchema({
      foo: ['uint8']
    });

    const decodedObject = schema.decode(buffer);

    expect(decodedObject).to.deep.eq({
      foo: [4, 9]
    });
  });

  it('should encode a nested array of primitives', () => {
    const schema = new BufferSchema({
      outerArray: [{
        innerArray: ['uint8']
      }]
    });

    const object = {
      outerArray: [{
        innerArray: [1, 2]
      }, {
        innerArray: [3, 4]
      }]
    };

    const buffer = schema.encode(object);

    const expectedBuffer = new BufferCodec()
      .uint8(object.outerArray.length)
      .uint8(object.outerArray[0].innerArray.length)
      .uint8(object.outerArray[0].innerArray[0])
      .uint8(object.outerArray[0].innerArray[1])
      .uint8(object.outerArray[1].innerArray.length)
      .uint8(object.outerArray[1].innerArray[0])
      .uint8(object.outerArray[1].innerArray[1])
      .result();
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode a nested array of objects', () => {
    const schema = new BufferSchema({
      outerArray: [{
        innerArray: [{ value: 'uint8' }]
      }]
    });

    const object = {
      outerArray: [{
        innerArray: [{ value: 1 }, { value: 2 }]
      }, {
        innerArray: [{ value: 3 }, { value: 4 }]
      }]
    };

    const buffer = schema.encode(object);

    const expectedBuffer = new BufferCodec()
      .uint8(object.outerArray.length)
      .uint8(object.outerArray[0].innerArray.length)
      .uint8(object.outerArray[0].innerArray[0].value)
      .uint8(object.outerArray[0].innerArray[1].value)
      .uint8(object.outerArray[1].innerArray.length)
      .uint8(object.outerArray[1].innerArray[0].value)
      .uint8(object.outerArray[1].innerArray[1].value)
      .result();
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode a complex object', () => {
    const expectedBuffer = new ArrayBuffer(50);
    const expectedBufferDataView = new DataView(expectedBuffer);
    expectedBufferDataView.setInt8(0, 0x7F);
    expectedBufferDataView.setUint8(1, 0xFF);
    expectedBufferDataView.setInt16(2, 0x7FFF, true);
    expectedBufferDataView.setInt16(4, 0x7FFF, false);
    expectedBufferDataView.setUint16(6, 0xFFFF, true);
    expectedBufferDataView.setUint16(8, 0xFFFF, false);
    expectedBufferDataView.setInt32(10, 0x7FFFFFFF, true);
    expectedBufferDataView.setInt32(14, 0x7FFFFFFF, false);
    expectedBufferDataView.setUint32(18, 0xFFFFFFFF, true);
    expectedBufferDataView.setUint32(22, 0xFFFFFFFF, false);
    expectedBufferDataView.setFloat32(26, Math.PI, true);
    expectedBufferDataView.setFloat32(30, Math.PI, false);
    expectedBufferDataView.setFloat64(34, Math.PI, true);
    expectedBufferDataView.setFloat64(42, Math.PI, false);

    const schema = new BufferSchema({
      int8Test: 'int8',
      uint8Test: 'uint8',
      int16leTest: 'int16le',
      int16beTest: 'int16be',
      uint16leTest: 'uint16le',
      uint16beTest: 'uint16be',
      int32leTest: 'int32le',
      int32beTest: 'int32be',
      uint32leTest: 'uint32le',
      uint32beTest: 'uint32be',
      float32leTest: 'float32le',
      float32beTest: 'float32be',
      float64leTest: 'float64le',
      float64beTest: 'float64be'
    });

    const schemaBuffer = schema.encode({
      int8Test: 0x7F,
      uint8Test: 0xFF,
      int16leTest: 0x7FFF,
      int16beTest: 0x7FFF,
      uint16leTest: 0xFFFF,
      uint16beTest: 0xFFFF,
      int32leTest: 0x7FFFFFFF,
      int32beTest: 0x7FFFFFFF,
      uint32leTest: 0xFFFFFFFF,
      uint32beTest: 0xFFFFFFFF,
      float32leTest: Math.PI,
      float32beTest: Math.PI,
      float64leTest: Math.PI,
      float64beTest: Math.PI
    });

    const areEqual = areBuffersEqual(schemaBuffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode a complex object and use transformation', () => {
    const schema = new BufferSchema({
      id: 'string',
      ownerId: 'string',
      name: 'string',
      targets: [{ id: 'uint8' }],
      health: 'uint16le',
      x: 'float32le',
      y: 'float32le'
    }, {
      transform: object => ({
        id: object.id,
        ownerId: object.ownerId,
        name: object.name,
        health: object.health,
        pos: {
          x: object.x,
          y: object.y
        }
      })
    });

    const player = {
      id: '32165478-QWERTYUI-98765412-ASDFG',
      ownerId: 'ASDFGHJK-98765412-QWERTYUI-32165',
      name: 'Maria Magdalena',
      targets: [{ id: 1 }, { id: 2 }, { id: 3 }],
      health: 50,
      x: 400.5,
      y: 200.1
    };

    const buffer = schema.encode(player);

    const expectedBuffer = new BufferCodec()
      .string(player.id)
      .string(player.ownerId)
      .string(player.name)
      .uint8(player.targets.length)
      .uint8(player.targets[0].id)
      .uint8(player.targets[1].id)
      .uint8(player.targets[2].id)
      .uint16(player.health, true)
      .float32(player.x, true)
      .float32(player.y, true)
      .result();
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

});