import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from "../Buffer.types";
import { StrategyBase } from "./StrategyBase";
import { BufferStrategy } from "../BufferStrategy";

export default class Int32Strategy implements StrategyBase {

  static supports(template: BufferValueTemplate): boolean {
    if (typeof(template) !== 'string') {
      return false;
    }

    const typeOptions = BufferStrategy.getTypeOptions(template);
    
    return typeOptions.type === 'int32';
  }

  static encode(value: any, template: BufferValueTemplate, codec: BufferCodec) {
    const typeOptions = BufferStrategy.getTypeOptions(template as string);

    codec.int32(value, typeOptions.littleEndian);
  }

  static decode(template: BufferValueTemplate, codec: BufferCodec): any {
    return codec.decode(BufferStrategy.getTypeOptions(template as string));
  }
  
}