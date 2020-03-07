import { BufferSchema, BufferCodec } from '../lib';
import * as chai from 'chai';
import { areBuffersEqual } from './utils';

const expect = chai.expect;

chai.use(require('chai-roughly'));

describe('#schema', () => {

  it('should encode an int8', () => {
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

  it('should decode an int8', () => {
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

  it('should encode an int16 using big endian', () => {
    const expectedBuffer = new ArrayBuffer(2);
    const expectedBufferDataView = new DataView(expectedBuffer);
    expectedBufferDataView.setInt16(0, 0x7F);

    const schema = new BufferSchema({
      foo: 'int16'
    });

    const schemaBuffer = schema.encode({
      foo: 0x7F
    });

    const areEqual = areBuffersEqual(schemaBuffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode an int16 using little endian', () => {
    const expectedBuffer = new ArrayBuffer(2);
    const expectedBufferDataView = new DataView(expectedBuffer);
    expectedBufferDataView.setInt16(0, 0x7F, true);

    const schema = new BufferSchema({
      foo: 'int16|littleEndian'
    });

    const schemaBuffer = schema.encode({
      foo: 0x7F
    });

    const areEqual = areBuffersEqual(schemaBuffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should decode an int16 using big endian', () => {
    const buffer = new ArrayBuffer(2);
    const bufferView = new DataView(buffer);
    bufferView.setInt16(0, 0x7F);

    const schema = new BufferSchema({
      foo: 'int16'
    });

    const decodedObject = schema.decode(buffer);

    expect(decodedObject).to.deep.eq({
      foo: 0x7F
    });
  });

  it('should decode an int16 using little endian', () => {
    const buffer = new ArrayBuffer(2);
    const bufferView = new DataView(buffer);
    bufferView.setInt16(0, 0x7F, true);

    const schema = new BufferSchema({
      foo: 'int16|littleEndian'
    });

    const decodedObject = schema.decode(buffer);

    expect(decodedObject).to.deep.eq({
      foo: 0x7F
    });
  });

  it('should encode an array of uint8', () => {
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

  it('should decode an array of uint8', () => {
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

  it('should decode a strings with different encodings', () => {
    const target = {
      foo: 'bar',
      bar: 'baz'
    };

    const schema = new BufferSchema({
      foo: 'string|utf8',
      bar: 'string|utf16'
    });

    const buffer = schema.encode(target);
    const decodedObject = schema.decode(buffer);

    expect(decodedObject).to.deep.equal(target);
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
      int16leTest: 'int16|littleEndian',
      int16beTest: 'int16',
      uint16leTest: 'uint16|littleEndian',
      uint16beTest: 'uint16',
      int32leTest: 'int32|littleEndian',
      int32beTest: 'int32',
      uint32leTest: 'uint32|littleEndian',
      uint32beTest: 'uint32',
      float32leTest: 'float32|littleEndian',
      float32beTest: 'float32',
      float64leTest: 'float64|littleEndian',
      float64beTest: 'float64'
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

  it('should decode a complex object', () => {
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
      int16leTest: 'int16|littleEndian',
      int16beTest: 'int16',
      uint16leTest: 'uint16|littleEndian',
      uint16beTest: 'uint16',
      int32leTest: 'int32|littleEndian',
      int32beTest: 'int32',
      uint32leTest: 'uint32|littleEndian',
      uint32beTest: 'uint32',
      float32leTest: 'float32|littleEndian',
      float32beTest: 'float32',
      float64leTest: 'float64|littleEndian',
      float64beTest: 'float64'
    });

    const decodedObject = schema.decode(expectedBuffer);

    (expect(decodedObject).to as any).roughly.deep.eq({
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
      float64beTest: Math.PI,
    });
  });

});