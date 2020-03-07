"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const lib_1 = require("../lib");
const utils_1 = require("./utils");
describe('#strategy', () => {
    it('should throw when getting strategy for unregistered template', () => {
        const templateName = 'non-existing-template';
        chai_1.expect(() => {
            lib_1.BufferStrategy.getTemplateStrategy(templateName);
        }).to.throw(`Strategy for provided template '${templateName}' was not found`);
    });
    it('should throw when attempting to get options for not provided type', () => {
        chai_1.expect(() => {
            lib_1.BufferStrategy.getTypeOptions('');
        }).to.throw(`Type was not provided`);
    });
    it('should use a newly added strategy to encode a type', () => {
        const bufferCodec = new lib_1.BufferCodec();
        lib_1.BufferStrategy.addStrategy(LifeStrategy);
        lib_1.BufferStrategy.encode(null, 'foo', bufferCodec);
        const buffer = bufferCodec.result();
        const expectedBuffer = new ArrayBuffer(1);
        const uint8Array = new Uint8Array(expectedBuffer);
        uint8Array[0] = 42;
        const areEqual = utils_1.areBuffersEqual(buffer, expectedBuffer);
        chai_1.expect(areEqual).to.be.true;
    });
    it('should use a newly added strategy to decode a type', () => {
        const bufferCodec = new lib_1.BufferCodec();
        lib_1.BufferStrategy.addStrategy(LifeStrategy);
        const result = lib_1.BufferStrategy.decode('foo', bufferCodec);
        chai_1.expect(result).to.be.eq(42);
    });
});
class LifeStrategy {
    static supports(template) {
        return typeof (template) === 'string' && template === 'foo';
    }
    static encode(value, template, codec) {
        codec.uint8(42);
    }
    static decode(template, codec) {
        return 42;
    }
}
