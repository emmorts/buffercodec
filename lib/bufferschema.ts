import { BufferCodec, BufferTemplate, BufferStringEncoding, BufferDecodeType } from './buffercodec';

export interface BufferSchemaOptions {
  encoding?: BufferStringEncoding,
  transform?: (result: any) => any
}

export class BufferSchema {
  #template: BufferTemplate;
  #encoding: BufferStringEncoding = 'utf16';
  #transform?: (result: any) => any;

  constructor(template: BufferTemplate, options: BufferSchemaOptions = { encoding: 'utf16' }) {
    this.#template = template;

    if (options.encoding) {
      this.#encoding = options.encoding;
    }

    if (options.transform) {
      this.#transform = options.transform;
    }
  }

  encode(object: any, codec?: BufferCodec): ArrayBuffer {
    if (!codec) {
      codec = new BufferCodec({
        encoding: this.#encoding
      });
    }

    if (object && this.#template) {
      this.encodeObject(codec, object, this.#template);
    }

    return codec.result();
  }

  decode(buffer: ArrayBuffer): any {
    return BufferCodec
      .from(buffer)
      .setEncoding(this.#encoding)
      .parse(this.#template, this.#transform);
  }

  private encodeObject(workCodec: BufferCodec, object: any, template: BufferTemplate) {
    // TODO: exists? nullable?

    if (typeof(template) === 'string') {
      const valueType = template as BufferDecodeType;

      this.encodeValue(workCodec, object, valueType);

      return;
    }

    if (template instanceof Array) {
      this.encodeArray(workCodec, object, template[0]);

      return;
    }

    const valueObject = template as BufferTemplate;
    if (valueObject) {
      for (const propertyName in template) {
        const propertyTemplate = valueObject[propertyName] as BufferTemplate;

        this.encodeObject(workCodec, object[propertyName], propertyTemplate);
      }

      return;
    }
  }

  private encodeArray(workCodec: BufferCodec, values: any[], template: BufferTemplate) {
    const arrayLength = values.length;

    workCodec.uint8(arrayLength);

    values.forEach(value => {
      this.encodeObject(workCodec, value, template);
    });
  }

  private encodeValue(workCodec: BufferCodec, value: string | number, type: BufferDecodeType) {
    switch (type) {
      case 'int8':
        workCodec.int8(value as number);
        break;
      case 'uint8':
        workCodec.uint8(value as number);
        break;
      case 'int16le':
        workCodec.int16(value as number, true);
        break;
      case 'uint16le':
        workCodec.uint16(value as number, true);
        break;
      case 'int16be':
        workCodec.int16(value as number);
        break;
      case 'uint16be':
        workCodec.uint16(value as number);
        break;
      case 'int32le':
        workCodec.int32(value as number, true);
        break;
      case 'uint32le':
        workCodec.uint32(value as number, true);
        break;
      case 'int32be':
        workCodec.int32(value as number);
        break;
      case 'uint32be':
        workCodec.uint32(value as number);
        break;
      case 'float32le':
        workCodec.float32(value as number, true);
        break;
      case 'float32be':
        workCodec.float32(value as number);
        break;
      case 'float64le':
        workCodec.float64(value as number, true);
        break;
      case 'float64be':
        workCodec.float64(value as number);
        break;
      case 'string':
        workCodec.string(value as string);
        break;
    }
  }
}
