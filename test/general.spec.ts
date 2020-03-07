import { expect } from 'chai';
import { BufferCodec } from '../lib';
import { areBuffersEqual } from './utils';

describe('#general', () => {

  it('should return buffer', () => {
    const buffer = new ArrayBuffer(1);
    const bufferView = new Int8Array(buffer);
    bufferView[0] = 42;

    const expectedBuffer = BufferCodec.from(buffer).buffer;
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should return buffer\'s offset', () => {
    const bufferCodec = new BufferCodec();
    expect(bufferCodec.offset).to.eq(0);

    bufferCodec.float32(Math.PI).result();
    expect(bufferCodec.offset).to.eq(4);
  });

  it('should create a buffer from Node Buffer', () => {
    const buffer = Buffer.from([1, 2, 3]);
    const codec = BufferCodec.from(buffer);

    const areEqual = areBuffersEqual(buffer, codec.buffer);

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
    const buffer = codec.buffer;

    expect(buffer.byteLength).to.be.eq(0);
  })

});
