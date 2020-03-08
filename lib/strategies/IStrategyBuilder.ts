import { BufferCodec } from "../BufferCodec";
import { IStrategy } from "./IStrategy";
import { BufferValueTemplate } from "../Buffer.types";

/** @internal */
export interface IStrategyBuilder<T extends IStrategy> {
  new(): T;
  
  supports(template: BufferValueTemplate): boolean;
  encode(value: any, template: BufferValueTemplate, bufferCodec: BufferCodec): void;
  decode(template: BufferValueTemplate, codec: BufferCodec): any;
}