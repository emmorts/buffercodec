function BufferCodec(buffer) {
  if (!(this instanceof BufferCodec)) {
    return new BufferCodec(buffer);
  }

  this.offset = 0;
  this.jobs = [];

  if (buffer) {
    if (buffer.byteLength > 0) {
      if (buffer instanceof ArrayBuffer) {
        this.buffer = buffer;
      } else {
        var arrayBuffer = new ArrayBuffer(buffer.length);
        var view = new Uint8Array(arrayBuffer);
        for (var i = 0; i < buffer.length; ++i) {
          view[i] = buffer[i];
        }
        this.buffer = arrayBuffer;
      }
    }
    if (!this.buffer) {
      console.warn("Received malformed data");
    }
  }
}

BufferCodec.prototype.result = function () {
  this.offset = 0;
  
  var bufferLength = this.jobs.reduce(function(last, current) {
    return last + current.length;
  }, 0);
  var buffer = new ArrayBuffer(bufferLength);
  var dataView = new DataView(buffer);
  
  if (this.jobs.length > 0) {
    this.jobs.forEach(function (job) {
      if (job.method !== 'string') {
        dataView[job.method](this.offset, job.data, job.littleEndian);
        this.offset += job.length;
      } else {
        if (job.encoding === 'utf16') {
          for (var i = 0; i < job.length / 2; i++, this.offset += 2) {
            dataView.setUint16(this.offset, job.data.charCodeAt(i), true);
          }
        } else if (job.encoding === 'utf8') {
          for (var i = 0; i < job.length; i++, this.offset++) {
            dataView.setUint8(this.offset, job.data.charCodeAt(i));
          }
        } else {
          console.warn('Undefined encoding: ' + job.encoding);
        }
      }
    }, this);
  }
  
  this.jobs = [];
  
  return dataView.buffer;
}

BufferCodec.prototype.string = function (value, encoding) {
  this.jobs.push({
    method: 'string',
    data: value,
    length: (!encoding || encoding === 'utf16') ? value.length * 2 : value.length,
    encoding: encoding ? encoding : 'utf16'
  });

  return this;
}

BufferCodec.prototype.int8 = function (value) {
  this.jobs.push({
    data: value,
    method: 'setInt8',
    length: 1
  });
  
  return this;
}

BufferCodec.prototype.uint8 = function (value) {
  this.jobs.push({
    data: value,
    method: 'setUint8',
    length: 1
  });
  
  return this;
}

BufferCodec.prototype.int16le = function (value) {
  this.jobs.push({
    data: value,
    method: 'setInt16',
    length: 2,
    littleEndian: true
  });
  
  return this;
}

BufferCodec.prototype.int16be = function (value) {
  this.jobs.push({
    data: value,
    method: 'setInt16',
    length: 2,
    littleEndian: false
  });
  
  return this;
}

BufferCodec.prototype.uint16le = function (value) {
  this.jobs.push({
    data: value,
    method: 'setUint16',
    length: 2,
    littleEndian: true
  });
  
  return this;
}

BufferCodec.prototype.uint16be = function (value) {
  this.jobs.push({
    data: value,
    method: 'setUint16',
    length: 2,
    littleEndian: false
  });
  
  return this;
}

BufferCodec.prototype.int32le = function (value) {
  this.jobs.push({
    data: value,
    method: 'setInt32',
    length: 4,
    littleEndian: true
  });
  
  return this;
}

BufferCodec.prototype.int32be = function (value) {
  this.jobs.push({
    data: value,
    method: 'setInt32',
    length: 4,
    littleEndian: false
  });
  
  return this;
}

BufferCodec.prototype.uint32le = function (value) {
  this.jobs.push({
    data: value,
    method: 'setUint32',
    length: 4,
    littleEndian: true
  });
  
  return this;
}

BufferCodec.prototype.uint32be = function (value) {
  this.jobs.push({
    data: value,
    method: 'setUint32',
    length: 4,
    littleEndian: false
  });
  
  return this;
}

BufferCodec.prototype.float32le = function (value) {
  this.jobs.push({
    data: value,
    method: 'setFloat32',
    length: 4,
    littleEndian: true
  });
  
  return this;
}

BufferCodec.prototype.float32be = function (value) {
  this.jobs.push({
    data: value,
    method: 'setFloat32',
    length: 4,
    littleEndian: false
  });
  
  return this;
}

