import { BufferCodec } from "../BufferCodec";
import { IStrategy } from "./IStrategy";
import { BufferValueTemplate } from "../buffer.types";

export abstract class StrategyBase implements IStrategy {
  static supports(template: BufferValueTemplate): boolean {
    throw new Error(`supports() method not implemented on ${this.constructor.name}`);
  }
  
  static encode(value: any, template: BufferValueTemplate, codec: BufferCodec) {
    throw new Error(`encode() method not implemented on ${this.constructor.name}`);
  }

  static decode(template: BufferValueTemplate, codec: BufferCodec): any {
    throw new Error(`decode() method not implemented on ${this.constructor.name}`);
  }
}