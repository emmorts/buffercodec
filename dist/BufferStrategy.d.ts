import { BufferCodec } from "./BufferCodec";
import { IStrategyBuilder } from "./strategies/IStrategyBuilder";
import { IStrategy } from "./strategies/IStrategy";
import { BufferValueTemplate, BufferEncodeJob, BufferTypeOptions } from "./buffer.types";
export declare class BufferStrategy {
    static strategies: IStrategyBuilder<IStrategy>[];
    static getEncodeJobs(value: any, template: BufferValueTemplate): BufferEncodeJob[];
    static decode(template: BufferValueTemplate, bufferCodec: BufferCodec): any;
    static getTemplateStrategy(template: BufferValueTemplate): IStrategyBuilder<IStrategy>;
    static getTypeOptions(type: string): BufferTypeOptions & {
        [key: string]: any;
    };
    static addStrategy(strategy: IStrategyBuilder<IStrategy>): void;
}
