import { BufferValueTemplate, BufferEncodeJob } from '../buffer.types';
import { BufferCodec } from "../BufferCodec";
import { StrategyBase } from './StrategyBase';
export default class ObjectStrategy implements StrategyBase {
    static supports(template: BufferValueTemplate): boolean;
    static encode(value: any, template: BufferValueTemplate): BufferEncodeJob[];
    static decode(template: BufferValueTemplate, codec: BufferCodec): any;
}
