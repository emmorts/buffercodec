import { BufferCodec, BufferSchema } from '../lib';
import { expect } from 'chai';
import { areBuffersEqual } from './utils';

describe('#encode', () => {

  it('should encode UTF-16 string', () => {
    const now = new Date().toString();
    const codec = new BufferCodec();
    const buffer = codec.string(now).result();

    const expectedBuffer = new ArrayBuffer(now.length * 2 + 1);
    const expectedBufferDataView = new DataView(expectedBuffer);

    expectedBufferDataView.setUint8(0, now.length);

    for (let i = 0, offset = 1, strLen = now.length; i < strLen; i++, offset += 2) {
      expectedBufferDataView.setUint16(offset, now.charCodeAt(i), true);
    }
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode UTF-8 string', () => {
    const now = new Date().toString();
    const codec = new BufferCodec({ encoding: 'utf8' });
    const buffer = codec.string(now).result();

    const expectedBuffer = new ArrayBuffer(now.length + 1);
    const expectedBufferDataView = new DataView(expectedBuffer);

    expectedBufferDataView.setUint8(0, now.length);

    for (let i = 0, offset = 1, strLen = now.length; i < strLen; i++, offset += 1) {
      expectedBufferDataView.setUint8(offset, now.charCodeAt(i));
    }
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode int8', () => {
    const codec = new BufferCodec();
    const buffer = codec.int8(-255).result();

    const expectedBuffer = new ArrayBuffer(1);
    const expectedBufferView = new Int8Array(expectedBuffer);
    expectedBufferView[0] = -255;
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode uint8', () => {
    const codec = new BufferCodec();
    const buffer = codec.uint8(255).result();

    const expectedBuffer = new ArrayBuffer(1);
    const expectedBufferView = new Uint8Array(expectedBuffer);
    expectedBufferView[0] = 255;
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode uint16le', () => {
    const codec = new BufferCodec();
    const buffer = codec.uint16(65535, true).result();

    const expectedBuffer = new ArrayBuffer(2);
    const expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setUint16(0, 65535, true);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode uint16be', () => {
    const codec = new BufferCodec();
    const buffer = codec.uint16(65535).result();

    const expectedBuffer = new ArrayBuffer(2);
    const expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setUint16(0, 65535, false);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode int16le', () => {
    const codec = new BufferCodec();
    const buffer = codec.int16(-65535, true).result();

    const expectedBuffer = new ArrayBuffer(2);
    const expectedBufferView = new Int16Array(expectedBuffer);
    expectedBufferView[0] = -65535;
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode int16be', () => {
    const codec = new BufferCodec();
    const buffer = codec.int16(-65535).result();

    const expectedBuffer = new ArrayBuffer(2);
    const expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setInt16(0, -65535, false);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode uint32le', () => {
    const codec = new BufferCodec();
    const buffer = codec.uint32(4294967295, true).result();

    const expectedBuffer = new ArrayBuffer(4);
    const expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setUint32(0, 4294967295, true);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode uint32be', () => {
    const codec = new BufferCodec();
    const buffer = codec.uint32(4294967295).result();

    const expectedBuffer = new ArrayBuffer(4);
    const expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setUint32(0, 4294967295, false);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode int32le', () => {
    const codec = new BufferCodec();
    const buffer = codec.int32(-4294967295, true).result();

    const expectedBuffer = new ArrayBuffer(4);
    const expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setInt32(0, -4294967295, true);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode int32be', () => {
    const codec = new BufferCodec();
    const buffer = codec.int32(-4294967295).result();

    const expectedBuffer = new ArrayBuffer(4);
    const expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setInt32(0, -4294967295, false);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode float32le', () => {
    const codec = new BufferCodec();
    const buffer = codec.float32(1.1 * 10**38, true).result();

    const expectedBuffer = new ArrayBuffer(4);
    const expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setFloat32(0, 1.1 * 10**38, true);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode float32be', () => {
    const codec = new BufferCodec();
    const buffer = codec.float32(1.1 * 10**38).result();

    const expectedBuffer = new ArrayBuffer(4);
    const expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setFloat32(0, 1.1 * 10**38, false);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode float64le', () => {
    const codec = new BufferCodec();
    const buffer = codec.float64(1.1 * 10**300, true).result();

    const expectedBuffer = new ArrayBuffer(8);
    const expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setFloat64(0, 1.1 * 10**300, true);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode float64be', () => {
    const codec = new BufferCodec();
    const buffer = codec.float64(1.1 * 10**300).result();

    const expectedBuffer = new ArrayBuffer(8);
    const expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setFloat64(0, 1.1 * 10**300, false);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should encode multiple types', () => {
    const codec = new BufferCodec();
    const buffer = codec
      .int8(0x1)
      .uint16(Math.pow(2, 10), true)
      .uint16(Math.pow(2, 8), true)
      .float32(Math.PI, true)
      .result();

    const expectedBuffer = new ArrayBuffer(9);
    const expectedBufferView = new DataView(expectedBuffer);
    expectedBufferView.setUint8(0, 0x1);
    expectedBufferView.setUint16(1, Math.pow(2, 10), true);
    expectedBufferView.setUint16(3, Math.pow(2, 8), true);
    expectedBufferView.setFloat32(5, Math.PI, true);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

});
