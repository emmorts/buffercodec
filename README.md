Buffer Codec
===========

BufferCodec is a lightweight package that allows you to efficiently and easily translate between JSON and buffers
by chaining together calls to write basic data types to buffers and other way around. It uses 
[Typed Arrays](https://developer.mozilla.org/en/docs/Web/JavaScript/Typed_arrays) which
makes this package readily available for both, browsers and Node environments.

[![Build Status](https://travis-ci.org/emmorts/buffercodec.svg?branch=master)](https://travis-ci.org/emmorts/buffercodec)

Installation
------------
You may install the package via:

 - npm `npm install buffercodec`
 - bower `bower install buffercodec`
 - git `git clone https://github.com/emmorts/buffercodec`

Usage
-----
Encoding to buffer is as simple as this:

```javascript
import { BufferCodec } from "buffercodec";

const buffer = new BufferCodec()
  .uint8(0x1)
  .string('hello world')
  .uint16(Math.pow(2, 10))
  .uint16(Math.pow(2, 8))
  .float32(Math.PI)
  .result();
```

Decoding above buffer to a single object:

```javascript
import { BufferCodec } from "buffercodec";

const object = BufferCodec
  .from(buffer)
  .parse({
    opcode: 'uint8',
    name: 'string',
    posX: 'uint16',
    posY: 'uint16',
    pi: 'float32'
  });

/*
object: {
  opcode: 0x1,
  name: 'hello world',
  posX: 1024,
  posY: 256,
  pi: 3.1415927410125732
}
*/
```

Top-level arrays are also supported, by providing the length of an array before its' items:

```javascript
import { BufferCodec } from "buffercodec";

const length = 5;
const buffer = new BufferCodec().uint8(length);

for (let i = 0; i < length; i++) {
  buffer.uint8(i).uint16(i*i);
}

const result = BufferCodec
  .from(buffer)
  .parse([{
    id: 'uint8',
    value: 'uint16'
  }]);

/*
result: [
  {id: 1, value: 1},
  {id: 2, value: 4},
  {id: 3, value: 9},
  {id: 4, value: 16},
  {id: 5, value: 25}
]
*/
```

Methods
---------------

* `BufferCodec([options = { encoding: boolean, buffer: Buffer | ArrayBuffer }])` - constructor takes an optional options argument
* `from(buffer: Buffer | ArrayBuffer)` - instantiates a new instance using provided Buffer
* `result()` - returns the resulting buffer
* `parse(template)` - parse buffer with given template
* `int8(value: number)` - signed 8 bit integer
* `uint8(value: number)` - unsigned 8 bit integer
* `int16(value: number [, littleEndian: boolean = false])` - signed 16 bit integer (big endian by default)
* `uint16(value: number [, littleEndian: boolean = false])` - unsigned 16 bit integer (big endian by default)
* `int32le(value: number [, littleEndian: boolean = false])` - signed 32 bit integer (big endian by default)
* `uint32le(value: number [, littleEndian: boolean = false])` - unsigned 32 bit integer (big endian by default)
* `float32be(value: number [, littleEndian: boolean = false])` - 32-bit float (big endian by default)
* `float64be(value: number [, littleEndian: boolean = false])` - 64-bit float (big endian by default)
* `string(value: string [, encoding: 'utf8' | 'utf16'])` - write a string with the given encoding (default is *utf16*)
