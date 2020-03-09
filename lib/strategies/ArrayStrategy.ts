import { BufferCodec } from "../BufferCodec";
import { BufferStrategy } from "../BufferStrategy";
import { BufferValueTemplate } from "../Buffer.types";
import { StrategyBase } from "./StrategyBase";

export default class ArrayStrategy implements StrategyBase<any[]> {

  supports(template: BufferValueTemplate): boolean {
    return template instanceof Array;
  }

  encode(values: any[], template: BufferValueTemplate, codec: BufferCodec) {
    const innerTemplate = (template as BufferValueTemplate[])[0];

    codec.uint8(values.length);

    values.forEach(val => BufferStrategy.encode(val, innerTemplate, codec));
  }

  decode(template: BufferValueTemplate, codec: BufferCodec): any[] {
    const innerTemplate = (template as BufferValueTemplate[])[0];

    const arrayLength = codec.decode({ type: 'uint8' });
    const result: any[] = [];

    for (let i = 0; i < arrayLength; i++) {
      result.push(BufferStrategy.decode(innerTemplate, codec));
    }

    return result;
  }
  
}