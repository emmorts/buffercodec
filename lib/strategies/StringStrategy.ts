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
    
    if (typeOptions.nullable) {
      const valueIsNull = value === undefined || value === null;

      if (valueIsNull) {
        codec.uint8(1);
      } else {
        codec.uint8(0);
        
        codec.string(value, typeOptions.encoding);
      }
    } else {
      codec.string(value, typeOptions.encoding);
    }
  }

  decode(template: BufferValueTemplate, codec: BufferCodec): string | null {
    const typeOptions = BufferStrategy.getTypeOptions(template as string);

    if (typeOptions.nullable) {
      const valueIsNull = codec.decode({ type: 'uint8' });

      if (valueIsNull) {
        return null;
      }
    }

    return codec.decode(typeOptions);
  }
  
}