import { expect } from 'chai';
import { BufferCodec } from '../lib';

describe('#decode', () => {

  const EPSILON = 10**(-6);

  it('should decode a complex object', () => {

    const buffer = new ArrayBuffer(50);
    const bufferDataView = new DataView(buffer);
    bufferDataView.setInt8(0, 0x7F);
    bufferDataView.setUint8(1, 0xFF);
    bufferDataView.setInt16(2, 0x7FFF, true);
    bufferDataView.setInt16(4, 0x7FFF, false);
    bufferDataView.setUint16(6, 0xFFFF, true);
    bufferDataView.setUint16(8, 0xFFFF, false);
    bufferDataView.setInt32(10, 0x7FFFFFFF, true);
    bufferDataView.setInt32(14, 0x7FFFFFFF, false);
    bufferDataView.setUint32(18, 0xFFFFFFFF, true);
    bufferDataView.setUint32(22, 0xFFFFFFFF, false);
    bufferDataView.setFloat32(26, Math.PI, true);
    bufferDataView.setFloat32(30, Math.PI, false);
    bufferDataView.setFloat64(34, Math.PI, true);
    bufferDataView.setFloat64(42, Math.PI, false);

    const obj = BufferCodec
      .from(buffer)
      .setEncoding('utf8')
      .parse({
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

    expect(obj).to.be.ok;
    expect(obj.int8Test).to.equal(0x7F);
    expect(obj.uint8Test).to.equal(0xFF);
    expect(obj.int16leTest).to.equal(0x7FFF);
    expect(obj.int16beTest).to.equal(0x7FFF);
    expect(obj.uint16leTest).to.equal(0xFFFF);
    expect(obj.uint16beTest).to.equal(0xFFFF);
    expect(obj.int32leTest).to.equal(0x7FFFFFFF);
    expect(obj.int32beTest).to.equal(0x7FFFFFFF);
    expect(obj.uint32leTest).to.equal(0xFFFFFFFF);
    expect(obj.uint32beTest).to.equal(0xFFFFFFFF);
    expect(obj.float32leTest).to.be.closeTo(Math.PI, EPSILON);
    expect(obj.float32beTest).to.be.closeTo(Math.PI, EPSILON);
    expect(obj.float64leTest).to.be.closeTo(Math.PI, EPSILON);
    expect(obj.float64beTest).to.be.closeTo(Math.PI, EPSILON);
  });

  it('should decode UTF-8 string', () => {
    const stringValue = 'hello world';
    const stringLength = stringValue.length;
    
    const buffer = new ArrayBuffer(stringLength + 1);
    const bufferDataView = new DataView(buffer);

    bufferDataView.setUint8(0, stringLength);

    for (let i = 0, offset = 1; i < stringLength; i++, offset++) {
      bufferDataView.setUint8(offset, stringValue.charCodeAt(i));
    }

    const obj = BufferCodec
      .from(buffer)
      .setEncoding('utf8')
      .parse({
        stringUtf8Test: 'string'
      });

    expect(obj).to.be.ok;
    expect(obj.stringUtf8Test).to.equal(stringValue);
  });

  it('should decode UTF-16 string', () => {
    const stringValue = 'hello world';
    const stringLength = stringValue.length;

    const buffer = new ArrayBuffer(stringLength * 2 + 1);
    const bufferDataView = new DataView(buffer);

    bufferDataView.setUint8(0, stringLength);

    for (let i = 0, offset = 1; i < stringLength; i++, offset += 2) {
      bufferDataView.setUint16(offset, stringValue.charCodeAt(i), true);
    }

    const obj = BufferCodec
      .from(buffer)
      .setEncoding('utf16')
      .parse({
        stringUtf16Test: 'string'
      });

    expect(obj).to.be.ok;
    expect(obj.stringUtf16Test).to.equal(stringValue);
  });

  it('should decode a nested object', () => {
    const buffer = new ArrayBuffer(7);
    const bufferView = new DataView(buffer);
    bufferView.setUint8(0, 0x01);
    bufferView.setUint16(1, 0xFFFF, true);
    bufferView.setInt32(3, 0x7FFFFFFF, false);
    
    const obj = BufferCodec.from(buffer).parse({
      test1: 'uint8',
      test2: 'uint16|littleEndian',
      inner: {
        test3: 'int32',
      }
    });
    
    expect(obj).to.be.ok;
    expect(obj.test1).to.equal(0x01);
    expect(obj.test2).to.equal(0xFFFF);
    expect(obj.inner).to.be.ok;
    expect(obj.inner.test3).to.equal(0x7FFFFFFF);
  });
  
  it('should decode an array', () => {
    const objects = [1, 2, 3].map(number => ({ id: number, value: number ** 2 }));
    
    const buffer = new ArrayBuffer(1 + objects.length * 3);
    const bufferView = new DataView(buffer);
    let offset = 0;
    
    bufferView.setUint8(offset++, objects.length);
    
    objects.forEach(object => {
      bufferView.setUint8(offset++, object.id);
      bufferView.setUint16(offset, object.value, true);
      offset += 2;
    });
    
    const result = BufferCodec.from(buffer).parse([{
      id: 'uint8',
      value: 'uint16|littleEndian'
    }]);
    
    expect(result).to.be.ok;
    expect(result).to.deep.equal(objects);
  });

});