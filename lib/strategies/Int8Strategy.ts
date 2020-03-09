import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from "../Buffer.types";
import { StrategyBase } from "./StrategyBase";

export default class Int8Strategy implements StrategyBase<number> {

  supports(template: BufferValueTemplate): boolean {
    return typeof(template) === 'string' && template === 'int8';
  }

  encode(value: number, template: BufferValueTemplate, codec: BufferCodec) {
    codec.int8(value);
  }

  decode(template: BufferValueTemplate, codec: BufferCodec): number {
    return codec.decode({ type: 'int8' });
  }
  
}