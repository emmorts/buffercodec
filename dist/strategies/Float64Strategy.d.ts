import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate, BufferEncodeJob } from '../buffer.types';
import { StrategyBase } from "./StrategyBase";
export default class Float64Strategy implements StrategyBase {
    static supports(template: BufferValueTemplate): boolean;
    static encode(value: any, template: BufferValueTemplate): BufferEncodeJob[];
    static decode(template: BufferValueTemplate, codec: BufferCodec): any;
}
