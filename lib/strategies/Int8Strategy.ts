import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from "../Buffer.types";
import { StrategyBase } from "./StrategyBase";

export default class Int8Strategy implements StrategyBase {

  static supports(template: BufferValueTemplate): boolean {
    return typeof(template) === 'string' && template === 'int8';
  }

  static encode(value: any, template: BufferValueTemplate, codec: BufferCodec) {
    codec.int8(value);
  }

  static decode(template: BufferValueTemplate, codec: BufferCodec): any {
    return codec.decode({ type: 'int8' });
  }
  
}