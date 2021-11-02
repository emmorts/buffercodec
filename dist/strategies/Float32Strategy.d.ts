import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from "../Buffer.types";
import { StrategyBase } from "./StrategyBase";
export default class Float32Strategy implements StrategyBase<number> {
    supports(template: BufferValueTemplate): boolean;
    encode(value: number, template: BufferValueTemplate, codec: BufferCodec): void;
    decode(template: BufferValueTemplate, codec: BufferCodec): number | null;
}
