"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BufferStrategy_1 = require("../BufferStrategy");
class ObjectStrategy {
    static supports(template) {
        return Object.prototype.toString.call(template) === '[object Object]' && template != null;
    }
    static encode(value, template) {
        const objectTemplate = template;
        const jobs = [];
        for (const propertyName in objectTemplate) {
            jobs.push(...BufferStrategy_1.BufferStrategy.getEncodeJobs(value[propertyName], objectTemplate[propertyName]));
        }
        return jobs;
    }
    static decode(template, codec) {
        const objectTemplate = template;
        const result = {};
        for (const propertyName in objectTemplate) {
            const decodedValue = BufferStrategy_1.BufferStrategy.decode(objectTemplate[propertyName], codec);
            result[propertyName] = decodedValue;
        }
        return result;
    }
}
exports.default = ObjectStrategy;
