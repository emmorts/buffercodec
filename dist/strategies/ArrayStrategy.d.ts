import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from "../Buffer.types";
import { StrategyBase } from "./StrategyBase";
export default class ArrayStrategy implements StrategyBase<any[]> {
    supports(template: BufferValueTemplate): boolean;
    encode(values: any[], template: BufferValueTemplate, codec: BufferCodec): void;
    decode(template: BufferValueTemplate, codec: BufferCodec): any[];
}
