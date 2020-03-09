import { expect } from 'chai';
import { BufferCodec, BufferStrategy, StrategyBase, BufferValueTemplate } from '../lib';
import { areBuffersEqual } from './utils';

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
    
    BufferStrategy.encode({ x: 1, y: 2 }, 'point', bufferCodec);

    const buffer = bufferCodec.result();

    const expectedBuffer = new ArrayBuffer(4);
    const epxectedBufferDataView = new DataView(expectedBuffer);
    epxectedBufferDataView.setInt16(0, 1);
    epxectedBufferDataView.setInt16(2, 2);
    
    const areEqual = areBuffersEqual(buffer, expectedBuffer);

    expect(areEqual).to.be.true;
  });

  it('should use a newly added strategy to decode a type', () => {
    const expectedBuffer = new ArrayBuffer(4);
    const epxectedBufferDataView = new DataView(expectedBuffer);
    epxectedBufferDataView.setInt16(0, 1);
    epxectedBufferDataView.setInt16(2, 2);

    const bufferCodec = BufferCodec.from(expectedBuffer);
    
    const result = BufferStrategy.decode('point', bufferCodec);

    expect(result).to.be.deep.eq({
      x: 1,
      y: 2
    });
  });

});

interface Point {
  x: number,
  y: number
}

class PointStrategy implements StrategyBase<Point> {

  supports(template: BufferValueTemplate): boolean {
    return typeof(template) === 'string' && template === 'point';
  }

  encode(point: Point, template: BufferValueTemplate, codec: BufferCodec) {
    codec.int16(point.x);
    codec.int16(point.y);
  }

  decode(template: BufferValueTemplate, codec: BufferCodec): Point {
    return {
      x: codec.decode({ type: 'int16' }),
      y: codec.decode({ type: 'int16' })
    }
  }
  
}

BufferStrategy.add(PointStrategy);