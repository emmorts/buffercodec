import { BufferCodec } from './BufferCodec';
import { BufferTemplate } from './buffer.types';
import { BufferStrategy } from './BufferStrategy';

export class BufferSchema {
  #template: BufferTemplate;

  constructor(template: BufferTemplate) {
    this.#template = template;
  }

  /**
   * Encodes object
   * @param value {any} Object to encode
   * @returns {ArrayBuffer} Buffer containing encoded buffer
   */
  encode(value: any): ArrayBuffer {
    const bufferCodec = new BufferCodec();

    BufferStrategy.encode(value, this.#template, bufferCodec);

    return bufferCodec.result();
  }

  /**
   * Decodes object
   * @param {ArrayBuffer} buffer Buffer containing encoded object
   * @returns {any} Decoded object
   */
  decode(buffer: ArrayBuffer): any {
    const workCodec = BufferCodec.from(buffer);

    return BufferStrategy.decode(this.#template, workCodec);
  }
}
