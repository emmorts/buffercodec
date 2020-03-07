import { BufferCodec } from "../BufferCodec";
import { IStrategy } from "./IStrategy";
import { BufferValueTemplate, BufferEncodeJob } from '../buffer.types';
export interface IStrategyBuilder<T extends IStrategy> {
    new (): T;
    supports(template: BufferValueTemplate): boolean;
    encode(value: any, template: BufferValueTemplate): BufferEncodeJob[];
    decode(template: BufferValueTemplate, codec: BufferCodec): any;
}
