import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from "../Buffer.types";
import { StrategyBase } from "./StrategyBase";
import { BufferStrategy } from "../BufferStrategy";

export default class StringStrategy implements StrategyBase<string> {

  supports(template: BufferValueTemplate): boolean {
    if (typeof(template) !== 'string') {
      return false;
    }

    const typeOptions = BufferStrategy.getTypeOptions(template);
    
    return typeOptions.type === 'string';
  }

  encode(value: string, template: BufferValueTemplate, codec: BufferCodec) {
    const typeOptions = BufferStrategy.getTypeOptions(template as string);

    codec.string(value, typeOptions.encoding);
  }

  decode(template: BufferValueTemplate, codec: BufferCodec): string {
    return codec.decode(BufferStrategy.getTypeOptions(template as string));
  }
  
}