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

    codec.float32(value, typeOptions.littleEndian);
  }

  decode(template: BufferValueTemplate, codec: BufferCodec): number {
    return codec.decode(BufferStrategy.getTypeOptions(template as string));
  }
  
}