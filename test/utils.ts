var bufferEqual = require('buffer-equal');

export function areBuffersEqual(bufferA: ArrayBuffer, bufferB: ArrayBuffer) {
  return bufferEqual(toBuffer(bufferA), toBuffer(bufferB));
}

export function toBuffer(arrayBuffer: ArrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);

  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }

  return buffer;
}