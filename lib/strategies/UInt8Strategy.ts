import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from '../buffer.types';
import { StrategyBase } from "./StrategyBase";

export default class UInt8Strategy implements StrategyBase {

  static supports(template: BufferValueTemplate): boolean {
    return typeof(template) === 'string' && template === 'uint8';
  }

  static encode(value: any, template: BufferValueTemplate, codec: BufferCodec) {
    codec.uint8(value);
  }

  static decode(template: BufferValueTemplate, codec: BufferCodec): any {
    return codec.decode({ type: 'uint8' });
  }
  
}