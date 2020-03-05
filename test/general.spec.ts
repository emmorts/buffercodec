import { BufferCodec } from '../lib';
import { expect } from 'chai';
import { areBuffersEqual } from './utils';

describe('#general', () => {

  it('should return buffer', () => {
    const buffer = new ArrayBuffer(1);
    const bufferView = new Int8Array(buffer);
    bufferView[0] = 42;

    const expectedBuffer = BufferCodec.from(buffer).getBuffer();
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should return offsetted buffer', () => {
    const fullBuffer = new ArrayBuffer(2);
    const fullBufferView = new Int8Array(fullBuffer);
    fullBufferView[0] = 42;
    fullBufferView[1] = 84;

    const buffer = new ArrayBuffer(1);
    const bufferView = new Int8Array(buffer);
    bufferView[0] = 84;

    const codec = BufferCodec.from(fullBuffer);
    codec.offset++;

    const expectedBuffer = codec.getBuffer(true);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should create a buffer from Node Buffer', () => {
    const buffer = Buffer.from([1, 2, 3]);
    const codec = BufferCodec.from(buffer);

    const codecBuffer = codec.getBuffer();

    const areEqual = areBuffersEqual(buffer, codecBuffer);

    expect(areEqual).to.be.true;
  })

  it('should throw if instantiating with unsupported encoding', () => {
    expect(() => {
      new BufferCodec({
        // @ts-ignore
        encoding: 'unknown'
      });
    }).to.throw("Unsupported encoding 'unknown'. Only UTF-8 and UTF-16 are currently supported.")
  });

  it('should throw if instantiating with invalid buffer', () => {
    expect(() => {
      BufferCodec.from(Buffer.from([]));
    }).to.throw("Received malformed data.")
  });

  it('should return an empty buffer on a new instance', () => {
    const codec = new BufferCodec();
    const buffer = codec.getBuffer();

    expect(buffer.byteLength).to.be.eq(0);
  })

});
