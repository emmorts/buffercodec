export type BufferStringEncoding = 'utf8' | 'utf16';
export type BufferDecodeType = 'int8' | 'uint8' | 'int16le' | 'uint16le' | 'int16be' | 'uint16be' | 'int32le' | 'uint32le' | 'int32be' | 'uint32be' | 'float32le' | 'float32be' | 'float64le' | 'float64be' | 'string';

type BufferContentType = 'float32' | 'float64' | 'int8' | 'int16' | 'int32' | 'uint8' | 'uint16' | 'uint32' | 'string';

interface BufferJob {
  type: BufferContentType,
  value: number | string,
  length: number,
  littleEndian?: boolean
}

export interface BufferValueProperties {
  type: BufferDecodeType,
  encoding?: BufferStringEncoding,
}

export interface BufferTemplate {
  [key: string]: BufferTemplate | BufferTemplate[] | BufferDecodeType | BufferDecodeType[]
}

export interface BufferCodecConstructorOptions {
  buffer?: ArrayBuffer,
  encoding?: BufferStringEncoding
}

export class BufferCodec {
  #buffer?: ArrayBuffer;
  #encoding: BufferStringEncoding = 'utf16';
  #offset: number = 0;
  #jobs: BufferJob[] = [];

  constructor(options: BufferCodecConstructorOptions = {
    encoding: 'utf16'
  }) {
    if (options.encoding) {
      this.setEncoding(options.encoding);
    }

    if (options.buffer) {
      this.#buffer = options.buffer;
    }
  }

  get offset() {
    return this.#offset;
  }

  set offset(value: number) {
    this.#offset = value;
  }

  setEncoding(encoding: BufferStringEncoding) {
    if (encoding !== 'utf16' && encoding !== 'utf8') {
      throw new Error(`Unsupported encoding '${encoding}'. Only UTF-8 and UTF-16 are currently supported.`);
    }

    this.#encoding = encoding;

    return this;
  }

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

  getBuffer(trimOffset: boolean = false): ArrayBuffer {
    if (this.#buffer) {
      if (trimOffset) {
        return this.#buffer.slice(this.#offset);
      }
  
      return this.#buffer;
    }

    return new ArrayBuffer(0);
  }

  result() {
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

  parse(template: BufferTemplate | BufferTemplate[], transform?: (result: any) => any | any[]): any | any[] {
    if (this.#buffer && template) {
      const dataView = new DataView(this.#buffer);

      let result: any = {};

      if (typeof(template) === 'string') {
        result = this.parseValue(dataView, template);
      } else if (template instanceof Array) {
        const arrayTemplate = template as BufferTemplate[];

        result = this.parseArray(dataView, arrayTemplate[0]);
      } else {
        const objectTemplate = template as BufferTemplate;

        result = this.parseObject(dataView, objectTemplate);
      }
            
      if (transform) {
        return transform(result);
      } else {
        return result;
      }
    }
  }

  string(value: string): BufferCodec {
    this.#jobs.push({
      type: 'string',
      length: (this.#encoding === 'utf16' ? value.length * 2 : value.length) + 1,
      value
    });
  
    return this;
  }

  int8(value: number): BufferCodec {
    this.#jobs.push({
      value,
      type: 'int8',
      length: 1
    });
    
