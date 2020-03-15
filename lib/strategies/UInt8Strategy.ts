import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from "../Buffer.types";
import { StrategyBase } from "./StrategyBase";
import { BufferStrategy } from '../BufferStrategy';

export default class UInt8Strategy implements StrategyBase<number> {

  supports(template: BufferValueTemplate): boolean {
    if (typeof(template) !== 'string') {
      return false;
    }

    const typeOptions = BufferStrategy.getTypeOptions(template);
    
    return typeOptions.type === 'uint8';
  }

  encode(value: number, template: BufferValueTemplate, codec: BufferCodec) {
    const typeOptions = BufferStrategy.getTypeOptions(template as string);
    
    if (typeOptions.nullable) {
      const valueIsNull = value === undefined || value === null;

      if (valueIsNull) {
        codec.uint8(1);
      } else {
        codec.uint8(0);
        
        codec.uint8(value);
      }
    } else {
      codec.uint8(value);
    }
  }

  decode(template: BufferValueTemplate, codec: BufferCodec): number | null {
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