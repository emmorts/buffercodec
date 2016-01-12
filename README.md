Buffer Codec
===========

BufferCodec allows you to efficiently and easily create buffers by chaining together calls
to write basic data types to buffers and other way around. It uses 
[Typed Arrays](https://developer.mozilla.org/en/docs/Web/JavaScript/Typed_arrays) which
is available on both, browsers and Node environments.

Installation
------------
Install this package by running `npm install buffercodec`.

Usage
-----
Encoding to buffer is as simple as this:

```javascript
var BufferCodec = require("buffercodec");

var buffer = BufferCodec()
  .uint8(0x1)
  .string('hello world')
  .uint16le(Math.pow(2, 10))
  .uint16le(Math.pow(2, 8))
  .float32le(Math.PI)
  .result();
```

Decoding above buffer to a single object:

```javascript
var BufferCodec = require("buffercodec");

var object = BufferCodec(buffer).parse([{
  name: 'opcode',
  type: 'uint8'
}, {
  name: 'name',
  type: 'string',
  length: 'hello world'.length
}, {
  name: 'posX',
  type: 'uint16le'
}, {
  name: 'posY',
  type: 'uint16le'
}, {
  name: 'pi',
  type: 'float32le'
}]);

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

Or you may iterate through buffer like so:

```javascript
var BufferCodec = require("buffercodec");

var decoder = BufferCodec(buffer);

var opcode = decoder.parse({ type: 'uint8' });  // 0x1
var name = decoder.parse({ type: 'string', length: 'hello world'.length }); // 'hello world'
var posX = decoder.parse({ type: 'uint16le' }); // 1024
var posY = decoder.parse({ type: 'uint16le' }); // 256
var pi = decoder.parse({ type: 'float32le' });  // 3.1415927410125732
``` 

Methods
---------------

* `buffer(buffer)`
* `result()` - compiles the job list into a buffer and returns that buffer
* `string(data, encoding)` - write a string with the given encoding (default is *utf16*)
* `uint8(data)` - unsigned 8 bit integer
* `int16le(data)` - signed, little endian 16 bit integer
* `int16be(data)` - signed, big endian 16 bit integer
* `uint16le(data)` - unsigned, little endian 16 bit integer
* `uint16be(data)` - unsigned, big endian 16 bit integer
* `int32le(data)` - signed, little endian 32 bit integer
* `int32be(data)` - signed, big endian 32 bit integer
* `uint32le(data)` - unsigned, little endian 32 bit integer
* `uint32be(data)` - unsigned, big endian 32 bit integer
* `float32be(data)` - big endian 32 bit float
* `float32le(data)` - little endian 32 bit float
* `float64be(data)` - big endian 64 bit float
* `float64le(data)` - little endian 64 bit float
