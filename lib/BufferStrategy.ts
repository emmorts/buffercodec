import { BufferCodec } from "./BufferCodec";
import { BufferValueTemplate, BufferTypeOptions } from "./Buffer.types";
import Strategies from "./strategies";
import { StrategyBase } from "./strategies/StrategyBase";

export class BufferStrategy {
  /** @internal */
  static strategies: StrategyBase[] = [...Strategies.map(StrategyRef => new StrategyRef())];

  /**
   * Encode value using template to provided buffer
   * @param value Value to encode
   * @param template Value encoding template
   * @param bufferCodec BufferCodec containing target buffer
   */
  static encode(value: any, template: BufferValueTemplate, bufferCodec: BufferCodec) {
    const strategy = this.getTemplateStrategy(template);
    
    return strategy.encode(value, template, bufferCodec);
  }

  /**
   * Decode value from the buffer using template
   * @param template Value decoding template
   * @param bufferCodec BufferCodec containing target buffer
   * @returns Decoded value
   */
  static decode(template: BufferValueTemplate, bufferCodec: BufferCodec): any {
    const strategy = this.getTemplateStrategy(template);

    return strategy.decode(template, bufferCodec);
  }

  /**
   * Retrieves a strategy for encoding and decoding the value
   * @param template Value template
   * @returns Template codec strategy
   * @throws {Error} When strategy for provided template is not found
   */
  static getTemplateStrategy(template: BufferValueTemplate): StrategyBase {
    const strategy = this.strategies.find(s => s.supports(template));
    if (!strategy) {
      throw new Error(`Strategy for provided template '${template}' was not found`);
    }

    return strategy;
  }

  /**
   * Gets options from provided value type
   * @param type Value type
   * @returns Type options
   * @throws {Error} When type is not provided
   */
  static getTypeOptions(type: string): BufferTypeOptions & { [key: string]: any } {
    if (!type) {
      throw new Error('Type was not provided');
    }
    
    const fragments = type.split('|');

    const objectType = fragments.shift()!;
    const isNullable = objectType.charAt(objectType.length - 1) === '?';

    const options: BufferTypeOptions & { [key: string]: any } = {
      type: objectType.replace('?', ''),
      nullable: isNullable
    }

    fragments.forEach((fragment: string) => {
      if (fragment === 'utf8') {
        options.encoding = 'utf8';
      } else if (fragment === 'utf16') {
        options.encoding = 'utf16';
      }

      options[fragment] = true;
    });
    
    return options;
  }

  /**
   * Adds new strategies to codec
   * @param strategies Strategies to add
   */
  static add(...strategies: { new(): StrategyBase }[]) {
    this.strategies.push(...strategies.map(StrategyRef => new StrategyRef()));
  }
}