BufferCodec.prototype.float64le = function (value) {
  this.jobs.push({
    data: value,
    method: 'setFloat64',
    length: 8,
    littleEndian: true
  });
  
  return this;
}

BufferCodec.prototype.float64be = function (value) {
  this.jobs.push({
    data: value,
    method: 'setFloat64',
    length: 8,
    littleEndian: false
  });
  
  return this;
}

BufferCodec.prototype.parse = function (template, transform) {
  if (this.buffer && template) {
    var data = new DataView(this.buffer);
    var result = {}, element = {};
    
    if (template.constructor === Object) {
      for (var propertyName in template) {
        element = {
          name: propertyName
        };
        
        if (template[propertyName].constructor === Array) {
          element.type = 'array'
          element.itemTemplate = template[propertyName][0];
        } else if (template[propertyName].constructor === String) {
          element.type = template[propertyName];
        } else if (template[propertyName].constructor === Object) {
          for (var innerPropertyName in template[propertyName]) {
            element[innerPropertyName] = template[propertyName][innerPropertyName];
          }
        }
        
        parseItem.call(this, element, result);
      }
    } else if (template.constructor === Array) {
      element = {
        type: 'array',
        itemTemplate: template[0]
      };
      
      parseItem.call(this, element, result);
    }
    
    if (transform) {
      return transform(result);
    } else {
      return result;
    }
  }

  function parseArray(data, template) {
    var result = [];

    var length = data.getUint8(this.offset++);
    if (length > 0) {
      for (var i = 0; i < length; i++) {
        result.push(this.parse(template));
      }
    }

    return result;
  }

  function parseItem(element) {
    var templateResult;
    switch (element.type) {
      case 'int8':
        templateResult = data.getInt8(this.offset);
        this.offset += 1;
        break;
      case 'uint8':
        templateResult = data.getUint8(this.offset);
        this.offset += 1;
        break;
      case 'int16le':
        templateResult = data.getInt16(this.offset, true);
        this.offset += 2;
        break;
      case 'uint16le':
        templateResult = data.getUint16(this.offset, true);
        this.offset += 2;
        break;
      case 'int16be':
        templateResult = data.getInt16(this.offset, false);
        this.offset += 2;
        break;
      case 'uint16be':
        templateResult = data.getUint16(this.offset, false);
        this.offset += 2;
        break;
      case 'int32le':
        templateResult = data.getInt32(this.offset, true);
        this.offset += 4;
        break;
      case 'uint32le':
        templateResult = data.getUint32(this.offset, true);
        this.offset += 4;
        break;
      case 'int32be':
        templateResult = data.getInt32(this.offset, false);
        this.offset += 4;
        break;
      case 'uint32be':
        templateResult = data.getUint32(this.offset, false);
        this.offset += 4;
        break;
      case 'float32le':
        templateResult = data.getFloat32(this.offset, true);
        this.offset += 4;
        break;
      case 'float32be':
        templateResult = data.getFloat32(this.offset, false);
        this.offset += 4;
        break;
      case 'float64le':
        templateResult = data.getFloat64(this.offset, true);
        this.offset += 8;
        break;
      case 'float64be':
        templateResult = data.getFloat64(this.offset, false);
        this.offset += 8;
        break;
      case 'string':
        if (typeof element.length === 'undefined') {
          element.length = data.getUint8(this.offset++);
        } else if (!element.length) {
          templateResult = '';
          break;
        }
        if (!element.encoding || element.encoding === 'utf16') {
          var utf16 = new ArrayBuffer(element.length * 2);
          var utf16view = new Uint16Array(utf16);
          for (var i = 0; i < element.length; i++ , this.offset += 2) {
            utf16view[i] = data.getUint8(this.offset);
          }
          templateResult = String.fromCharCode.apply(null, utf16view);
        } else if (element.encoding === 'utf8') {
          var utf8 = new ArrayBuffer(element.length);
          var utf8view = new Uint8Array(utf8);
          for (var i = 0; i < element.length; i++ , this.offset += 2) {
            utf8view[i] = data.getUint8(this.offset);
          }
          templateResult = String.fromCharCode.apply(null, utf8view);
        }
        break;
      case 'array':
        templateResult = parseArray.call(this, data, element.itemTemplate);
        break;
    }

    if (element.name) {
      result[element.name] = templateResult;
    } else {
      result = templateResult;
    }
  }
}

module.exports = BufferCodec;