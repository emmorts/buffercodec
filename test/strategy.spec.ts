import { expect } from 'chai';
import { BufferCodec } from '../lib/BufferCodec';
import { areBuffersEqual } from './utils';
import { BufferStrategy } from '../lib/BufferStrategy';
import { StrategyBase } from '../lib/strategies/StrategyBase';
import { BufferValueTemplate } from '../lib/buffer.types';


describe('#strategy', () => {

  it('should throw when getting strategy for unregistered template', () => {
    const templateName = 'non-existing-template';

    expect(() => {
      BufferStrategy.getTemplateStrategy(templateName);
    }).to.throw(`Strategy for provided template '${templateName}' was not found`);
  });

  it('should throw when attempting to get options for not provided type', () => {
    expect(() => {
      BufferStrategy.getTypeOptions('');
    }).to.throw(`Type was not provided`);
  });

  it('should use a newly added strategy to encode a type', () => {
    const bufferCodec = new BufferCodec();
    
    BufferStrategy.addStrategy(LifeStrategy);
    BufferStrategy.encode(null, 'foo', bufferCodec);

    const buffer = bufferCodec.result();

    const expectedBuffer = new ArrayBuffer(1);
    const uint8Array = new Uint8Array(expectedBuffer);
    uint8Array[0] = 42;
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should use a newly added strategy to decode a type', () => {
    const bufferCodec = new BufferCodec();
    
    BufferStrategy.addStrategy(LifeStrategy);
    const result = BufferStrategy.decode('foo', bufferCodec);

    expect(result).to.be.eq(42);
  });

});

class LifeStrategy implements StrategyBase {

  static supports(template: BufferValueTemplate): boolean {
    return typeof(template) === 'string' && template === 'foo';
  }

  static encode(value: any, template: BufferValueTemplate, codec: BufferCodec) {
    codec.uint8(42);
  }

  static decode(template: BufferValueTemplate, codec: BufferCodec): any {
    return 42;
  }
  
}