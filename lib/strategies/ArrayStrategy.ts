import { BufferCodec } from "../BufferCodec";
import { BufferStrategy } from "../BufferStrategy";
import { BufferValueTemplate } from '../buffer.types';
import { StrategyBase } from "./StrategyBase";

export default class ArrayStrategy implements StrategyBase {

  static supports(template: BufferValueTemplate): boolean {
    return template instanceof Array;
  }

  static encode(value: any, template: BufferValueTemplate, codec: BufferCodec) {
    const innerTemplate = (template as BufferValueTemplate[])[0];
    
    const values = value as any[];

    codec.uint8(values.length);

    values.forEach(val => BufferStrategy.encode(val, innerTemplate, codec));
  }

  static decode(template: BufferValueTemplate, codec: BufferCodec): any {
    const innerTemplate = (template as BufferValueTemplate[])[0];

    const arrayLength = codec.decode({ type: 'uint8' });
    const result: any[] = [];

    for (let i = 0; i < arrayLength; i++) {
      result.push(BufferStrategy.decode(innerTemplate, codec));
    }

    return result;
  }
  
}