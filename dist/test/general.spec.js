"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const lib_1 = require("../lib");
const utils_1 = require("./utils");
describe('#general', () => {
    it('should return buffer', () => {
        const buffer = new ArrayBuffer(1);
        const bufferView = new Int8Array(buffer);
        bufferView[0] = 42;
        const expectedBuffer = lib_1.BufferCodec.from(buffer).buffer;
        const areEqual = utils_1.areBuffersEqual(buffer, expectedBuffer);
        chai_1.expect(areEqual).to.be.true;
    });
    it('should return buffer\'s offset', () => {
        const bufferCodec = new lib_1.BufferCodec();
        chai_1.expect(bufferCodec.offset).to.eq(0);
        bufferCodec.float32(Math.PI).result();
        chai_1.expect(bufferCodec.offset).to.eq(4);
    });
    it('should create a buffer from Node Buffer', () => {
        const buffer = Buffer.from([1, 2, 3]);
        const codec = lib_1.BufferCodec.from(buffer);
        const areEqual = utils_1.areBuffersEqual(buffer, codec.buffer);
        chai_1.expect(areEqual).to.be.true;
    });
    it('should throw if instantiating with unsupported encoding', () => {
        chai_1.expect(() => {
            new lib_1.BufferCodec({
                // @ts-ignore
                encoding: 'unknown'
            });
        }).to.throw("Unsupported encoding 'unknown'. Only UTF-8 and UTF-16 are currently supported.");
    });
    it('should throw if instantiating with invalid buffer', () => {
        chai_1.expect(() => {
            lib_1.BufferCodec.from(Buffer.from([]));
        }).to.throw("Received malformed data.");
    });
    it('should return an empty buffer on a new instance', () => {
        const codec = new lib_1.BufferCodec();
        const buffer = codec.buffer;
        chai_1.expect(buffer.byteLength).to.be.eq(0);
    });
});