    return this;
  }

  uint8(value: number): BufferCodec {
    this.#jobs.push({
      value,
      type: 'uint8',
      length: 1
    });
    
    return this;
  }

  int16(value: number, littleEndian: boolean = false): BufferCodec {
    this.#jobs.push({
      value,
      type: 'int16',
      length: 2,
      littleEndian
    });

    return this;
  }

  uint16(value: number, littleEndian: boolean = false): BufferCodec {
    this.#jobs.push({
      value,
      type: 'uint16',
      length: 2,
      littleEndian
    });

    return this;
  }

  int32(value: number, littleEndian: boolean = false): BufferCodec {
    this.#jobs.push({
      value,
      type: 'int32',
      length: 4,
      littleEndian
    });

    return this;
  }

  uint32(value: number, littleEndian: boolean = false): BufferCodec {
    this.#jobs.push({
      value,
      type: 'uint32',
      length: 4,
      littleEndian
    });

    return this;
  }

  float32(value: number, littleEndian: boolean = false): BufferCodec {
    this.#jobs.push({
      value,
      type: 'float32',
      length: 4,
      littleEndian
    });

    return this;
  }

  float64(value: number, littleEndian: boolean = false): BufferCodec {
    this.#jobs.push({
      value,
      type: 'float64',
      length: 8,
      littleEndian
    });

    return this;
  }

  private parseObject(dataView: DataView, template: BufferTemplate): any {
    const result: any = {};

    for (const propertyName in template) {
      if (typeof(template[propertyName]) === 'string') {
        const valueType = template[propertyName] as BufferDecodeType;
        
        result[propertyName] = this.parseValue(dataView, valueType);

        continue;
      }

      if (template[propertyName] instanceof Array) {
        const valueArray = template[propertyName] as BufferTemplate[];

        result[propertyName] = this.parseArray(dataView, valueArray[0]);

        continue;
      }

      const valueObject = template[propertyName] as BufferTemplate;
      if (valueObject) {
        result[propertyName] = this.parseObject(dataView, valueObject);

        continue;
      }
    }

    return result;
  }

  private parseArray(dataView: DataView, template: BufferTemplate) {
    const result = [];

    const length = dataView.getUint8(this.#offset++);
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        result.push(this.parse(template));
      }
    }

    return result;
  }

  private parseValue(dataView: DataView, type: BufferDecodeType): string | number | any[] {
    let itemValue;

    switch (type) {
      case 'int8':
        itemValue = dataView.getInt8(this.#offset);
        this.#offset += 1;
        break;
      case 'uint8':
        itemValue = dataView.getUint8(this.#offset);
        this.#offset += 1;
        break;
      case 'int16le':
        itemValue = dataView.getInt16(this.#offset, true);
        this.#offset += 2;
        break;
      case 'uint16le':
        itemValue = dataView.getUint16(this.#offset, true);
        this.#offset += 2;
        break;
      case 'int16be':
        itemValue = dataView.getInt16(this.#offset, false);
        this.#offset += 2;
        break;
      case 'uint16be':
        itemValue = dataView.getUint16(this.#offset, false);
        this.#offset += 2;
        break;
      case 'int32le':
        itemValue = dataView.getInt32(this.#offset, true);
        this.#offset += 4;
        break;
      case 'uint32le':
        itemValue = dataView.getUint32(this.#offset, true);
        this.#offset += 4;
        break;
      case 'int32be':
        itemValue = dataView.getInt32(this.#offset, false);
        this.#offset += 4;
        break;
      case 'uint32be':
        itemValue = dataView.getUint32(this.#offset, false);
        this.#offset += 4;
        break;
      case 'float32le':
        itemValue = dataView.getFloat32(this.#offset, true);
        this.#offset += 4;
        break;
      case 'float32be':
        itemValue = dataView.getFloat32(this.#offset, false);
        this.#offset += 4;
        break;
      case 'float64le':
        itemValue = dataView.getFloat64(this.#offset, true);
        this.#offset += 8;
        break;
      case 'float64be':
        itemValue = dataView.getFloat64(this.#offset, false);
        this.#offset += 8;
        break;
      case 'string':
        const [ decodedString, length ] = this.decodeString(dataView);
        itemValue = decodedString;
        this.#offset += length;
        break;
      default:
        throw new Error(`Type '${type}' is not supported.`);
    }

    return itemValue;
  }

  private decodeString(dataView: DataView): [string, number] {
    let currentOffset = this.#offset;
    let result = '';
    
    const contentLength = dataView.getUint8(currentOffset++);

    if (this.#encoding === 'utf16') {
      const utf16 = new ArrayBuffer(contentLength * 2);
      const utf16view = new Uint16Array(utf16);

      for (let i = 0; i < contentLength; i++ , currentOffset += 2) {
        utf16view[i] = dataView.getUint8(currentOffset);
      }

      result = String.fromCharCode.apply(null, Array.from(utf16view));
    }
    
    if (this.#encoding === 'utf8') {
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

    switch (this.#encoding) {
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
