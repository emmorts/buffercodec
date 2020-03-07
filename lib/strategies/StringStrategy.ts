import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from '../buffer.types';
import { StrategyBase } from "./StrategyBase";
import { BufferStrategy } from "../BufferStrategy";

export default class StringStrategy implements StrategyBase {

  static supports(template: BufferValueTemplate): boolean {
    if (typeof(template) !== 'string') {
      return false;
    }

    const typeOptions = BufferStrategy.getTypeOptions(template);
    
    return typeOptions.type === 'string';
  }

  static encode(value: any, template: BufferValueTemplate, codec: BufferCodec) {
    const typeOptions = BufferStrategy.getTypeOptions(template as string);

    codec.string(value, typeOptions.encoding);
  }

  static decode(template: BufferValueTemplate, codec: BufferCodec): any {
    return codec.decode(BufferStrategy.getTypeOptions(template as string));
  }
  
}