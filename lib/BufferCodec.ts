import { BufferStringEncoding, BufferTypeOptions, BufferContentType, BufferTemplate } from "./Buffer.types";
import { BufferStrategy } from "./BufferStrategy";

interface BufferJob {
  type: BufferContentType,
  value: number | string,
  length: number,
  encoding?: BufferStringEncoding,
  littleEndian?: boolean
}

export interface BufferCodecConstructorOptions {
  buffer?: ArrayBuffer,
  encoding?: BufferStringEncoding
}

export class BufferCodec {
  #buffer?: ArrayBuffer;
  #dataView?: DataView;
  #encoding: BufferStringEncoding = 'utf16';
  #offset: number = 0;
  #jobs: BufferJob[] = [];

  /**
   * Creates a new instance of BufferCodec
   * @param options Options for buffer codec
   */
  constructor(options: BufferCodecConstructorOptions = {
    encoding: 'utf16'
  }) {
    if (options.encoding) {
      this.setEncoding(options.encoding);
    }

    if (options.buffer) {
      this.#buffer = options.buffer;
      this.#dataView = new DataView(this.#buffer);
    }
  }

  /**
   * Creates a new BufferCodec instance from given buffer
   * @param {Buffer | ArrayBuffer} buffer Either ArrayBuffer or Buffer
   * @returns {BufferCodec} A new instance of BufferCodec
   */
  static from(buffer: Buffer | ArrayBuffer): BufferCodec {
    if (buffer && buffer.byteLength > 0) {
      if (buffer instanceof ArrayBuffer) {
        return new BufferCodec({ buffer });
      } else {
        const arrayBuffer = new ArrayBuffer(buffer.length);
        const view = new Uint8Array(arrayBuffer);

        for (let i = 0; i < buffer.length; ++i) {
          view[i] = buffer[i];
        }

        return new BufferCodec({ buffer: arrayBuffer });
      }
    } else {
      throw new Error("Received malformed data.");
    }
  }

  /**
   * @returns {number} Current offset of the buffer
   */
  get offset(): number {
    return this.#offset;
  }

  /**
   * @returns {ArrayBuffer} Current buffer
   */
  get buffer(): ArrayBuffer {
    if (this.#buffer) {
      return this.#buffer;
    }

    return new ArrayBuffer(0);
  }

  /**
   * Sets string encoding
   * @param encoding {BufferStringEncoding} String encoding (either 'utf8' or 'utf16')
   * @returns {BufferCodec} Current instance of BufferCodec
   */
  setEncoding(encoding: BufferStringEncoding): BufferCodec {
    if (encoding !== 'utf16' && encoding !== 'utf8') {
      throw new Error(`Unsupported encoding '${encoding}'. Only UTF-8 and UTF-16 are currently supported.`);
    }

    this.#encoding = encoding;

    return this;
  }

