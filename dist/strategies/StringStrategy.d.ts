import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from "../Buffer.types";
import { StrategyBase } from "./StrategyBase";
export default class StringStrategy implements StrategyBase<string> {
    supports(template: BufferValueTemplate): boolean;
    encode(value: string, template: BufferValueTemplate, codec: BufferCodec): void;
    decode(template: BufferValueTemplate, codec: BufferCodec): string | null;
}
