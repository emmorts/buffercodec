import ArrayStrategy from "./ArrayStrategy";
import UInt8Strategy from "./UInt8Strategy";
import ObjectStrategy from "./ObjectStrategy";
import Int8Strategy from "./Int8Strategy";
import UInt16Strategy from "./UInt16Strategy";
import Int16Strategy from "./Int16Strategy";
import UInt32Strategy from "./UInt32Strategy";
import Int32Strategy from "./Int32Strategy";
import Float32Strategy from "./Float32Strategy";
import Float64Strategy from "./Float64Strategy";
import StringStrategy from "./StringStrategy";
import { StrategyBase } from "..";

export default [
  ObjectStrategy,
  ArrayStrategy,
  UInt8Strategy,
  Int8Strategy,
  UInt16Strategy,
  Int16Strategy,
  UInt32Strategy,
  Int32Strategy,
  Float32Strategy,
  Float64Strategy,
  StringStrategy
] as { new(): StrategyBase }[];