  /**
   * Encode all queued values and return resulting buffer
   * @returns {ArrayBuffer} Encoded buffer
   */
  result(): ArrayBuffer {
    this.#offset = 0;
  
    const bufferLength = this.#jobs.reduce((last, current) => last + current.length, 0);
    const buffer = new ArrayBuffer(bufferLength);
    const dataView = new DataView(buffer);
    
    if (this.#jobs.length > 0) {
      this.#jobs.forEach(job => {
        switch (job.type) {
          case 'string':
            this.#offset += this.encodeString(dataView, job);
            break;
          case 'float32':
            this.#offset += this.encodeValue(dataView, dataView.setFloat32, job);
            break;
          case 'float64':
            this.#offset += this.encodeValue(dataView, dataView.setFloat64, job);
            break;
          case 'int8':
            this.#offset += this.encodeValue(dataView, dataView.setInt8, job);
            break;
          case 'int16':
            this.#offset += this.encodeValue(dataView, dataView.setInt16, job);
            break;
          case 'int32':
            this.#offset += this.encodeValue(dataView, dataView.setInt32, job);
            break;
          case 'uint8':
            this.#offset += this.encodeValue(dataView, dataView.setUint8, job);
            break;
          case 'uint16':
            this.#offset += this.encodeValue(dataView, dataView.setUint16, job);
            break;
          case 'uint32':
            this.#offset += this.encodeValue(dataView, dataView.setUint32, job);
            break;
          default:
            throw new Error(`Unrecognized type '${job.type}'`)
        }
      });
    }
    
    this.#jobs = [];
    
    return dataView.buffer;
  }

  /**
   * Decode a single value from current offset
   * @param options {BufferTypeOptions} Value decoding options
   * @returns Decoded value
   */
  decode(options: BufferTypeOptions): any {
    const dataView = this.#dataView!;

    let itemValue;

    switch (options.type) {
      case 'int8':
        itemValue = dataView.getInt8(this.#offset);
        this.#offset += 1;
        break;
      case 'uint8':
        itemValue = dataView.getUint8(this.#offset);
        this.#offset += 1;
        break;
      case 'int16':
        itemValue = dataView.getInt16(this.#offset, options.littleEndian);
        this.#offset += 2;
        break;
      case 'uint16':
        itemValue = dataView.getUint16(this.#offset, options.littleEndian);
        this.#offset += 2;
        break;
      case 'int32':
        itemValue = dataView.getInt32(this.#offset, options.littleEndian);
        this.#offset += 4;
        break;
      case 'uint32':
        itemValue = dataView.getUint32(this.#offset, options.littleEndian);
        this.#offset += 4;
        break;
      case 'float32':
        itemValue = dataView.getFloat32(this.#offset, options.littleEndian);
        this.#offset += 4;
        break;
      case 'float64':
        itemValue = dataView.getFloat64(this.#offset, options.littleEndian);
        this.#offset += 8;
        break;
      case 'string':
        const [ decodedString, length ] = this.decodeString(dataView, options.encoding || this.#encoding);
        itemValue = decodedString;
        this.#offset += length;
        break;
      default:
        throw new Error(`Type '${options.type}' is not supported.`);
    }

    return itemValue;
  }

  /**
   * Decode the whole buffer using provided template
   * @param template {BufferTemplate | BufferTemplate[]} Template to use for buffer decoding
   * @returns {any} Decoded object
   */
  parse(template: BufferTemplate | BufferTemplate[]): any {
    return BufferStrategy.decode(template, this);
  }

  /**
   * Encodes a string value
   * @param value {string} String to encode
   * @param encoding {BufferStringEncoding} String encoding (either 'utf8' or 'utf16'). This parameter takes precedence over the general encoding property set on BufferCodec instance
   * @returns {BufferCodec} Current instance of BufferCodec
   */
  string(value: string, encoding: BufferStringEncoding = this.#encoding): BufferCodec {
    this.#jobs.push({
      type: 'string',
      length: (encoding === 'utf16' ? value.length * 2 : value.length) + 1,
      encoding: encoding,
      value
    });
  
    return this;
  }

  /**
   * Encode a signed 8-bit number
   * @param value 8-bit numeric value
   * @returns {BufferCodec} Current instance of BufferCodec
   */
  int8(value: number): BufferCodec {
    this.#jobs.push({
      value,
      type: 'int8',
      length: 1
    });
    
    return this;
  }

  /**
   * Encode an unsigned 8-bit number
   * @param value 8-bit numeric value
   * @returns {BufferCodec} Current instance of BufferCodec
   */
  uint8(value: number): BufferCodec {
    this.#jobs.push({
      value,
      type: 'uint8',
      length: 1
    });
    
    return this;
  }

  /**
   * Encode a signed 16-bit number
   * @param value 16-bit numeric value
   * @returns {BufferCodec} Current instance of BufferCodec
   */
  int16(value: number, littleEndian: boolean = false): BufferCodec {
    this.#jobs.push({
      value,
      type: 'int16',
      length: 2,
      littleEndian
    });

    return this;
  }

  /**
   * Encode an unsigned 16-bit number
   * @param value 16-bit numeric value
   * @returns {BufferCodec} Current instance of BufferCodec
   */
  uint16(value: number, littleEndian: boolean = false): BufferCodec {
    this.#jobs.push({
      value,
      type: 'uint16',
      length: 2,
      littleEndian
    });

    return this;
  }

  /**
   * Encode a signed 32-bit number
   * @param value 32-bit numeric value
   * @returns {BufferCodec} Current instance of BufferCodec
   */
  int32(value: number, littleEndian: boolean = false): BufferCodec {
    this.#jobs.push({
      value,
      type: 'int32',
      length: 4,
      littleEndian
    });

    return this;
  }

  /**
   * Encode an unsigned 32-bit number
   * @param value 32-bit numeric value
   * @returns {BufferCodec} Current instance of BufferCodec
   */
  uint32(value: number, littleEndian: boolean = false): BufferCodec {
    this.#jobs.push({
      value,
      type: 'uint32',
      length: 4,
      littleEndian
    });

    return this;
  }

  /**
   * Encode a 32-bit float
   * @param value 32-bit numeric value
   * @returns {BufferCodec} Current instance of BufferCodec
   */
  float32(value: number, littleEndian: boolean = false): BufferCodec {
    this.#jobs.push({
      value,
      type: 'float32',
      length: 4,
      littleEndian
    });

    return this;
  }

  /**
   * Encode a 64-bit float
   * @param value 64-bit numeric value
   * @returns {BufferCodec} Current instance of BufferCodec
   */
  float64(value: number, littleEndian: boolean = false): BufferCodec {
    this.#jobs.push({
      value,
      type: 'float64',
      length: 8,
      littleEndian
    });

    return this;
  }

  private decodeString(dataView: DataView, encoding: BufferStringEncoding): [string, number] {
    let currentOffset = this.#offset;
    let result = '';
    
    const contentLength = dataView.getUint8(currentOffset++);

    if (encoding === 'utf16') {
      const utf16 = new ArrayBuffer(contentLength * 2);
      const utf16view = new Uint16Array(utf16);

      for (let i = 0; i < contentLength; i++ , currentOffset += 2) {
        utf16view[i] = dataView.getUint8(currentOffset);
      }

      result = String.fromCharCode.apply(null, Array.from(utf16view));
    }
    
    if (encoding === 'utf8') {
      const utf8 = new ArrayBuffer(contentLength);
      const utf8view = new Uint8Array(utf8);

      for (let i = 0; i < contentLength; i++ , currentOffset += 1) {
        utf8view[i] = dataView.getUint8(currentOffset);
      }

      result = String.fromCharCode.apply(null, Array.from(utf8view));
    }

    return [result, currentOffset - this.#offset];
  }

  private encodeString(dataView: DataView, job: BufferJob): number {
    const value = job.value as string;
    const valueLength = value.length;
    
    let currentOffset = this.#offset;

    dataView.setUint8(currentOffset++, valueLength);

    switch (job.encoding) {
      case 'utf16':
        for (let i = 0; i < (job.length - 1) / 2; i++, currentOffset += 2) {
          dataView.setUint16(currentOffset, value.charCodeAt(i), true);
        }
        break;
      case 'utf8':
        for (let i = 0; i < (job.length - 1); i++, currentOffset++) {
          dataView.setUint8(currentOffset, value.charCodeAt(i));
        }
        break;
      default:
        throw new Error(`Undefined encoding provided '${this.#encoding}'`)
    }

    return currentOffset - this.#offset;
  }

  private encodeValue(dataView: DataView, fn: (...args: any[]) => void, job: BufferJob): number {
    fn.call(dataView, this.#offset, job.value as number, job.littleEndian);

    return job.length;
  }
}
