import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from "../Buffer.types";
import { StrategyBase } from "./StrategyBase";
import { BufferStrategy } from "../BufferStrategy";

export default class Float32Strategy implements StrategyBase<number> {

  supports(template: BufferValueTemplate): boolean {
    if (typeof(template) !== 'string') {
      return false;
    }

    const typeOptions = BufferStrategy.getTypeOptions(template);
    
    return typeOptions.type === 'float32';
  }

  encode(value: number, template: BufferValueTemplate, codec: BufferCodec) {
    const typeOptions = BufferStrategy.getTypeOptions(template as string);
    
    if (typeOptions.nullable) {
      const valueIsNull = value === undefined || value === null;

      if (valueIsNull) {
        codec.uint8(1);
      } else {
        codec.uint8(0);

        codec.float32(value, typeOptions.littleEndian);
      }
    } else {
      codec.float32(value, typeOptions.littleEndian);
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