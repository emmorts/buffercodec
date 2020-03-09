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

Documentation is available [here](http://emmorts.github.io/buffercodec/)

# Quick start

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

for (let i = 1; i < length + 1; i++) {
  buffer
    .uint8(i)
    .uint16(i * i);
}

const result = BufferCodec
  .from(buffer.result())
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

# Types

BufferCodec supports the following types out of the box:
  * `int8`
  * `uint8`
  * `int16` (littleEndian)
  * `uint16` (littleEndian)
  * `int32` (littleEndian)
  * `uint32` (littleEndian)
  * `float32` (littleEndian)
  * `float64` (littleEndian)
  * `string` (utf8/utf16)

The properties in parentheses can be used in a template like so:

```typescript
const result = BufferCodec
  .from(buffer)
  .parse({
    id: 'int16|littleEndian',
    value: 'float32',
    label: 'string|utf8'
  });
```

Types can be wrapped in an array to indicate that an array is expected for the property:

```typescript
const result = BufferCodec
  .from(buffer)
  .parse({
    x: ['int16'],
    y: ['int16']
  });
```
> Note: when encoding arrays using BufferCodec, you need to supply length encoded in a uint8 value before encoding the objects. It is therefore recommended to use BufferSchema, which does this for you.

Nested objects can also be used:

```typescript
const result = BufferCodec
  .from(buffer)
  .parse({
    foo: {
      bar: {
        baz: ['uint8']
      }
    },
  });
```

# Re-usable templates
Package includes class BufferSchema which allows you to define a schema per type and re-use it.

```typescript
const pointSchema = new BufferSchema({
  x: 'float32',
  y: 'float32'
});

const buffer = pointSchema.encode({
  x: Math.PI,
  y: Math.PI
});

const point = pointSchema.decode(buffer);
```

## Custom types
You can also add your custom strategy for encoding and decoding objects.

First, create a new strategy class implementing StrategyBase:

```typescript
interface Point {
  x: number,
  y: number
}

class PointStrategy implements StrategyBase<Point> {

  supports(template: BufferValueTemplate): boolean {
    return typeof(template) === 'string' && template === 'point';
  }

  encode(point: Point, template: BufferValueTemplate, codec: BufferCodec) {
    codec.float32(point.x);
    codec.float32(point.y);
  }

  decode(template: BufferValueTemplate, codec: BufferCodec): Point {
    return {
      x: codec.decode({ type: 'float32' }),
      y: codec.decode({ type: 'float32' })
    }
  }
  
}
```

Add the strategy:
```typescript
BufferStrategy.add(PointStrategy);
```

Now whenever codec encounters type `'point'`, it will use your provided strategy.
```typescript
const playerSchema = new BufferSchema({
  id: 'uint32',
  name: 'string',
  position: 'point'
});

playerSchema.encode({
  id: 42,
  name: 'AzureDiamond',
  position: {
    x: Math.PI,
    y: Math.PI
  }
});
```
