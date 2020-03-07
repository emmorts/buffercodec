"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ArrayStrategy_1 = require("./ArrayStrategy");
const UInt8Strategy_1 = require("./UInt8Strategy");
const ObjectStrategy_1 = require("./ObjectStrategy");
const Int8Strategy_1 = require("./Int8Strategy");
const UInt16Strategy_1 = require("./UInt16Strategy");
const Int16Strategy_1 = require("./Int16Strategy");
const UInt32Strategy_1 = require("./UInt32Strategy");
const Int32Strategy_1 = require("./Int32Strategy");
const Float32Strategy_1 = require("./Float32Strategy");
const Float64Strategy_1 = require("./Float64Strategy");
const StringStrategy_1 = require("./StringStrategy");
exports.Strategies = [
    ObjectStrategy_1.default,
    ArrayStrategy_1.default,
    UInt8Strategy_1.default,
    Int8Strategy_1.default,
    UInt16Strategy_1.default,
    Int16Strategy_1.default,
    UInt32Strategy_1.default,
    Int32Strategy_1.default,
    Float32Strategy_1.default,
    Float64Strategy_1.default,
    StringStrategy_1.default
];
