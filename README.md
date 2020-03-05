Buffer Codec
===========

BufferCodec allows you to efficiently and easily create buffers by chaining together calls
to write basic data types to buffers and other way around. It uses 
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

var object = BufferCodec(buffer).parse({
  opcode: 'uint8',
  name: { type: 'string', length: 'hello world'.length },
  posX: 'uint16le',
  posY: 'uint16le',
  pi: 'float32le'
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

Arrays are also supported, by providing the length of an array before its' items:

```javascript
var BufferCodec = require("buffercodec");

var length = 5;
var buffer = BufferCodec().uint8(length);

for (var i = 0; i < length; i++) {
  buffer.uint8(i).uint16le(i*i);
}

var result = BufferCodec(buffer).parse([{
  id: 'uint8',
  value: 'uint16le'
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

* `BufferCodec([buffer])` - constructor takes an optional buffer argument, which it may then use for parsing
* `result()` - compiles the job list into a buffer and returns it
* `parse(template[, transformFn])` - parse buffer with given template and apply transform function to the result
* `int8(data)` - signed 8 bit integer
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
* `string(data[, encoding])` - write a string with the given encoding (default is *utf16*)
