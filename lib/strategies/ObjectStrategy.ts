import { BufferTemplate, BufferValueTemplate } from "../Buffer.types";
import { BufferStrategy } from "../BufferStrategy";
import { BufferCodec } from "../BufferCodec";
import { StrategyBase } from './StrategyBase';

export default class ObjectStrategy implements StrategyBase {

  supports(template: BufferValueTemplate): boolean {
    return Object.prototype.toString.call(template) === '[object Object]' && (template as BufferTemplate) != null;
  }

  encode(value: any, template: BufferValueTemplate, codec: BufferCodec) {
    const objectTemplate = template as BufferTemplate;

    for (const propertyName in objectTemplate) {
      BufferStrategy.encode(value[propertyName], objectTemplate[propertyName], codec);
    }
  }

  decode(template: BufferValueTemplate, codec: BufferCodec): any {
    const objectTemplate = template as BufferTemplate;
    const result: any = {};

    for (const propertyName in objectTemplate) {
      const decodedValue = BufferStrategy.decode(objectTemplate[propertyName], codec);

      result[propertyName] = decodedValue;
    }

    return result;
  }
  
}