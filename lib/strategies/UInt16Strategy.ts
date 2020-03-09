import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from "../Buffer.types";
import { StrategyBase } from "./StrategyBase";
import { BufferStrategy } from "../BufferStrategy";

export default class UInt16Strategy implements StrategyBase<number> {

  supports(template: BufferValueTemplate): boolean {
    if (typeof(template) !== 'string') {
      return false;
    }

    const typeOptions = BufferStrategy.getTypeOptions(template);
    
    return typeOptions.type === 'uint16';
  }

  encode(value: number, template: BufferValueTemplate, codec: BufferCodec) {
    const typeOptions = BufferStrategy.getTypeOptions(template as string);

    codec.uint16(value, typeOptions.littleEndian);
  }

  decode(template: BufferValueTemplate, codec: BufferCodec): number {
    return codec.decode(BufferStrategy.getTypeOptions(template as string));
  }
  
}