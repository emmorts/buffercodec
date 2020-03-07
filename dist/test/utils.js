"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bufferEqual = require('buffer-equal');
function areBuffersEqual(bufferA, bufferB) {
    return bufferEqual(toBuffer(bufferA), toBuffer(bufferB));
}
exports.areBuffersEqual = areBuffersEqual;
function toBuffer(arrayBuffer) {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}
exports.toBuffer = toBuffer;
