var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __require = typeof require !== "undefined" ? require : (x) => {
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/netlify/entry.js
__export(exports, {
  handler: () => handler
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var dataUriToBuffer$1 = src;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var Blob$1 = fetchBlob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new Blob$1([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values2] of Object.entries(raw)) {
        result.push(...values2.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values2 = this.getAll(name);
    if (values2.length === 0) {
      return null;
    }
    let value = values2.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values2 = this.getAll(key);
      if (key === "host") {
        result[key] = values2[0];
      } else {
        result[key] = values2.length > 1 ? values2 : values2[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}

// .svelte-kit/output/server/app.js
var __require2 = typeof require !== "undefined" ? require : (x) => {
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _map;
function get_single_valued_header(headers, key) {
  const value = headers[key];
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return void 0;
    }
    if (value.length > 1) {
      throw new Error(`Multiple headers provided for ${key}. Multiple may be provided only for set-cookie`);
    }
    return value[0];
  }
  return value;
}
function coalesce_to_error(err) {
  return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error$1(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
function is_content_type_textual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}
async function render_endpoint(request, route, match) {
  const mod = await route.load();
  const handler2 = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler2) {
    return;
  }
  const params = route.params(match);
  const response = await handler2({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error$1(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = get_single_valued_header(headers, "content-type");
  const is_type_textual = is_content_type_textual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error$1(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop$1() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function writable(value, start = noop$1) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop$1) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop$1;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  branch,
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (page_config.ssr) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2 && page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2 && page2.path)},
						query: new URLSearchParams(${page2 ? s$1(page2.query.toString()) : ""}),
						params: ${page2 && s$1(page2.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n	")}
		`;
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(coalesce_to_error(err));
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ ...error2, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  context,
  prerender_enabled,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let set_cookie_headers = [];
  let loaded;
  const page_proxy = new Proxy(page2, {
    get: (target, prop, receiver) => {
      if (prop === "query" && prerender_enabled) {
        throw new Error("Cannot access query on a page with prerendering enabled");
      }
      return Reflect.get(target, prop, receiver);
    }
  });
  if (module2.load) {
    const load_input = {
      page: page_proxy,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? { "content-type": asset.type } : {}
          }) : await fetch(`http://${page2.host}/${asset.file}`, opts);
        } else if (resolved.startsWith("/") && !resolved.startsWith("//")) {
          const relative = resolved;
          const headers = {
            ...opts.headers
          };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body == null ? null : new TextEncoder().encode(opts.body),
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.externalFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 === "set-cookie") {
                    set_cookie_headers = set_cookie_headers.concat(value);
                  } else if (key2 !== "etag") {
                    headers[key2] = value;
                  }
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape$1(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    set_cookie_headers,
    uses_credentials
  };
}
var escaped$2 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape$1(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$2) {
      result += escaped$2[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    context: {},
    prerender_enabled: is_prerender_enabled(options2, default_error, state),
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      prerender_enabled: is_prerender_enabled(options2, default_error, state),
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page: page2
    });
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
function is_prerender_enabled(options2, node, state) {
  return options2.prerender && (!!node.module.prerender || !!state.prerender && state.prerender.all);
}
async function respond$1(opts) {
  const { request, options: options2, state, $session, route } = opts;
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  let page_config = get_page_config(leaf, options2);
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch = [];
  let status = 200;
  let error2;
  let set_cookie_headers = [];
  ssr:
    if (page_config.ssr) {
      let context = {};
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              ...opts,
              node,
              context,
              prerender_enabled: is_prerender_enabled(options2, node, state),
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
            if (loaded.loaded.redirect) {
              return with_cookies({
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              }, set_cookie_headers);
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e, request);
            status = 500;
            error2 = e;
          }
          if (loaded && !error2) {
            branch.push(loaded);
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  const error_loaded = await load_node({
                    ...opts,
                    node: error_node,
                    context: node_loaded.context,
                    prerender_enabled: is_prerender_enabled(options2, error_node, state),
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  page_config = get_page_config(error_node.module, options2);
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e, request);
                  continue;
                }
              }
            }
            return with_cookies(await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            }), set_cookie_headers);
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return with_cookies(await render_response({
      ...opts,
      page_config,
      status,
      error: error2,
      branch: branch.filter(Boolean)
    }), set_cookie_headers);
  } catch (err) {
    const error3 = coalesce_to_error(err);
    options2.handle_error(error3, request);
    return with_cookies(await respond_with_error({
      ...opts,
      status: 500,
      error: error3
    }), set_cookie_headers);
  }
}
function get_page_config(leaf, options2) {
  return {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
}
function with_cookies(response, set_cookie_headers) {
  if (set_cookie_headers.length) {
    response.headers["set-cookie"] = set_cookie_headers;
  }
  return response;
}
async function render_page(request, route, match, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route,
    page: page2
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        (map.get(key) || []).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  constructor(map) {
    __privateAdd(this, _map, void 0);
    __privateSet(this, _map, map);
  }
  get(key) {
    const value = __privateGet(this, _map).get(key);
    return value && value[0];
  }
  getAll(key) {
    return __privateGet(this, _map).get(key);
  }
  has(key) {
    return __privateGet(this, _map).has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of __privateGet(this, _map))
      yield key;
  }
  *values() {
    for (const [, value] of __privateGet(this, _map)) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
_map = new WeakMap();
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const content_type = headers["content-type"];
  const [type, ...directives] = content_type ? content_type.split(/;\s*/) : [];
  const text = () => new TextDecoder(headers["content-encoding"] || "utf-8").decode(raw);
  switch (type) {
    case "text/plain":
      return text();
    case "application/json":
      return JSON.parse(text());
    case "application/x-www-form-urlencoded":
      return get_urlencoded(text());
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(text(), boundary.slice("boundary=".length));
    }
    default:
      return raw;
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: options2.paths.base + path + (q ? `?${q}` : "")
        }
      };
    }
  }
  const headers = lowercase_keys(incoming.headers);
  const request = {
    ...incoming,
    headers,
    body: parse_body(incoming.rawBody, headers),
    params: {},
    locals: {}
  };
  try {
    return await options2.hooks.handle({
      request,
      resolve: async (request2) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request2),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        for (const route of options2.manifest.routes) {
          const match = route.pattern.exec(request2.path);
          if (!match)
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request2, route, match) : await render_page(request2, route, match, options2, state);
          if (response) {
            if (response.status === 200) {
              const cache_control = get_single_valued_header(response.headers, "cache-control");
              if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
                const etag = `"${hash(response.body || "")}"`;
                if (request2.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request2);
        return await respond_with_error({
          request: request2,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request2.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e, request);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function compute_rest_props(props, keys2) {
  const rest = {};
  keys2 = new Set(keys2);
  for (const k in props)
    if (!keys2.has(k) && k[0] !== "$")
      rest[k] = props[k];
  return rest;
}
function custom_event(type, detail, bubbles = false) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, false, detail);
  return e;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event2 = custom_event(type, detail);
      callbacks.slice().forEach((fn) => {
        fn.call(component, event2);
      });
    }
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
Promise.resolve();
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
function spread(args, classes_to_add) {
  const attributes = Object.assign({}, ...args);
  if (classes_to_add) {
    if (attributes.class == null) {
      attributes.class = classes_to_add;
    } else {
      attributes.class += " " + classes_to_add;
    }
  }
  let str = "";
  Object.keys(attributes).forEach((name) => {
    if (invalid_attribute_name_character.test(name))
      return;
    const value = attributes[name];
    if (value === true)
      str += " " + name;
    else if (boolean_attributes.has(name.toLowerCase())) {
      if (value)
        str += " " + name;
    } else if (value != null) {
      str += ` ${name}="${value}"`;
    }
  });
  return str;
}
var escaped = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
}
function escape_attribute_value(value) {
  return typeof value === "string" ? escape(value) : value;
}
function escape_object(obj) {
  const result = {};
  for (const key in obj) {
    result[key] = escape_attribute_value(obj[key]);
  }
  return result;
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
}
function afterUpdate() {
}
var css$9 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$9);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
var base = "";
var assets = "";
function set_paths(paths) {
  base = paths.base;
  assets = paths.assets || base;
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.ico" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		' + head + '\n\n		<!-- Bootstrap -->\n		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css">\n\n		<link rel="stylesheet" href="/global.css">\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "" } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  const hooks = get_hooks(user_hooks);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: assets + "/_app/start-e029724c.js",
      css: [assets + "/_app/assets/start-61d1577b.css", assets + "/_app/assets/vendor-cf063f61.css"],
      js: [assets + "/_app/start-e029724c.js", assets + "/_app/chunks/vendor-2bd6a93d.js", assets + "/_app/chunks/preload-helper-ec9aa979.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => assets + "/_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2, request) => {
      hooks.handleError({ error: error2, request });
      error2.stack = options.get_stack(error2);
    },
    hooks,
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    prerender: true,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = decodeURIComponent;
var empty = () => ({});
var manifest = {
  assets: [{ "file": "CouplePictures/0.jpg", "size": 129987, "type": "image/jpeg" }, { "file": "CouplePictures/1.jpg", "size": 219049, "type": "image/jpeg" }, { "file": "CouplePictures/10.jpg", "size": 167527, "type": "image/jpeg" }, { "file": "CouplePictures/11.jpg", "size": 98362, "type": "image/jpeg" }, { "file": "CouplePictures/12.jpg", "size": 107459, "type": "image/jpeg" }, { "file": "CouplePictures/13.jpg", "size": 66045, "type": "image/jpeg" }, { "file": "CouplePictures/14.jpg", "size": 105374, "type": "image/jpeg" }, { "file": "CouplePictures/15.jpg", "size": 157807, "type": "image/jpeg" }, { "file": "CouplePictures/16.jpg", "size": 440462, "type": "image/jpeg" }, { "file": "CouplePictures/17.jpg", "size": 265304, "type": "image/jpeg" }, { "file": "CouplePictures/18.jpg", "size": 58481, "type": "image/jpeg" }, { "file": "CouplePictures/19.jpg", "size": 188013, "type": "image/jpeg" }, { "file": "CouplePictures/2.jpg", "size": 85417, "type": "image/jpeg" }, { "file": "CouplePictures/20.jpg", "size": 388199, "type": "image/jpeg" }, { "file": "CouplePictures/21.jpg", "size": 167519, "type": "image/jpeg" }, { "file": "CouplePictures/22.jpg", "size": 29952, "type": "image/jpeg" }, { "file": "CouplePictures/23.jpg", "size": 550546, "type": "image/jpeg" }, { "file": "CouplePictures/24.jpg", "size": 194240, "type": "image/jpeg" }, { "file": "CouplePictures/25.jpg", "size": 98030, "type": "image/jpeg" }, { "file": "CouplePictures/26.jpg", "size": 327679, "type": "image/jpeg" }, { "file": "CouplePictures/27.jpg", "size": 126077, "type": "image/jpeg" }, { "file": "CouplePictures/28.jpg", "size": 91370, "type": "image/jpeg" }, { "file": "CouplePictures/29.jpg", "size": 566194, "type": "image/jpeg" }, { "file": "CouplePictures/3.jpg", "size": 2228259, "type": "image/jpeg" }, { "file": "CouplePictures/30.jpg", "size": 143024, "type": "image/jpeg" }, { "file": "CouplePictures/31.jpg", "size": 282422, "type": "image/jpeg" }, { "file": "CouplePictures/32.jpg", "size": 657869, "type": "image/jpeg" }, { "file": "CouplePictures/33.jpg", "size": 218489, "type": "image/jpeg" }, { "file": "CouplePictures/34.jpg", "size": 175194, "type": "image/jpeg" }, { "file": "CouplePictures/35.jpg", "size": 114749, "type": "image/jpeg" }, { "file": "CouplePictures/36.jpg", "size": 89804, "type": "image/jpeg" }, { "file": "CouplePictures/37.jpg", "size": 77405, "type": "image/jpeg" }, { "file": "CouplePictures/38.jpg", "size": 306862, "type": "image/jpeg" }, { "file": "CouplePictures/39.jpg", "size": 88715, "type": "image/jpeg" }, { "file": "CouplePictures/4.jpg", "size": 139993, "type": "image/jpeg" }, { "file": "CouplePictures/40.jpg", "size": 260770, "type": "image/jpeg" }, { "file": "CouplePictures/41.jpg", "size": 103320, "type": "image/jpeg" }, { "file": "CouplePictures/42.jpg", "size": 130958, "type": "image/jpeg" }, { "file": "CouplePictures/43.jpg", "size": 138363, "type": "image/jpeg" }, { "file": "CouplePictures/44.jpg", "size": 432606, "type": "image/jpeg" }, { "file": "CouplePictures/45.jpg", "size": 88211, "type": "image/jpeg" }, { "file": "CouplePictures/46.jpg", "size": 169774, "type": "image/jpeg" }, { "file": "CouplePictures/47.jpg", "size": 567845, "type": "image/jpeg" }, { "file": "CouplePictures/48.jpg", "size": 298218, "type": "image/jpeg" }, { "file": "CouplePictures/49.jpg", "size": 134836, "type": "image/jpeg" }, { "file": "CouplePictures/5.jpg", "size": 117042, "type": "image/jpeg" }, { "file": "CouplePictures/50.jpg", "size": 209976, "type": "image/jpeg" }, { "file": "CouplePictures/51.jpg", "size": 250892, "type": "image/jpeg" }, { "file": "CouplePictures/52.jpg", "size": 244981, "type": "image/jpeg" }, { "file": "CouplePictures/53.jpg", "size": 106992, "type": "image/jpeg" }, { "file": "CouplePictures/54.jpg", "size": 210689, "type": "image/jpeg" }, { "file": "CouplePictures/55.jpg", "size": 156662, "type": "image/jpeg" }, { "file": "CouplePictures/56.jpg", "size": 162457, "type": "image/jpeg" }, { "file": "CouplePictures/57.jpg", "size": 245989, "type": "image/jpeg" }, { "file": "CouplePictures/58.jpg", "size": 486955, "type": "image/jpeg" }, { "file": "CouplePictures/59.jpg", "size": 304269, "type": "image/jpeg" }, { "file": "CouplePictures/6.jpg", "size": 206219, "type": "image/jpeg" }, { "file": "CouplePictures/60.jpg", "size": 356937, "type": "image/jpeg" }, { "file": "CouplePictures/61.jpg", "size": 72500, "type": "image/jpeg" }, { "file": "CouplePictures/62.jpg", "size": 271273, "type": "image/jpeg" }, { "file": "CouplePictures/63.jpg", "size": 137837, "type": "image/jpeg" }, { "file": "CouplePictures/64.jpg", "size": 122711, "type": "image/jpeg" }, { "file": "CouplePictures/65.jpg", "size": 336275, "type": "image/jpeg" }, { "file": "CouplePictures/7.jpg", "size": 331621, "type": "image/jpeg" }, { "file": "CouplePictures/8.jpg", "size": 80949, "type": "image/jpeg" }, { "file": "CouplePictures/9.jpg", "size": 135407, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/0.jpg", "size": 129987, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/1.jpg", "size": 219049, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/10.jpg", "size": 153724, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/11.jpg", "size": 195992, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/12.jpg", "size": 226671, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/13.jpg", "size": 66045, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/14.jpg", "size": 105374, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/15.jpg", "size": 157807, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/16.jpg", "size": 440462, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/17.jpg", "size": 265304, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/18.jpg", "size": 58481, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/19.jpg", "size": 188013, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/2.jpg", "size": 85417, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/20.jpg", "size": 388199, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/21.jpg", "size": 167519, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/22.jpg", "size": 29952, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/23.jpg", "size": 512271, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/24.jpg", "size": 194240, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/25.jpg", "size": 200426, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/26.jpg", "size": 327679, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/27.jpg", "size": 126077, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/28.jpg", "size": 91370, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/29.jpg", "size": 450745, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/3.jpg", "size": 2228259, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/30.jpg", "size": 143024, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/31.jpg", "size": 493055, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/32.jpg", "size": 448476, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/33.jpg", "size": 242122, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/34.jpg", "size": 175194, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/35.jpg", "size": 217201, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/36.jpg", "size": 89804, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/37.jpg", "size": 77405, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/38.jpg", "size": 306862, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/39.jpg", "size": 167095, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/4.jpg", "size": 139993, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/40.jpg", "size": 429598, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/41.jpg", "size": 103320, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/42.jpg", "size": 130958, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/43.jpg", "size": 138363, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/44.jpg", "size": 432606, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/45.jpg", "size": 88211, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/46.jpg", "size": 169774, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/47.jpg", "size": 385101, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/48.jpg", "size": 436749, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/49.jpg", "size": 134836, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/5.jpg", "size": 117042, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/50.jpg", "size": 209976, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/51.jpg", "size": 250892, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/52.jpg", "size": 405847, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/53.jpg", "size": 106992, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/54.jpg", "size": 335748, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/55.jpg", "size": 230547, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/56.jpg", "size": 162457, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/57.jpg", "size": 393404, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/58.jpg", "size": 486654, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/59.jpg", "size": 279098, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/6.jpg", "size": 206219, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/60.jpg", "size": 296526, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/61.jpg", "size": 72500, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/62.jpg", "size": 271273, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/63.jpg", "size": 137837, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/64.jpg", "size": 122711, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/65.jpg", "size": 446202, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/7.jpg", "size": 331621, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/8.jpg", "size": 80949, "type": "image/jpeg" }, { "file": "CroppedCouplePictures/9.jpg", "size": 221591, "type": "image/jpeg" }, { "file": "Hotel.webp", "size": 125158, "type": "image/webp" }, { "file": "blog-posts/how-to-rsvp.html", "size": 335, "type": "text/html" }, { "file": "favicon.ico", "size": 15406, "type": "image/vnd.microsoft.icon" }, { "file": "global.css", "size": 836, "type": "text/css" }, { "file": "hearts.jpg", "size": 1034884, "type": "image/jpeg" }, { "file": "logo-192.png", "size": 4760, "type": "image/png" }, { "file": "logo-512.png", "size": 13928, "type": "image/png" }, { "file": "manifest.json", "size": 324, "type": "application/json" }, { "file": "pinkwave.jpg", "size": 154996, "type": "image/jpeg" }, { "file": "wavy.jpg", "size": 1514610, "type": "image/jpeg" }, { "file": "xmas.jpg", "size": 3739376, "type": "image/jpeg" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/gallery\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/gallery.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/updates\.json$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return index_json;
      })
    },
    {
      type: "page",
      pattern: /^\/updates\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/updates/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/updates\/([^/]+?)\.json$/,
      params: (m) => ({ slug: d(m[1]) }),
      load: () => Promise.resolve().then(function() {
        return _slug__json;
      })
    },
    {
      type: "page",
      pattern: /^\/updates\/([^/]+?)\/?$/,
      params: (m) => ({ slug: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/updates/[slug].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/event\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/event.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/rsvp\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/rsvp/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/rsvp\/([^/]+?)\/?$/,
      params: (m) => ({ id: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/rsvp/[id].svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/time\/?$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return time;
      })
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
  externalFetch: hooks.externalFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index$2;
  }),
  "src/routes/gallery.svelte": () => Promise.resolve().then(function() {
    return gallery;
  }),
  "src/routes/updates/index.svelte": () => Promise.resolve().then(function() {
    return index$1;
  }),
  "src/routes/updates/[slug].svelte": () => Promise.resolve().then(function() {
    return _slug_;
  }),
  "src/routes/event.svelte": () => Promise.resolve().then(function() {
    return event;
  }),
  "src/routes/rsvp/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/rsvp/[id].svelte": () => Promise.resolve().then(function() {
    return _id_;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "pages/__layout.svelte-7e6aadd5.js", "css": ["assets/pages/__layout.svelte-c3bbed1f.css", "assets/vendor-cf063f61.css"], "js": ["pages/__layout.svelte-7e6aadd5.js", "chunks/vendor-2bd6a93d.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "error.svelte-51e6f2a0.js", "css": ["assets/vendor-cf063f61.css"], "js": ["error.svelte-51e6f2a0.js", "chunks/vendor-2bd6a93d.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "pages/index.svelte-6847b1bb.js", "css": ["assets/pages/index.svelte-702b6c20.css", "assets/vendor-cf063f61.css"], "js": ["pages/index.svelte-6847b1bb.js", "chunks/preload-helper-ec9aa979.js", "chunks/vendor-2bd6a93d.js", "chunks/constants-cb8a62f7.js"], "styles": [] }, "src/routes/gallery.svelte": { "entry": "pages/gallery.svelte-b26fe753.js", "css": ["assets/pages/gallery.svelte-622eb4c1.css", "assets/vendor-cf063f61.css"], "js": ["pages/gallery.svelte-b26fe753.js", "chunks/vendor-2bd6a93d.js", "chunks/constants-cb8a62f7.js"], "styles": [] }, "src/routes/updates/index.svelte": { "entry": "pages/updates/index.svelte-d2a10eb5.js", "css": ["assets/pages/updates/index.svelte-9532fd46.css", "assets/vendor-cf063f61.css"], "js": ["pages/updates/index.svelte-d2a10eb5.js", "chunks/vendor-2bd6a93d.js"], "styles": [] }, "src/routes/updates/[slug].svelte": { "entry": "pages/updates/[slug].svelte-2f04c3d5.js", "css": ["assets/pages/updates/[slug].svelte-2f716ab0.css", "assets/vendor-cf063f61.css"], "js": ["pages/updates/[slug].svelte-2f04c3d5.js", "chunks/vendor-2bd6a93d.js"], "styles": [] }, "src/routes/event.svelte": { "entry": "pages/event.svelte-0c95a64f.js", "css": ["assets/pages/event.svelte-b5e07ef6.css", "assets/vendor-cf063f61.css"], "js": ["pages/event.svelte-0c95a64f.js", "chunks/vendor-2bd6a93d.js"], "styles": [] }, "src/routes/rsvp/index.svelte": { "entry": "pages/rsvp/index.svelte-cb53a1b8.js", "css": ["assets/vendor-cf063f61.css"], "js": ["pages/rsvp/index.svelte-cb53a1b8.js", "chunks/vendor-2bd6a93d.js"], "styles": [] }, "src/routes/rsvp/[id].svelte": { "entry": "pages/rsvp/[id].svelte-d642e6ff.js", "css": ["assets/pages/rsvp/[id].svelte-b90cd8ac.css", "assets/vendor-cf063f61.css"], "js": ["pages/rsvp/[id].svelte-d642e6ff.js", "chunks/vendor-2bd6a93d.js"], "styles": [] } };
async function load_component(file) {
  const { entry, css: css2, js, styles } = metadata_lookup[file];
  return {
    module: await module_lookup[file](),
    entry: assets + "/_app/" + entry,
    css: css2.map((dep) => assets + "/_app/" + dep),
    js: js.map((dep) => assets + "/_app/" + dep),
    styles
  };
}
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var posts = [
  {
    title: "How to RSVP",
    slug: "how-to-rsvp"
  }
];
var contents = JSON.stringify(posts.map((post) => {
  return {
    title: post.title,
    slug: post.slug
  };
}));
function get$2() {
  return {
    headers: {
      "Content-Type": "application/json"
    },
    body: contents
  };
}
var index_json = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$2
});
var lookup = new Map();
posts.forEach((post) => {
  lookup.set(post.slug, JSON.stringify(post));
});
console.log(lookup);
function get$1({ params }) {
  const { slug } = params;
  if (lookup.has(slug)) {
    return {
      headers: {
        "Content-Type": "application/json"
      },
      body: lookup.get(slug)
    };
  } else {
    return {
      status: 404,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Not found`
      })
    };
  }
}
var _slug__json = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$1
});
async function get() {
  const url = "https://worldtimeapi.org/api/timezone/America/New_York";
  const res = await fetch(url);
  const time2 = await res.json();
  return { body: time2 };
}
var time = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get
});
var css$8 = {
  code: `ul.svelte-1appppl{margin:0;padding:0}ul.svelte-1appppl::after{content:'';display:block;clear:both}li.svelte-1appppl{display:block;float:left}[aria-current].svelte-1appppl{position:relative;display:inline-block}[aria-current].svelte-1appppl::after{position:absolute;content:'';width:calc(100% - 1em);height:2px;background-color:rgb(255,62,0);display:block;bottom:-1px}a.svelte-1appppl{text-decoration:none;padding:1em 0.5em;display:block}.navContainer.svelte-1appppl{border-bottom:1px solid rgba(255,62,0,0.1)}.headerMessage.svelte-1appppl{padding-top:1rem;font-family:"Brush Script MT", cursive;font-size:1.5rem}@media(min-width: 768px){.navbar-brand.svelte-1appppl{position:absolute;left:50%;transform:translateX(-50%)}}`,
  map: `{"version":3,"file":"Nav.svelte","sources":["Nav.svelte"],"sourcesContent":["<script>\\n    export let path;\\n<\/script>\\n\\n<style>\\n    ul {\\n        margin: 0;\\n        padding: 0;\\n    }\\n    /* clearfix */\\n    ul::after {\\n        content: '';\\n        display: block;\\n        clear: both;\\n    }\\n    li {\\n        display: block;\\n        float: left;\\n    }\\n    [aria-current] {\\n        position: relative;\\n        display: inline-block;\\n    }\\n    [aria-current]::after {\\n        position: absolute;\\n        content: '';\\n        width: calc(100% - 1em);\\n        height: 2px;\\n        background-color: rgb(255,62,0);\\n        display: block;\\n        bottom: -1px;\\n    }\\n    a {\\n        text-decoration: none;\\n        padding: 1em 0.5em;\\n        display: block;\\n    }\\n    .navContainer {\\n        /* display: flex;\\n        flex-direction: row;\\n        align-items: left; */\\n        border-bottom: 1px solid rgba(255,62,0,0.1);\\n        /* font-weight: 300; */\\n        /* padding: 0 1em; */\\n    }\\n    .headerMessage {\\n        /* position: absolute;\\n        margin-left: auto;\\n        margin-right: auto; */\\n        /* left: 0;\\n        right: 0; */\\n        /* text-align: center; */\\n        padding-top: 1rem;\\n        font-family: \\"Brush Script MT\\", cursive;\\n        font-size: 1.5rem;\\n        /* z-index: -1; */\\n    }\\n    @media (min-width: 768px) {\\n    .navbar-brand\\n        {\\n            position: absolute;\\n            left: 50%;\\n            transform: translateX(-50%);\\n        }\\n    }\\n</style>\\n\\n<div class=\\"navContainer\\">\\n    <nav class=\\"navbar navbar-expand-md navbar-light\\">\\n        <button class=\\"navbar-toggler\\" type=\\"button\\" data-toggle=\\"collapse\\" data-target=\\"#navbarSupportedContent\\" aria-controls=\\"navbarSupportedContent\\" aria-expanded=\\"false\\" aria-label=\\"Toggle navigation\\">\\n            <span class=\\"navbar-toggler-icon\\"></span>\\n        </button>\\n        <div class=\\"collapse navbar-collapse\\" id=\\"navbarSupportedContent\\">\\n            <ul class=\\"navbar-nav mr-auto\\">\\n                <li class=\\"nav-item\\"><a class=\\"nav-link\\" aria-current=\\"{path === '/' ? 'page' : undefined}\\" href=\\".\\">home</a></li>\\n                <li class=\\"nav-item\\"><a class=\\"nav-link\\" aria-current=\\"{path.includes('event') ? 'page' : undefined}\\" href=\\"event\\">event</a></li>\\n                <li class=\\"nav-item\\"><a class=\\"nav-link\\" aria-current=\\"{path.includes('gallery') ? 'page' : undefined}\\" href=\\"gallery\\">gallery</a></li>\\n                <li class=\\"nav-item\\"><a class=\\"nav-link\\" rel=prefetch aria-current=\\"{path.includes('updates') ? 'page' : undefined}\\" href=\\"updates\\">updates</a></li>\\n            </ul>\\n        </div>\\n        <h3 class=\\"headerMessage navbar-brand mx-auto\\">Adrian + Jenny \xB7 11.13.21</h3>\\n    </nav>\\n</div>"],"names":[],"mappings":"AAKI,EAAE,eAAC,CAAC,AACA,MAAM,CAAE,CAAC,CACT,OAAO,CAAE,CAAC,AACd,CAAC,AAED,iBAAE,OAAO,AAAC,CAAC,AACP,OAAO,CAAE,EAAE,CACX,OAAO,CAAE,KAAK,CACd,KAAK,CAAE,IAAI,AACf,CAAC,AACD,EAAE,eAAC,CAAC,AACA,OAAO,CAAE,KAAK,CACd,KAAK,CAAE,IAAI,AACf,CAAC,AACD,CAAC,YAAY,CAAC,eAAC,CAAC,AACZ,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,YAAY,AACzB,CAAC,AACD,CAAC,YAAY,gBAAC,OAAO,AAAC,CAAC,AACnB,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,EAAE,CACX,KAAK,CAAE,KAAK,IAAI,CAAC,CAAC,CAAC,GAAG,CAAC,CACvB,MAAM,CAAE,GAAG,CACX,gBAAgB,CAAE,IAAI,GAAG,CAAC,EAAE,CAAC,CAAC,CAAC,CAC/B,OAAO,CAAE,KAAK,CACd,MAAM,CAAE,IAAI,AAChB,CAAC,AACD,CAAC,eAAC,CAAC,AACC,eAAe,CAAE,IAAI,CACrB,OAAO,CAAE,GAAG,CAAC,KAAK,CAClB,OAAO,CAAE,KAAK,AAClB,CAAC,AACD,aAAa,eAAC,CAAC,AAIX,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,KAAK,GAAG,CAAC,EAAE,CAAC,CAAC,CAAC,GAAG,CAAC,AAG/C,CAAC,AACD,cAAc,eAAC,CAAC,AAOZ,WAAW,CAAE,IAAI,CACjB,WAAW,CAAE,iBAAiB,CAAC,CAAC,OAAO,CACvC,SAAS,CAAE,MAAM,AAErB,CAAC,AACD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC3B,aAAa,eACT,CAAC,AACG,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,SAAS,CAAE,WAAW,IAAI,CAAC,AAC/B,CAAC,AACL,CAAC"}`
};
var Nav = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { path } = $$props;
  if ($$props.path === void 0 && $$bindings.path && path !== void 0)
    $$bindings.path(path);
  $$result.css.add(css$8);
  return `<div class="${"navContainer svelte-1appppl"}"><nav class="${"navbar navbar-expand-md navbar-light"}"><button class="${"navbar-toggler"}" type="${"button"}" data-toggle="${"collapse"}" data-target="${"#navbarSupportedContent"}" aria-controls="${"navbarSupportedContent"}" aria-expanded="${"false"}" aria-label="${"Toggle navigation"}"><span class="${"navbar-toggler-icon"}"></span></button>
        <div class="${"collapse navbar-collapse"}" id="${"navbarSupportedContent"}"><ul class="${"navbar-nav mr-auto svelte-1appppl"}"><li class="${"nav-item svelte-1appppl"}"><a class="${"nav-link svelte-1appppl"}"${add_attribute("aria-current", path === "/" ? "page" : void 0, 0)} href="${"."}">home</a></li>
                <li class="${"nav-item svelte-1appppl"}"><a class="${"nav-link svelte-1appppl"}"${add_attribute("aria-current", path.includes("event") ? "page" : void 0, 0)} href="${"event"}">event</a></li>
                <li class="${"nav-item svelte-1appppl"}"><a class="${"nav-link svelte-1appppl"}"${add_attribute("aria-current", path.includes("gallery") ? "page" : void 0, 0)} href="${"gallery"}">gallery</a></li>
                <li class="${"nav-item svelte-1appppl"}"><a class="${"nav-link svelte-1appppl"}" rel="${"prefetch"}"${add_attribute("aria-current", path.includes("updates") ? "page" : void 0, 0)} href="${"updates"}">updates</a></li></ul></div>
        <h3 class="${"headerMessage navbar-brand mx-auto svelte-1appppl"}">Adrian + Jenny \xB7 11.13.21</h3></nav></div>`;
});
var getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
var page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
var css$7 = {
  code: 'main.svelte-1mil0yj{position:relative;max-width:56em;padding:2em;margin:0 auto;box-sizing:border-box}:root{background-image:url("/pinkwave.jpg");background-repeat:no-repeat;background-size:cover}',
  map: `{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script>\\n\\timport Nav from '../components/Nav.svelte';\\n\\timport { page } from '$app/stores';\\n<\/script>\\n\\n<style>\\n\\tmain {\\n\\t\\tposition: relative;\\n\\t\\tmax-width: 56em;\\n\\t\\tpadding: 2em;\\n\\t\\tmargin: 0 auto;\\n\\t\\tbox-sizing: border-box;\\n\\t}\\n\\t:global(:root){\\n\\t\\tbackground-image: url(\\"/pinkwave.jpg\\");\\n\\t\\tbackground-repeat: no-repeat;\\n    \\tbackground-size: cover;\\n\\t}\\n</style>\\n\\n<Nav path={$page.path}/>\\n\\n<main>\\n\\t<slot></slot>\\n</main>"],"names":[],"mappings":"AAMC,IAAI,eAAC,CAAC,AACL,QAAQ,CAAE,QAAQ,CAClB,SAAS,CAAE,IAAI,CACf,OAAO,CAAE,GAAG,CACZ,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,UAAU,CAAE,UAAU,AACvB,CAAC,AACO,KAAK,AAAC,CAAC,AACd,gBAAgB,CAAE,IAAI,eAAe,CAAC,CACtC,iBAAiB,CAAE,SAAS,CACzB,eAAe,CAAE,KAAK,AAC1B,CAAC"}`
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css$7);
  $$unsubscribe_page();
  return `${validate_component(Nav, "Nav").$$render($$result, { path: $page.path }, {}, {})}

<main class="${"svelte-1mil0yj"}">${slots.default ? slots.default({}) : ``}</main>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load$3({ error: error2, status }) {
  return { props: { error: error2, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error2 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
    $$bindings.error(error2);
  return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
});
var error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load: load$3
});
var NUM_IMAGES = 66;
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal$1 = freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal$1 || freeSelf || Function("return this")();
var root$1 = root;
var Symbol$1 = root$1.Symbol;
var Symbol$2 = Symbol$1;
var objectProto$5 = Object.prototype;
var hasOwnProperty$3 = objectProto$5.hasOwnProperty;
var nativeObjectToString$1 = objectProto$5.toString;
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag(value) {
  var isOwn = hasOwnProperty$3.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var objectProto$4 = Object.prototype;
var nativeObjectToString = objectProto$4.toString;
function objectToString(value) {
  return nativeObjectToString.call(value);
}
var nullTag = "[object Null]";
var undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
function baseGetTag(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
function isObjectLike(value) {
  return value != null && typeof value == "object";
}
function arrayMap(array, iteratee) {
  var index2 = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index2 < length) {
    result[index2] = iteratee(array[index2], index2, array);
  }
  return result;
}
var isArray = Array.isArray;
var isArray$1 = isArray;
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var asyncTag = "[object AsyncFunction]";
var funcTag$1 = "[object Function]";
var genTag = "[object GeneratorFunction]";
var proxyTag = "[object Proxy]";
function isFunction(value) {
  if (!isObject$1(value)) {
    return false;
  }
  var tag = baseGetTag(value);
  return tag == funcTag$1 || tag == genTag || tag == asyncTag || tag == proxyTag;
}
function copyArray(source, array) {
  var index2 = -1, length = source.length;
  array || (array = Array(length));
  while (++index2 < length) {
    array[index2] = source[index2];
  }
  return array;
}
var MAX_SAFE_INTEGER$1 = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
}
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}
var objectProto$3 = Object.prototype;
function isPrototype(value) {
  var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$3;
  return value === proto;
}
function baseTimes(n, iteratee) {
  var index2 = -1, result = Array(n);
  while (++index2 < n) {
    result[index2] = iteratee(index2);
  }
  return result;
}
var argsTag$1 = "[object Arguments]";
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag$1;
}
var objectProto$2 = Object.prototype;
var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;
var isArguments = baseIsArguments(function() {
  return arguments;
}()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$2.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
var isArguments$1 = isArguments;
function stubFalse() {
  return false;
}
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
var Buffer2 = moduleExports$1 ? root$1.Buffer : void 0;
var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse;
var isBuffer$1 = isBuffer;
var argsTag = "[object Arguments]";
var arrayTag = "[object Array]";
var boolTag = "[object Boolean]";
var dateTag = "[object Date]";
var errorTag = "[object Error]";
var funcTag = "[object Function]";
var mapTag = "[object Map]";
var numberTag = "[object Number]";
var objectTag = "[object Object]";
var regexpTag = "[object RegExp]";
var setTag = "[object Set]";
var stringTag = "[object String]";
var weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]";
var dataViewTag = "[object DataView]";
var float32Tag = "[object Float32Array]";
var float64Tag = "[object Float64Array]";
var int8Tag = "[object Int8Array]";
var int16Tag = "[object Int16Array]";
var int32Tag = "[object Int32Array]";
var uint8Tag = "[object Uint8Array]";
var uint8ClampedTag = "[object Uint8ClampedArray]";
var uint16Tag = "[object Uint16Array]";
var uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var freeProcess = moduleExports && freeGlobal$1.process;
var nodeUtil = function() {
  try {
    var types2 = freeModule && freeModule.require && freeModule.require("util").types;
    if (types2) {
      return types2;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
}();
var nodeUtil$1 = nodeUtil;
var nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
var isTypedArray$1 = isTypedArray;
var objectProto$1 = Object.prototype;
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray$1(value), isArg = !isArr && isArguments$1(value), isBuff = !isArr && !isArg && isBuffer$1(value), isType = !isArr && !isArg && !isBuff && isTypedArray$1(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
  for (var key in value) {
    if ((inherited || hasOwnProperty$1.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var nativeKeys = overArg(Object.keys, Object);
var nativeKeys$1 = nativeKeys;
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys$1(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}
var nativeFloor = Math.floor;
var nativeRandom = Math.random;
function baseRandom(lower, upper) {
  return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
}
function shuffleSelf(array, size) {
  var index2 = -1, length = array.length, lastIndex = length - 1;
  size = size === void 0 ? length : size;
  while (++index2 < size) {
    var rand = baseRandom(index2, lastIndex), value = array[rand];
    array[rand] = array[index2];
    array[index2] = value;
  }
  array.length = size;
  return array;
}
function arrayShuffle(array) {
  return shuffleSelf(copyArray(array));
}
function baseShuffle(collection) {
  return shuffleSelf(values(collection));
}
function shuffle(collection) {
  var func = isArray$1(collection) ? arrayShuffle : baseShuffle;
  return func(collection);
}
var css$6 = {
  code: "img.svelte-10s4sqa{text-align:center;margin:auto;object-fit:contain}.img-container.svelte-10s4sqa{max-height:560px}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<style>\\nimg {\\n    text-align: center;\\n    margin: auto;\\n    object-fit: contain;\\n}\\n.img-container {\\n    max-height: 560px;\\n}\\n</style>\\n\\n<script>\\n    import { NUM_IMAGES } from '../constants';\\n    import { shuffle } from 'lodash-es';\\n    // Weird stuff below to get svelte-carousel to work on server\\n    import { onMount } from 'svelte';\\n    let Carousel; // for saving Carousel component class\\n    let carousel; // for calling methods of carousel instance\\n    onMount(async () => {\\n    const module = await import('svelte-carousel');\\n    Carousel = module.default;\\n    });\\n\\n    const randomImage=Math.floor(Math.random() * NUM_IMAGES-1);\\n    const imageURIs = shuffle(Array(NUM_IMAGES).fill().map((_, index) => \`CroppedCouplePictures/\${index}.jpg\`));\\n<\/script>\\n\\n<svelte:head>\\n    <title>Adrian & Jenny's Wedding</title>\\n</svelte:head>\\n\\n<h1>Finally!</h1>\\n<p>After 8 years of dating, two years of engagement, and on COVID delay, we are getting married in Novemeber, 2021! We hope you will be available to join us!</p>\\n\\n<svelte:component\\n  this={Carousel}\\n  bind:this={carousel}\\n  autoplay\\n  autoplayDuration={8000}\\n  arrows={false}\\n  dots={false}\\n  swiping={false}\\n  let:loaded\\n>\\n    {#each imageURIs as src, imageIndex (src)}\\n        <div class=\\"img-container\\">\\n            {#if loaded.includes(imageIndex)}\\n                <img src={src} class=\\"d-block w-100 h-100\\" alt={\`\${src} \${imageIndex + 1}\`} />\\n            {/if}\\n        </div>\\n    {/each}\\n</svelte:component>"],"names":[],"mappings":"AACA,GAAG,eAAC,CAAC,AACD,UAAU,CAAE,MAAM,CAClB,MAAM,CAAE,IAAI,CACZ,UAAU,CAAE,OAAO,AACvB,CAAC,AACD,cAAc,eAAC,CAAC,AACZ,UAAU,CAAE,KAAK,AACrB,CAAC"}`
};
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let carousel;
  const imageURIs = shuffle(Array(NUM_IMAGES).fill().map((_, index2) => `CroppedCouplePictures/${index2}.jpg`));
  $$result.css.add(css$6);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${$$result.head += `${$$result.title = `<title>Adrian &amp; Jenny&#39;s Wedding</title>`, ""}`, ""}

<h1>Finally!</h1>
<p>After 8 years of dating, two years of engagement, and on COVID delay, we are getting married in Novemeber, 2021! We hope you will be available to join us!</p>

${validate_component(missing_component, "svelte:component").$$render($$result, {
      autoplay: true,
      autoplayDuration: 8e3,
      arrows: false,
      dots: false,
      swiping: false,
      this: carousel
    }, {
      this: ($$value) => {
        carousel = $$value;
        $$settled = false;
      }
    }, {
      default: ({ loaded }) => `${each(imageURIs, (src2, imageIndex) => `<div class="${"img-container svelte-10s4sqa"}">${loaded.includes(imageIndex) ? `<img${add_attribute("src", src2, 0)} class="${"d-block w-100 h-100 svelte-10s4sqa"}"${add_attribute("alt", `${src2} ${imageIndex + 1}`, 0)}>` : ``}
        </div>`)}`
    })}`;
  } while (!$$settled);
  return $$rendered;
});
var index$2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes
});
function isObject(value) {
  const type = typeof value;
  return value != null && (type == "object" || type == "function");
}
function getColumnSizeClass(isXs, colWidth, colSize) {
  if (colSize === true || colSize === "") {
    return isXs ? "col" : `col-${colWidth}`;
  } else if (colSize === "auto") {
    return isXs ? "col-auto" : `col-${colWidth}-auto`;
  }
  return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
}
function toClassName(value) {
  let result = "";
  if (typeof value === "string" || typeof value === "number") {
    result += value;
  } else if (typeof value === "object") {
    if (Array.isArray(value)) {
      result = value.map(toClassName).filter(Boolean).join(" ");
    } else {
      for (let key in value) {
        if (value[key]) {
          result && (result += " ");
          result += key;
        }
      }
    }
  }
  return result;
}
function classnames(...args) {
  return args.map(toClassName).filter(Boolean).join(" ");
}
var Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let ariaLabel;
  let classes;
  let defaultAriaLabel;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "active",
    "block",
    "children",
    "close",
    "color",
    "disabled",
    "href",
    "inner",
    "outline",
    "size",
    "style",
    "value"
  ]);
  let { class: className = "" } = $$props;
  let { active = false } = $$props;
  let { block = false } = $$props;
  let { children = void 0 } = $$props;
  let { close = false } = $$props;
  let { color = "secondary" } = $$props;
  let { disabled = false } = $$props;
  let { href = "" } = $$props;
  let { inner = void 0 } = $$props;
  let { outline = false } = $$props;
  let { size = null } = $$props;
  let { style = "" } = $$props;
  let { value = "" } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.block === void 0 && $$bindings.block && block !== void 0)
    $$bindings.block(block);
  if ($$props.children === void 0 && $$bindings.children && children !== void 0)
    $$bindings.children(children);
  if ($$props.close === void 0 && $$bindings.close && close !== void 0)
    $$bindings.close(close);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.inner === void 0 && $$bindings.inner && inner !== void 0)
    $$bindings.inner(inner);
  if ($$props.outline === void 0 && $$bindings.outline && outline !== void 0)
    $$bindings.outline(outline);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  ariaLabel = $$props["aria-label"];
  classes = classnames(className, close ? "btn-close" : "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "d-block w-100" : false, { active });
  defaultAriaLabel = close ? "Close" : null;
  return `${href ? `<a${spread([
    escape_object($$restProps),
    { class: escape_attribute_value(classes) },
    { disabled: disabled || null },
    { href: escape_attribute_value(href) },
    {
      "aria-label": escape_attribute_value(ariaLabel || defaultAriaLabel)
    },
    { style: escape_attribute_value(style) }
  ])}${add_attribute("this", inner, 0)}>${children ? `${escape(children)}` : `${slots.default ? slots.default({}) : ``}`}</a>` : `<button${spread([
    escape_object($$restProps),
    { class: escape_attribute_value(classes) },
    { disabled: disabled || null },
    { value: escape_attribute_value(value) },
    {
      "aria-label": escape_attribute_value(ariaLabel || defaultAriaLabel)
    },
    { style: escape_attribute_value(style) }
  ])}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : `
      ${children ? `${escape(children)}` : `${slots.default ? slots.default({}) : ``}`}
    `}</button>`}`;
});
var ButtonGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "size", "vertical"]);
  let { class: className = "" } = $$props;
  let { size = "" } = $$props;
  let { vertical = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.vertical === void 0 && $$bindings.vertical && vertical !== void 0)
    $$bindings.vertical(vertical);
  classes = classnames(className, size ? `btn-group-${size}` : false, vertical ? "btn-group-vertical" : "btn-group");
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</div>`;
});
var Col = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "xs", "sm", "md", "lg", "xl", "xxl"]);
  let { class: className = "" } = $$props;
  let { xs = void 0 } = $$props;
  let { sm = void 0 } = $$props;
  let { md = void 0 } = $$props;
  let { lg = void 0 } = $$props;
  let { xl = void 0 } = $$props;
  let { xxl = void 0 } = $$props;
  const colClasses = [];
  const lookup2 = { xs, sm, md, lg, xl, xxl };
  Object.keys(lookup2).forEach((colWidth) => {
    const columnProp = lookup2[colWidth];
    if (!columnProp && columnProp !== "") {
      return;
    }
    const isXs = colWidth === "xs";
    if (isObject(columnProp)) {
      const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
      const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
      if (columnProp.size || columnProp.size === "") {
        colClasses.push(colClass);
      }
      if (columnProp.push) {
        colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
      }
      if (columnProp.pull) {
        colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
      }
      if (columnProp.offset) {
        colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
      }
    } else {
      colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    }
  });
  if (!colClasses.length) {
    colClasses.push("col");
  }
  if (className) {
    colClasses.push(className);
  }
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.xs === void 0 && $$bindings.xs && xs !== void 0)
    $$bindings.xs(xs);
  if ($$props.sm === void 0 && $$bindings.sm && sm !== void 0)
    $$bindings.sm(sm);
  if ($$props.md === void 0 && $$bindings.md && md !== void 0)
    $$bindings.md(md);
  if ($$props.lg === void 0 && $$bindings.lg && lg !== void 0)
    $$bindings.lg(lg);
  if ($$props.xl === void 0 && $$bindings.xl && xl !== void 0)
    $$bindings.xl(xl);
  if ($$props.xxl === void 0 && $$bindings.xxl && xxl !== void 0)
    $$bindings.xxl(xxl);
  return `<div${spread([
    escape_object($$restProps),
    {
      class: escape_attribute_value(colClasses.join(" "))
    }
  ])}>${slots.default ? slots.default({}) : ``}</div>`;
});
var Container = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "sm", "md", "lg", "xl", "xxl", "fluid"]);
  let { class: className = "" } = $$props;
  let { sm = void 0 } = $$props;
  let { md = void 0 } = $$props;
  let { lg = void 0 } = $$props;
  let { xl = void 0 } = $$props;
  let { xxl = void 0 } = $$props;
  let { fluid = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.sm === void 0 && $$bindings.sm && sm !== void 0)
    $$bindings.sm(sm);
  if ($$props.md === void 0 && $$bindings.md && md !== void 0)
    $$bindings.md(md);
  if ($$props.lg === void 0 && $$bindings.lg && lg !== void 0)
    $$bindings.lg(lg);
  if ($$props.xl === void 0 && $$bindings.xl && xl !== void 0)
    $$bindings.xl(xl);
  if ($$props.xxl === void 0 && $$bindings.xxl && xxl !== void 0)
    $$bindings.xxl(xxl);
  if ($$props.fluid === void 0 && $$bindings.fluid && fluid !== void 0)
    $$bindings.fluid(fluid);
  classes = classnames(className, {
    "container-sm": sm,
    "container-md": md,
    "container-lg": lg,
    "container-xl": xl,
    "container-xxl": xxl,
    "container-fluid": fluid,
    container: !sm && !md && !lg && !xl && !xxl && !fluid
  });
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</div>`;
});
var Form = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "inline", "validated"]);
  let { class: className = "" } = $$props;
  let { inline = false } = $$props;
  let { validated = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0)
    $$bindings.inline(inline);
  if ($$props.validated === void 0 && $$bindings.validated && validated !== void 0)
    $$bindings.validated(validated);
  classes = classnames(className, {
    "form-inline": inline,
    "was-validated": validated
  });
  return `<form${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</form>`;
});
var FormCheck = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let inputClasses;
  let idFor;
  let $$restProps = compute_rest_props($$props, [
    "class",
    "checked",
    "disabled",
    "group",
    "id",
    "inline",
    "inner",
    "invalid",
    "label",
    "name",
    "size",
    "type",
    "valid",
    "value"
  ]);
  let { class: className = "" } = $$props;
  let { checked = false } = $$props;
  let { disabled = false } = $$props;
  let { group = void 0 } = $$props;
  let { id = void 0 } = $$props;
  let { inline = false } = $$props;
  let { inner = void 0 } = $$props;
  let { invalid = false } = $$props;
  let { label = "" } = $$props;
  let { name = "" } = $$props;
  let { size = "" } = $$props;
  let { type = "checkbox" } = $$props;
  let { valid = false } = $$props;
  let { value = void 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0)
    $$bindings.inline(inline);
  if ($$props.inner === void 0 && $$bindings.inner && inner !== void 0)
    $$bindings.inner(inner);
  if ($$props.invalid === void 0 && $$bindings.invalid && invalid !== void 0)
    $$bindings.invalid(invalid);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0)
    $$bindings.valid(valid);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  classes = classnames(className, "form-check", {
    "form-switch": type === "switch",
    "form-check-inline": inline,
    [`form-control-${size}`]: size
  });
  inputClasses = classnames("form-check-input", { "is-invalid": invalid, "is-valid": valid });
  idFor = id || label;
  return `<div${add_attribute("class", classes, 0)}>${type === "radio" ? `<input${spread([
    escape_object($$restProps),
    {
      class: escape_attribute_value(inputClasses)
    },
    { id: escape_attribute_value(idFor) },
    { type: "radio" },
    { disabled: disabled || null },
    { name: escape_attribute_value(name) },
    { value: escape_attribute_value(value) }
  ])}${value === group ? add_attribute("checked", true, 1) : ""}${add_attribute("this", inner, 0)}>` : `${type === "switch" ? `<input${spread([
    escape_object($$restProps),
    {
      class: escape_attribute_value(inputClasses)
    },
    { id: escape_attribute_value(idFor) },
    { type: "checkbox" },
    { disabled: disabled || null },
    { name: escape_attribute_value(name) },
    { value: escape_attribute_value(value) }
  ])}${add_attribute("checked", checked, 1)}${add_attribute("this", inner, 0)}>` : `<input${spread([
    escape_object($$restProps),
    {
      class: escape_attribute_value(inputClasses)
    },
    { id: escape_attribute_value(idFor) },
    { type: "checkbox" },
    { disabled: disabled || null },
    { name: escape_attribute_value(name) },
    { value: escape_attribute_value(value) }
  ])}${add_attribute("checked", checked, 1)}${add_attribute("this", inner, 0)}>`}`}
  ${label ? `<label class="${"form-check-label"}"${add_attribute("for", idFor, 0)}>${slots.label ? slots.label({}) : `${escape(label)}`}</label>` : ``}</div>`;
});
var FormFeedback = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["class", "valid", "tooltip"]);
  let { class: className = "" } = $$props;
  let { valid = void 0 } = $$props;
  let { tooltip = false } = $$props;
  let classes;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0)
    $$bindings.valid(valid);
  if ($$props.tooltip === void 0 && $$bindings.tooltip && tooltip !== void 0)
    $$bindings.tooltip(tooltip);
  {
    {
      const validMode = tooltip ? "tooltip" : "feedback";
      classes = classnames(className, valid ? `valid-${validMode}` : `invalid-${validMode}`);
    }
  }
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</div>`;
});
var InlineContainer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div>${slots.default ? slots.default({}) : ``}</div>`;
});
var Input = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, [
    "class",
    "bsSize",
    "checked",
    "color",
    "disabled",
    "feedback",
    "files",
    "group",
    "inner",
    "invalid",
    "label",
    "multiple",
    "name",
    "placeholder",
    "plaintext",
    "readonly",
    "size",
    "type",
    "valid",
    "value"
  ]);
  let { class: className = "" } = $$props;
  let { bsSize = void 0 } = $$props;
  let { checked = false } = $$props;
  let { color = void 0 } = $$props;
  let { disabled = void 0 } = $$props;
  let { feedback = void 0 } = $$props;
  let { files = void 0 } = $$props;
  let { group = void 0 } = $$props;
  let { inner = void 0 } = $$props;
  let { invalid = false } = $$props;
  let { label = void 0 } = $$props;
  let { multiple = void 0 } = $$props;
  let { name = "" } = $$props;
  let { placeholder = "" } = $$props;
  let { plaintext = false } = $$props;
  let { readonly = void 0 } = $$props;
  let { size = void 0 } = $$props;
  let { type = "text" } = $$props;
  let { valid = false } = $$props;
  let { value = "" } = $$props;
  let classes;
  let tag;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.bsSize === void 0 && $$bindings.bsSize && bsSize !== void 0)
    $$bindings.bsSize(bsSize);
  if ($$props.checked === void 0 && $$bindings.checked && checked !== void 0)
    $$bindings.checked(checked);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.feedback === void 0 && $$bindings.feedback && feedback !== void 0)
    $$bindings.feedback(feedback);
  if ($$props.files === void 0 && $$bindings.files && files !== void 0)
    $$bindings.files(files);
  if ($$props.group === void 0 && $$bindings.group && group !== void 0)
    $$bindings.group(group);
  if ($$props.inner === void 0 && $$bindings.inner && inner !== void 0)
    $$bindings.inner(inner);
  if ($$props.invalid === void 0 && $$bindings.invalid && invalid !== void 0)
    $$bindings.invalid(invalid);
  if ($$props.label === void 0 && $$bindings.label && label !== void 0)
    $$bindings.label(label);
  if ($$props.multiple === void 0 && $$bindings.multiple && multiple !== void 0)
    $$bindings.multiple(multiple);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.placeholder === void 0 && $$bindings.placeholder && placeholder !== void 0)
    $$bindings.placeholder(placeholder);
  if ($$props.plaintext === void 0 && $$bindings.plaintext && plaintext !== void 0)
    $$bindings.plaintext(plaintext);
  if ($$props.readonly === void 0 && $$bindings.readonly && readonly !== void 0)
    $$bindings.readonly(readonly);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.valid === void 0 && $$bindings.valid && valid !== void 0)
    $$bindings.valid(valid);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      {
        const isNotaNumber = new RegExp("\\D", "g");
        let isBtn = false;
        let formControlClass = "form-control";
        tag = "input";
        switch (type) {
          case "color":
            formControlClass = `form-control form-control-color`;
            break;
          case "range":
            formControlClass = "form-range";
            break;
          case "select":
            formControlClass = `form-select`;
            tag = "select";
            break;
          case "textarea":
            tag = "textarea";
            break;
          case "button":
          case "reset":
          case "submit":
            formControlClass = `btn btn-${color || "secondary"}`;
            isBtn = true;
            break;
          case "hidden":
          case "image":
            formControlClass = void 0;
            break;
          default:
            formControlClass = "form-control";
            tag = "input";
        }
        if (plaintext) {
          formControlClass = `${formControlClass}-plaintext`;
          tag = "input";
        }
        if (size && isNotaNumber.test(size)) {
          console.warn(`Please use the prop "bsSize" instead of the "size" to bootstrap's input sizing.`);
          bsSize = size;
          size = void 0;
        }
        classes = classnames(className, formControlClass, {
          "is-invalid": invalid,
          "is-valid": valid,
          [`form-control-${bsSize}`]: bsSize && !isBtn,
          [`btn-${bsSize}`]: bsSize && isBtn
        });
      }
    }
    $$rendered = `${tag === "input" ? `${type === "text" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "text" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { size: escape_attribute_value(size) }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "password" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "password" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { size: escape_attribute_value(size) }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "color" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "color" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "email" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "email" },
      { disabled: disabled || null },
      { multiple: multiple || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { size: escape_attribute_value(size) }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "file" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "file" },
      { disabled: disabled || null },
      { invalid: escape_attribute_value(invalid) },
      { multiple: multiple || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { valid: escape_attribute_value(valid) }
    ])}>` : `${type === "checkbox" || type === "radio" || type === "switch" ? `${validate_component(FormCheck, "FormCheck").$$render($$result, Object.assign($$restProps, { class: className }, { size: bsSize }, { type }, { disabled }, { invalid }, { label }, { name }, { placeholder }, { readonly }, { valid }, { checked }, { inner }, { group }, { value }), {
      checked: ($$value) => {
        checked = $$value;
        $$settled = false;
      },
      inner: ($$value) => {
        inner = $$value;
        $$settled = false;
      },
      group: ($$value) => {
        group = $$value;
        $$settled = false;
      },
      value: ($$value) => {
        value = $$value;
        $$settled = false;
      }
    }, {})}` : `${type === "url" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "url" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { size: escape_attribute_value(size) }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "number" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "number" },
      { readonly: readonly || null },
      { name: escape_attribute_value(name) },
      { disabled: disabled || null },
      {
        placeholder: escape_attribute_value(placeholder)
      }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "date" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "date" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "time" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "time" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "datetime" ? `<input${spread([
      escape_object($$restProps),
      { type: "datetime" },
      { readonly: readonly || null },
      { class: escape_attribute_value(classes) },
      { name: escape_attribute_value(name) },
      { disabled: disabled || null },
      {
        placeholder: escape_attribute_value(placeholder)
      }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "datetime-local" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "datetime-local" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "month" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "month" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "color" ? `<input${spread([
      escape_object($$restProps),
      { type: "color" },
      { readonly: readonly || null },
      { class: escape_attribute_value(classes) },
      { name: escape_attribute_value(name) },
      { disabled: disabled || null },
      {
        placeholder: escape_attribute_value(placeholder)
      }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "range" ? `<input${spread([
      escape_object($$restProps),
      { type: "range" },
      { readonly: readonly || null },
      { class: escape_attribute_value(classes) },
      { name: escape_attribute_value(name) },
      { disabled: disabled || null },
      {
        placeholder: escape_attribute_value(placeholder)
      }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "search" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "search" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { size: escape_attribute_value(size) }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "tel" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "tel" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null },
      { size: escape_attribute_value(size) }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `${type === "week" ? `<input${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { type: "week" },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("value", value, 0)}${add_attribute("this", inner, 0)}>` : `<input${spread([
      escape_object($$restProps),
      { type: escape_attribute_value(type) },
      { readonly: readonly || null },
      { class: escape_attribute_value(classes) },
      { name: escape_attribute_value(name) },
      { disabled: disabled || null },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { value: escape_attribute_value(value) }
    ])}>`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}`}` : `${tag === "textarea" ? `<textarea${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { disabled: disabled || null },
      { name: escape_attribute_value(name) },
      {
        placeholder: escape_attribute_value(placeholder)
      },
      { readonly: readonly || null }
    ])}${add_attribute("this", inner, 0)}>${value || ""}</textarea>` : `${tag === "select" && !multiple ? `<select${spread([
      escape_object($$restProps),
      { class: escape_attribute_value(classes) },
      { name: escape_attribute_value(name) },
      { disabled: disabled || null },
      { readonly: readonly || null }
    ])}${add_attribute("this", inner, 0)}>${slots.default ? slots.default({}) : ``}</select>

  ` : ``}`}`}
${feedback ? `${Array.isArray(feedback) ? `${each(feedback, (msg) => `${validate_component(FormFeedback, "FormFeedback").$$render($$result, { valid }, {}, { default: () => `${escape(msg)}` })}`)}` : `${validate_component(FormFeedback, "FormFeedback").$$render($$result, { valid }, {}, { default: () => `${escape(feedback)}` })}`}` : ``}`;
  } while (!$$settled);
  return $$rendered;
});
var Label = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "hidden", "check", "size", "for", "xs", "sm", "md", "lg", "xl", "xxl", "widths"]);
  let { class: className = "" } = $$props;
  let { hidden = false } = $$props;
  let { check = false } = $$props;
  let { size = "" } = $$props;
  let { for: fore = null } = $$props;
  let { xs = "" } = $$props;
  let { sm = "" } = $$props;
  let { md = "" } = $$props;
  let { lg = "" } = $$props;
  let { xl = "" } = $$props;
  let { xxl = "" } = $$props;
  const colWidths = { xs, sm, md, lg, xl, xxl };
  let { widths = Object.keys(colWidths) } = $$props;
  const colClasses = [];
  widths.forEach((colWidth) => {
    let columnProp = $$props[colWidth];
    if (!columnProp && columnProp !== "") {
      return;
    }
    const isXs = colWidth === "xs";
    let colClass;
    if (isObject(columnProp)) {
      const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
      colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
      colClasses.push(classnames({
        [colClass]: columnProp.size || columnProp.size === "",
        [`order${colSizeInterfix}${columnProp.order}`]: columnProp.order || columnProp.order === 0,
        [`offset${colSizeInterfix}${columnProp.offset}`]: columnProp.offset || columnProp.offset === 0
      }));
    } else {
      colClass = getColumnSizeClass(isXs, colWidth, columnProp);
      colClasses.push(colClass);
    }
  });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.hidden === void 0 && $$bindings.hidden && hidden !== void 0)
    $$bindings.hidden(hidden);
  if ($$props.check === void 0 && $$bindings.check && check !== void 0)
    $$bindings.check(check);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.for === void 0 && $$bindings.for && fore !== void 0)
    $$bindings.for(fore);
  if ($$props.xs === void 0 && $$bindings.xs && xs !== void 0)
    $$bindings.xs(xs);
  if ($$props.sm === void 0 && $$bindings.sm && sm !== void 0)
    $$bindings.sm(sm);
  if ($$props.md === void 0 && $$bindings.md && md !== void 0)
    $$bindings.md(md);
  if ($$props.lg === void 0 && $$bindings.lg && lg !== void 0)
    $$bindings.lg(lg);
  if ($$props.xl === void 0 && $$bindings.xl && xl !== void 0)
    $$bindings.xl(xl);
  if ($$props.xxl === void 0 && $$bindings.xxl && xxl !== void 0)
    $$bindings.xxl(xxl);
  if ($$props.widths === void 0 && $$bindings.widths && widths !== void 0)
    $$bindings.widths(widths);
  classes = classnames(className, hidden ? "visually-hidden" : false, check ? "form-check-label" : false, size ? `col-form-label-${size}` : false, colClasses, colClasses.length ? "col-form-label" : "form-label");
  return `<label${spread([
    escape_object($$restProps),
    { class: escape_attribute_value(classes) },
    { for: escape_attribute_value(fore) }
  ])}>${slots.default ? slots.default({}) : ``}</label>`;
});
var ListGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "flush", "numbered"]);
  let { class: className = "" } = $$props;
  let { flush = false } = $$props;
  let { numbered = false } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.flush === void 0 && $$bindings.flush && flush !== void 0)
    $$bindings.flush(flush);
  if ($$props.numbered === void 0 && $$bindings.numbered && numbered !== void 0)
    $$bindings.numbered(numbered);
  classes = classnames(className, "list-group", {
    "list-group-flush": flush,
    "list-group-numbered": numbered
  });
  return `${numbered ? `<ol${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</ol>` : `<ul${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</ul>`}`;
});
var ListGroupItem = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "active", "disabled", "color", "action", "href", "tag"]);
  let { class: className = "" } = $$props;
  let { active = false } = $$props;
  let { disabled = false } = $$props;
  let { color = "" } = $$props;
  let { action = false } = $$props;
  let { href = null } = $$props;
  let { tag = null } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.active === void 0 && $$bindings.active && active !== void 0)
    $$bindings.active(active);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  classes = classnames(className, "list-group-item", {
    active,
    disabled,
    "list-group-item-action": action || tag === "button",
    [`list-group-item-${color}`]: color
  });
  return `${href ? `<a${spread([
    escape_object($$restProps),
    { class: escape_attribute_value(classes) },
    { href: escape_attribute_value(href) },
    { disabled: disabled || null },
    { active: escape_attribute_value(active) }
  ])}>${slots.default ? slots.default({}) : ``}</a>` : `${tag === "button" ? `<button${spread([
    escape_object($$restProps),
    { class: escape_attribute_value(classes) },
    { type: "button" },
    { disabled: disabled || null },
    { active: escape_attribute_value(active) }
  ])}>${slots.default ? slots.default({}) : ``}</button>` : `<li${spread([
    escape_object($$restProps),
    { class: escape_attribute_value(classes) },
    { disabled: disabled || null },
    { active: escape_attribute_value(active) }
  ])}>${slots.default ? slots.default({}) : ``}</li>`}`}`;
});
var ModalBackdrop = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "isOpen", "fade"]);
  let { class: className = "" } = $$props;
  let { isOpen = false } = $$props;
  let { fade = true } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.fade === void 0 && $$bindings.fade && fade !== void 0)
    $$bindings.fade(fade);
  classes = classnames(className, "modal-backdrop");
  return `${isOpen ? `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }], fade ? "fade" : "")}></div>` : ``}`;
});
var Portal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, []);
  let ref;
  let portal;
  onDestroy(() => {
    if (typeof document !== "undefined") {
      document.body.removeChild(portal);
    }
  });
  return `<div${spread([escape_object($$restProps)])}${add_attribute("this", ref, 0)}>${slots.default ? slots.default({}) : ``}</div>`;
});
var css$5 = {
  code: ".modal-open{overflow:hidden;padding-right:0}",
  map: `{"version":3,"file":"Modal.svelte","sources":["Modal.svelte"],"sourcesContent":["<script context=\\"module\\">\\n  // TODO fade option\\n  let openCount = 0;\\n<\/script>\\n\\n<script>\\n  import classnames from './utils';\\n  import { browserEvent } from './utils';\\n  import {\\n    createEventDispatcher,\\n    onDestroy,\\n    onMount,\\n    afterUpdate\\n  } from 'svelte';\\n  import { modalIn, modalOut } from './transitions';\\n  import InlineContainer from './InlineContainer.svelte';\\n  import ModalBackdrop from './ModalBackdrop.svelte';\\n  import ModalBody from './ModalBody.svelte';\\n  import ModalHeader from './ModalHeader.svelte';\\n  import Portal from './Portal.svelte';\\n  import {\\n    conditionallyUpdateScrollbar,\\n    getOriginalBodyPadding,\\n    setScrollbarWidth\\n  } from './utils';\\n\\n  const dispatch = createEventDispatcher();\\n\\n  let className = '';\\n  let staticModal = false;\\n  export { className as class };\\n  export { staticModal as static };\\n  export let isOpen = false;\\n  export let autoFocus = true;\\n  export let body = false;\\n  export let centered = false;\\n  export let container = undefined;\\n  export let fullscreen = false;\\n  export let header = undefined;\\n  export let scrollable = false;\\n  export let size = '';\\n  export let toggle = undefined;\\n  export let labelledBy = '';\\n  export let backdrop = true;\\n  export let wrapClassName = '';\\n  export let modalClassName = '';\\n  export let contentClassName = '';\\n  export let fade = true;\\n  export let unmountOnClose = true;\\n  export let returnFocusAfterClose = true;\\n\\n  let hasOpened = false;\\n  let _isMounted = false;\\n  let _triggeringElement;\\n  let _originalBodyPadding;\\n  let _lastIsOpen = isOpen;\\n  let _lastHasOpened = hasOpened;\\n  let _dialog;\\n  let _mouseDownElement;\\n  let _removeEscListener;\\n\\n  onMount(() => {\\n    if (isOpen) {\\n      init();\\n      hasOpened = true;\\n    }\\n\\n    if (hasOpened && autoFocus) {\\n      setFocus();\\n    }\\n  });\\n\\n  onDestroy(() => {\\n    destroy();\\n    if (hasOpened) {\\n      close();\\n    }\\n  });\\n\\n  afterUpdate(() => {\\n    if (isOpen && !_lastIsOpen) {\\n      init();\\n      hasOpened = true;\\n    }\\n\\n    if (autoFocus && hasOpened && !_lastHasOpened) {\\n      setFocus();\\n    }\\n\\n    _lastIsOpen = isOpen;\\n    _lastHasOpened = hasOpened;\\n  });\\n\\n  function setFocus() {\\n    if (\\n      _dialog &&\\n      _dialog.parentNode &&\\n      typeof _dialog.parentNode.focus === 'function'\\n    ) {\\n      _dialog.parentNode.focus();\\n    }\\n  }\\n\\n  function init() {\\n    try {\\n      _triggeringElement = document.activeElement;\\n    } catch (err) {\\n      _triggeringElement = null;\\n    }\\n\\n    if (!staticModal) {\\n      _originalBodyPadding = getOriginalBodyPadding();\\n      conditionallyUpdateScrollbar();\\n      if (openCount === 0) {\\n        document.body.className = classnames(\\n          document.body.className,\\n          'modal-open'\\n        );\\n      }\\n\\n      ++openCount;\\n    }\\n    _isMounted = true;\\n  }\\n\\n  function manageFocusAfterClose() {\\n    if (_triggeringElement) {\\n      if (\\n        typeof _triggeringElement.focus === 'function' &&\\n        returnFocusAfterClose\\n      ) {\\n        _triggeringElement.focus();\\n      }\\n\\n      _triggeringElement = null;\\n    }\\n  }\\n\\n  function destroy() {\\n    manageFocusAfterClose();\\n  }\\n\\n  function close() {\\n    if (openCount <= 1) {\\n      document.body.classList.remove('modal-open');\\n    }\\n\\n    manageFocusAfterClose();\\n    openCount = Math.max(0, openCount - 1);\\n\\n    setScrollbarWidth(_originalBodyPadding);\\n  }\\n\\n  function handleBackdropClick(e) {\\n    if (e.target === _mouseDownElement) {\\n      e.stopPropagation();\\n      if (!isOpen || !backdrop) {\\n        return;\\n      }\\n\\n      const backdropElem = _dialog ? _dialog.parentNode : null;\\n      if (\\n        backdrop === true &&\\n        backdropElem &&\\n        e.target === backdropElem &&\\n        toggle\\n      ) {\\n        toggle(e);\\n      }\\n    }\\n  }\\n\\n  function onModalOpened() {\\n    dispatch('open');\\n    _removeEscListener = browserEvent(document, 'keydown', (event) => {\\n      if (event.key && event.key === 'Escape') {\\n        if (toggle && backdrop === true) toggle(event);\\n      }\\n    });\\n  }\\n\\n  function onModalClosed() {\\n    dispatch('close');\\n    if (_removeEscListener) {\\n      _removeEscListener();\\n    }\\n\\n    if (unmountOnClose) {\\n      destroy();\\n    }\\n    close();\\n    if (_isMounted) {\\n      hasOpened = false;\\n    }\\n    _isMounted = false;\\n  }\\n\\n  function handleBackdropMouseDown(e) {\\n    _mouseDownElement = e.target;\\n  }\\n\\n  const dialogBaseClass = 'modal-dialog';\\n\\n  $: classes = classnames(dialogBaseClass, className, {\\n    [\`modal-\${size}\`]: size,\\n    'modal-fullscreen': fullscreen === true,\\n    [\`modal-fullscreen-\${fullscreen}-down\`]:\\n      fullscreen && typeof fullscreen === 'string',\\n    [\`\${dialogBaseClass}-centered\`]: centered,\\n    [\`\${dialogBaseClass}-scrollable\`]: scrollable\\n  });\\n\\n  $: outer = container === 'inline' || staticModal ? InlineContainer : Portal;\\n<\/script>\\n\\n{#if _isMounted}\\n  <svelte:component this={outer}>\\n    <div class={wrapClassName} tabindex=\\"-1\\" {...$$restProps}>\\n      {#if isOpen}\\n        <div\\n          in:modalIn\\n          out:modalOut\\n          ariaLabelledby={labelledBy}\\n          class={classnames('modal', modalClassName, {\\n            fade,\\n            'position-static': staticModal\\n          })}\\n          role=\\"dialog\\"\\n          on:introstart={() => dispatch('opening')}\\n          on:introend={onModalOpened}\\n          on:outrostart={() => dispatch('closing')}\\n          on:outroend={onModalClosed}\\n          on:click={handleBackdropClick}\\n          on:mousedown={handleBackdropMouseDown}\\n        >\\n          <slot name=\\"external\\" />\\n          <div class={classes} role=\\"document\\" bind:this={_dialog}>\\n            <div class={classnames('modal-content', contentClassName)}>\\n              {#if header}\\n                <ModalHeader {toggle}>\\n                  {header}\\n                </ModalHeader>\\n              {/if}\\n              {#if body}\\n                <ModalBody>\\n                  <slot />\\n                </ModalBody>\\n              {:else}\\n                <slot />\\n              {/if}\\n            </div>\\n          </div>\\n        </div>\\n      {/if}\\n    </div>\\n  </svelte:component>\\n{/if}\\n{#if backdrop && !staticModal}\\n  <svelte:component this={outer}>\\n    <ModalBackdrop {fade} {isOpen} />\\n  </svelte:component>\\n{/if}\\n\\n<style>\\n  :global(.modal-open) {\\n    overflow: hidden;\\n    padding-right: 0;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAwQU,WAAW,AAAE,CAAC,AACpB,QAAQ,CAAE,MAAM,CAChB,aAAa,CAAE,CAAC,AAClB,CAAC"}`
};
var dialogBaseClass = "modal-dialog";
var Modal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let outer;
  compute_rest_props($$props, [
    "class",
    "static",
    "isOpen",
    "autoFocus",
    "body",
    "centered",
    "container",
    "fullscreen",
    "header",
    "scrollable",
    "size",
    "toggle",
    "labelledBy",
    "backdrop",
    "wrapClassName",
    "modalClassName",
    "contentClassName",
    "fade",
    "unmountOnClose",
    "returnFocusAfterClose"
  ]);
  createEventDispatcher();
  let { class: className = "" } = $$props;
  let { static: staticModal = false } = $$props;
  let { isOpen = false } = $$props;
  let { autoFocus = true } = $$props;
  let { body = false } = $$props;
  let { centered = false } = $$props;
  let { container = void 0 } = $$props;
  let { fullscreen = false } = $$props;
  let { header = void 0 } = $$props;
  let { scrollable = false } = $$props;
  let { size = "" } = $$props;
  let { toggle = void 0 } = $$props;
  let { labelledBy = "" } = $$props;
  let { backdrop = true } = $$props;
  let { wrapClassName = "" } = $$props;
  let { modalClassName = "" } = $$props;
  let { contentClassName = "" } = $$props;
  let { fade = true } = $$props;
  let { unmountOnClose = true } = $$props;
  let { returnFocusAfterClose = true } = $$props;
  onDestroy(() => {
  });
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.static === void 0 && $$bindings.static && staticModal !== void 0)
    $$bindings.static(staticModal);
  if ($$props.isOpen === void 0 && $$bindings.isOpen && isOpen !== void 0)
    $$bindings.isOpen(isOpen);
  if ($$props.autoFocus === void 0 && $$bindings.autoFocus && autoFocus !== void 0)
    $$bindings.autoFocus(autoFocus);
  if ($$props.body === void 0 && $$bindings.body && body !== void 0)
    $$bindings.body(body);
  if ($$props.centered === void 0 && $$bindings.centered && centered !== void 0)
    $$bindings.centered(centered);
  if ($$props.container === void 0 && $$bindings.container && container !== void 0)
    $$bindings.container(container);
  if ($$props.fullscreen === void 0 && $$bindings.fullscreen && fullscreen !== void 0)
    $$bindings.fullscreen(fullscreen);
  if ($$props.header === void 0 && $$bindings.header && header !== void 0)
    $$bindings.header(header);
  if ($$props.scrollable === void 0 && $$bindings.scrollable && scrollable !== void 0)
    $$bindings.scrollable(scrollable);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  if ($$props.labelledBy === void 0 && $$bindings.labelledBy && labelledBy !== void 0)
    $$bindings.labelledBy(labelledBy);
  if ($$props.backdrop === void 0 && $$bindings.backdrop && backdrop !== void 0)
    $$bindings.backdrop(backdrop);
  if ($$props.wrapClassName === void 0 && $$bindings.wrapClassName && wrapClassName !== void 0)
    $$bindings.wrapClassName(wrapClassName);
  if ($$props.modalClassName === void 0 && $$bindings.modalClassName && modalClassName !== void 0)
    $$bindings.modalClassName(modalClassName);
  if ($$props.contentClassName === void 0 && $$bindings.contentClassName && contentClassName !== void 0)
    $$bindings.contentClassName(contentClassName);
  if ($$props.fade === void 0 && $$bindings.fade && fade !== void 0)
    $$bindings.fade(fade);
  if ($$props.unmountOnClose === void 0 && $$bindings.unmountOnClose && unmountOnClose !== void 0)
    $$bindings.unmountOnClose(unmountOnClose);
  if ($$props.returnFocusAfterClose === void 0 && $$bindings.returnFocusAfterClose && returnFocusAfterClose !== void 0)
    $$bindings.returnFocusAfterClose(returnFocusAfterClose);
  $$result.css.add(css$5);
  classnames(dialogBaseClass, className, {
    [`modal-${size}`]: size,
    "modal-fullscreen": fullscreen === true,
    [`modal-fullscreen-${fullscreen}-down`]: fullscreen && typeof fullscreen === "string",
    [`${dialogBaseClass}-centered`]: centered,
    [`${dialogBaseClass}-scrollable`]: scrollable
  });
  outer = container === "inline" || staticModal ? InlineContainer : Portal;
  return `${``}
${backdrop && !staticModal ? `${validate_component(outer || missing_component, "svelte:component").$$render($$result, {}, {}, {
    default: () => `${validate_component(ModalBackdrop, "ModalBackdrop").$$render($$result, { fade, isOpen }, {}, {})}`
  })}` : ``}`;
});
function getCols(cols) {
  const colsValue = parseInt(cols);
  if (!isNaN(colsValue)) {
    if (colsValue > 0) {
      return [`row-cols-${colsValue}`];
    }
  } else if (typeof cols === "object") {
    return ["xs", "sm", "md", "lg", "xl"].map((colWidth) => {
      const isXs = colWidth === "xs";
      const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
      const value = cols[colWidth];
      if (typeof value === "number" && value > 0) {
        return `row-cols${colSizeInterfix}${value}`;
      }
      return null;
    }).filter((value) => !!value);
  }
  return [];
}
var Row = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let classes;
  let $$restProps = compute_rest_props($$props, ["class", "noGutters", "form", "cols"]);
  let { class: className = "" } = $$props;
  let { noGutters = false } = $$props;
  let { form = false } = $$props;
  let { cols = 0 } = $$props;
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.noGutters === void 0 && $$bindings.noGutters && noGutters !== void 0)
    $$bindings.noGutters(noGutters);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.cols === void 0 && $$bindings.cols && cols !== void 0)
    $$bindings.cols(cols);
  classes = classnames(className, noGutters ? "gx-0" : null, form ? "form-row" : "row", ...getCols(cols));
  return `<div${spread([escape_object($$restProps), { class: escape_attribute_value(classes) }])}>${slots.default ? slots.default({}) : ``}</div>`;
});
var css$4 = {
  code: "@media(min-width: 768px){img.svelte-phggye{object-fit:cover;height:100%;width:100%}}.imageContainer.svelte-phggye{width:20rem!important;max-height:20rem;overflow:hidden;padding-top:1rem;cursor:pointer}.galleryContainer.svelte-phggye{overflow-y:scroll;max-height:60vh;width:80vw;position:absolute;left:50%;margin-left:-40vw}",
  map: `{"version":3,"file":"gallery.svelte","sources":["gallery.svelte"],"sourcesContent":["<style>\\n    @media (min-width: 768px) {\\n        img {\\n            object-fit: cover;\\n            height: 100%;\\n            width: 100%;\\n        }\\n    }\\n    .imageContainer {\\n        width: 20rem!important;\\n        max-height: 20rem;\\n        overflow: hidden;\\n        padding-top: 1rem;\\n        cursor: pointer;\\n    }\\n    .galleryContainer {\\n        overflow-y: scroll;\\n        max-height: 60vh;\\n        width: 80vw;\\n        position: absolute;\\n        left: 50%;\\n        margin-left: -40vw;\\n    }\\n</style>\\n<script>\\n    import { Modal, ModalBody } from 'sveltestrap';\\n    import { NUM_IMAGES } from '../constants';\\n    const imageURIs = Array(NUM_IMAGES).fill().map((_, index) => \`CroppedCouplePictures/\${index}.jpg\`);\\n    let imageSrcForModal = '';\\n    let showModal = false;\\n    const toggle = () => (showModal = !showModal);\\n    const handleClick = (imgSrc) => {\\n        imageSrcForModal=imgSrc;\\n        toggle();\\n    }\\n\\n<\/script>\\n\\n<h1>Gallery</h1>\\n<p>Here's a bunch of pictures of us, in case you don't know what we look like!</p>\\n<div class=\\"galleryContainer d-flex flex-wrap justify-content-around\\">\\n    {#each imageURIs as imgSrc, i}\\n    <div class=\\"imageContainer\\" on:click={() => {handleClick(imgSrc)}} data-toggle=\\"modal\\" data-target=\\"#showcaseModal\\">\\n        <img class=\\"img-fluid rounded\\" src={imgSrc} alt={\`Picture \${i+1} of Adrian and Jenny\`}>\\n    </div>\\n    {/each}\\n</div>\\n\\n<Modal body isOpen={showModal} size=\\"lg\\" {toggle} aria-describedby=\\"A modal for enlarging a picture in the gallery\\">\\n    <img class=\\"rounded w-100\\" src={imageSrcForModal} alt=\\"Adrian and Jenny\\" />\\n</Modal>\\n"],"names":[],"mappings":"AACI,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACvB,GAAG,cAAC,CAAC,AACD,UAAU,CAAE,KAAK,CACjB,MAAM,CAAE,IAAI,CACZ,KAAK,CAAE,IAAI,AACf,CAAC,AACL,CAAC,AACD,eAAe,cAAC,CAAC,AACb,KAAK,CAAE,KAAK,UAAU,CACtB,UAAU,CAAE,KAAK,CACjB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,IAAI,CACjB,MAAM,CAAE,OAAO,AACnB,CAAC,AACD,iBAAiB,cAAC,CAAC,AACf,UAAU,CAAE,MAAM,CAClB,UAAU,CAAE,IAAI,CAChB,KAAK,CAAE,IAAI,CACX,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,GAAG,CACT,WAAW,CAAE,KAAK,AACtB,CAAC"}`
};
var Gallery = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const imageURIs = Array(NUM_IMAGES).fill().map((_, index2) => `CroppedCouplePictures/${index2}.jpg`);
  let imageSrcForModal = "";
  let showModal = false;
  const toggle = () => showModal = !showModal;
  $$result.css.add(css$4);
  return `<h1>Gallery</h1>
<p>Here&#39;s a bunch of pictures of us, in case you don&#39;t know what we look like!</p>
<div class="${"galleryContainer d-flex flex-wrap justify-content-around svelte-phggye"}">${each(imageURIs, (imgSrc, i) => `<div class="${"imageContainer svelte-phggye"}" data-toggle="${"modal"}" data-target="${"#showcaseModal"}"><img class="${"img-fluid rounded svelte-phggye"}"${add_attribute("src", imgSrc, 0)}${add_attribute("alt", `Picture ${i + 1} of Adrian and Jenny`, 0)}>
    </div>`)}</div>

${validate_component(Modal, "Modal").$$render($$result, {
    body: true,
    isOpen: showModal,
    size: "lg",
    toggle,
    "aria-describedby": "A modal for enlarging a picture in the gallery"
  }, {}, {
    default: () => `<img class="${"rounded w-100 svelte-phggye"}"${add_attribute("src", imageSrcForModal, 0)} alt="${"Adrian and Jenny"}">`
  })}`;
});
var gallery = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Gallery
});
var css$3 = {
  code: "ul.svelte-1frg2tf{margin:0 0 1em 0;line-height:1.5}",
  map: '{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script context=\\"module\\">\\n\\texport function load({ fetch }) {\\n\\t\\treturn fetch(`updates.json`).then(r => r.json()).then(posts => {\\n\\t\\t\\treturn {props: { posts }};\\n\\t\\t}).catch((error) => ({ error }));\\n\\t}\\n<\/script>\\n\\n<script>\\n\\texport let posts;\\n<\/script>\\n\\n<style>\\n\\tul {\\n\\t\\tmargin: 0 0 1em 0;\\n\\t\\tline-height: 1.5;\\n\\t}\\n</style>\\n\\n<svelte:head>\\n\\t<title>Blog</title>\\n</svelte:head>\\n\\n<h1>Event Updates</h1>\\n<p>Be sure to check back here occasionally for new info about the event!</p>\\n<ul>\\n\\t{#each posts as post}\\n\\t\\t<!-- we\'re using the non-standard `rel=prefetch` attribute to\\n\\t\\t\\t\\ttell Sapper to load the data for the page as soon as\\n\\t\\t\\t\\tthe user hovers over the link or taps it, instead of\\n\\t\\t\\t\\twaiting for the \'click\' event -->\\n\\t\\t<li><a rel=\\"prefetch\\" href=\\"updates/{post.slug}\\">{post.title}</a></li>\\n\\t{/each}\\n</ul>\\n"],"names":[],"mappings":"AAaC,EAAE,eAAC,CAAC,AACH,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CACjB,WAAW,CAAE,GAAG,AACjB,CAAC"}'
};
function load$2({ fetch: fetch2 }) {
  return fetch2(`updates.json`).then((r) => r.json()).then((posts2) => {
    return { props: { posts: posts2 } };
  }).catch((error2) => ({ error: error2 }));
}
var Updates = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { posts: posts2 } = $$props;
  if ($$props.posts === void 0 && $$bindings.posts && posts2 !== void 0)
    $$bindings.posts(posts2);
  $$result.css.add(css$3);
  return `${$$result.head += `${$$result.title = `<title>Blog</title>`, ""}`, ""}

<h1>Event Updates</h1>
<p>Be sure to check back here occasionally for new info about the event!</p>
<ul class="${"svelte-1frg2tf"}">${each(posts2, (post) => `
		<li><a rel="${"prefetch"}" href="${"updates/" + escape(post.slug)}">${escape(post.title)}</a></li>`)}</ul>`;
});
var index$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Updates,
  load: load$2
});
var css$2 = {
  code: ".content.svelte-emm3f3 h2{font-size:1.4em;font-weight:500}.content.svelte-emm3f3 pre{background-color:#f9f9f9;box-shadow:inset 1px 1px 5px rgba(0, 0, 0, 0.05);padding:0.5em;border-radius:2px;overflow-x:auto}.content.svelte-emm3f3 pre code{background-color:transparent;padding:0}.content.svelte-emm3f3 ul{line-height:1.5}.content.svelte-emm3f3 li{margin:0 0 0.5em 0}",
  map: '{"version":3,"file":"[slug].svelte","sources":["[slug].svelte"],"sourcesContent":["<script context=\\"module\\">\\n\\texport async function load({ page: { params }, fetch }) {\\n\\t\\t// the `slug` parameter is available because\\n\\t\\t// this file is called [slug].svelte\\n\\t\\tconst res = await fetch(`/updates/${params.slug}.json`);\\n\\t\\tconst data = await res.json();\\n\\n\\t\\tconst content = await fetch(`/blog-posts/${params.slug}.html`).then(res => res.text());\\n\\n\\t\\tif (res.status === 200) {\\n\\t\\t\\treturn { props: { post: {...data, content} } };\\n\\t\\t} else {\\n\\t\\t\\treturn { error: data.message };\\n\\t\\t}\\n\\t}\\n<\/script>\\n\\n<script>\\n\\texport let post;\\n<\/script>\\n\\n<style>\\n\\t/*\\n\\t\\tBy default, CSS is locally scoped to the component,\\n\\t\\tand any unused styles are dead-code-eliminated.\\n\\t\\tIn this page, Svelte can\'t know which elements are\\n\\t\\tgoing to appear inside the {{{post.html}}} block,\\n\\t\\tso we have to use the :global(...) modifier to target\\n\\t\\tall elements inside .content\\n\\t*/\\n\\t.content :global(h2) {\\n\\t\\tfont-size: 1.4em;\\n\\t\\tfont-weight: 500;\\n\\t}\\n\\n\\t.content :global(pre) {\\n\\t\\tbackground-color: #f9f9f9;\\n\\t\\tbox-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);\\n\\t\\tpadding: 0.5em;\\n\\t\\tborder-radius: 2px;\\n\\t\\toverflow-x: auto;\\n\\t}\\n\\n\\t.content :global(pre) :global(code) {\\n\\t\\tbackground-color: transparent;\\n\\t\\tpadding: 0;\\n\\t}\\n\\n\\t.content :global(ul) {\\n\\t\\tline-height: 1.5;\\n\\t}\\n\\n\\t.content :global(li) {\\n\\t\\tmargin: 0 0 0.5em 0;\\n\\t}\\n</style>\\n\\n<svelte:head>\\n\\t<title>{post.title}</title>\\n</svelte:head>\\n\\n<h1>{post.title}</h1>\\n\\n<div class=\\"content\\">\\n\\t{@html post.content}\\n</div>\\n"],"names":[],"mappings":"AA8BC,sBAAQ,CAAC,AAAQ,EAAE,AAAE,CAAC,AACrB,SAAS,CAAE,KAAK,CAChB,WAAW,CAAE,GAAG,AACjB,CAAC,AAED,sBAAQ,CAAC,AAAQ,GAAG,AAAE,CAAC,AACtB,gBAAgB,CAAE,OAAO,CACzB,UAAU,CAAE,KAAK,CAAC,GAAG,CAAC,GAAG,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CACjD,OAAO,CAAE,KAAK,CACd,aAAa,CAAE,GAAG,CAClB,UAAU,CAAE,IAAI,AACjB,CAAC,AAED,sBAAQ,CAAC,AAAQ,GAAG,AAAC,CAAC,AAAQ,IAAI,AAAE,CAAC,AACpC,gBAAgB,CAAE,WAAW,CAC7B,OAAO,CAAE,CAAC,AACX,CAAC,AAED,sBAAQ,CAAC,AAAQ,EAAE,AAAE,CAAC,AACrB,WAAW,CAAE,GAAG,AACjB,CAAC,AAED,sBAAQ,CAAC,AAAQ,EAAE,AAAE,CAAC,AACrB,MAAM,CAAE,CAAC,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,AACpB,CAAC"}'
};
async function load$1({ page: { params }, fetch: fetch2 }) {
  const res = await fetch2(`/updates/${params.slug}.json`);
  const data = await res.json();
  const content = await fetch2(`/blog-posts/${params.slug}.html`).then((res2) => res2.text());
  if (res.status === 200) {
    return { props: { post: { ...data, content } } };
  } else {
    return { error: data.message };
  }
}
var U5Bslugu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { post } = $$props;
  if ($$props.post === void 0 && $$bindings.post && post !== void 0)
    $$bindings.post(post);
  $$result.css.add(css$2);
  return `${$$result.head += `${$$result.title = `<title>${escape(post.title)}</title>`, ""}`, ""}

<h1>${escape(post.title)}</h1>

<div class="${"content svelte-emm3f3"}"><!-- HTML_TAG_START -->${post.content}<!-- HTML_TAG_END --></div>`;
});
var _slug_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bslugu5D,
  load: load$1
});
var css$1 = {
  code: "img.svelte-yzl7q2{text-align:center;width:90%;display:block;margin:auto}",
  map: '{"version":3,"file":"event.svelte","sources":["event.svelte"],"sourcesContent":["<style>\\n\\timg {\\n\\t\\ttext-align: center;\\n\\t\\twidth: 90%;\\n\\t\\tdisplay: block;\\n\\t\\tmargin: auto;\\n\\t}\\n</style>\\n\\n<svelte:head>\\n\\t<title>About</title>\\n</svelte:head>\\n\\n<h1>About the Event</h1>\\n\\n<p>Our wedding will be on November 13th, 2021, at the beautiful <a target=\\"_blank\\" href=\\"https://g.page/hyattregencycoralgables?share\\">Hyatt Regency in Coral Gables</a>!</p>\\n<p>The ceremony will take place in the central courtyard, and the reception will be held on-site.</p>\\n<img  alt=\\"Hyatt Regency Coral Gables\\" src=\\"Hotel.webp\\">\\n<!-- <iframe title=\\"Location of Hyatt Regency Coral Gables\\" src=\\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.5592725092124!2d-80.2579518849793!3d25.75208448364109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b7986726e6b3%3A0x2bbce8ac17d1edef!2sHyatt%20Regency%20Coral%20Gables!5e0!3m2!1sen!2sus!4v1620774760879!5m2!1sen!2sus\\" width=\\"300\\" height=\\"200\\" style=\\"border:0;\\" allowfullscreen=\\"\\" loading=\\"lazy\\"></iframe> -->"],"names":[],"mappings":"AACC,GAAG,cAAC,CAAC,AACJ,UAAU,CAAE,MAAM,CAClB,KAAK,CAAE,GAAG,CACV,OAAO,CAAE,KAAK,CACd,MAAM,CAAE,IAAI,AACb,CAAC"}'
};
var Event = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `${$$result.head += `${$$result.title = `<title>About</title>`, ""}`, ""}

<h1>About the Event</h1>

<p>Our wedding will be on November 13th, 2021, at the beautiful <a target="${"_blank"}" href="${"https://g.page/hyattregencycoralgables?share"}">Hyatt Regency in Coral Gables</a>!</p>
<p>The ceremony will take place in the central courtyard, and the reception will be held on-site.</p>
<img alt="${"Hyatt Regency Coral Gables"}" src="${"Hotel.webp"}" class="${"svelte-yzl7q2"}">
`;
});
var event = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Event
});
var Rsvp = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let matchedGuests;
  const guests = [
    { id: "1234", name: "The Moya Family" },
    { id: "2345", name: "The Hernandez Family" },
    { id: "3456", name: "The Other Family" }
  ];
  let search = "";
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    matchedGuests = guests.filter(({ id, name }) => {
      return id.includes(search) || name.toLowerCase().includes(search.toLowerCase());
    });
    $$rendered = `<h1>RSVP</h1>
${validate_component(Label, "Label").$$render($$result, { for: "partySearch" }, {}, { default: () => `Search for your party` })}
${validate_component(Input, "Input").$$render($$result, {
      autocomplete: "off",
      id: "partySearch",
      type: "search",
      placeholder: "Enter Your Name or RSVP Code",
      value: search
    }, {
      value: ($$value) => {
        search = $$value;
        $$settled = false;
      }
    }, {})}
${search.length > 2 ? `${validate_component(ListGroup, "ListGroup").$$render($$result, {}, {}, {
      default: () => `${each(matchedGuests, (guest) => `${validate_component(ListGroupItem, "ListGroupItem").$$render($$result, {
        tag: "a",
        href: `rsvp/${guest.id}`,
        action: true
      }, {}, { default: () => `${escape(guest.name)}` })}`)}`
    })}` : ``}`;
  } while (!$$settled);
  return $$rendered;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Rsvp
});
var css = {
  code: ".rsvp-form.svelte-sy5ihz{text-align:center\n    }",
  map: `{"version":3,"file":"[id].svelte","sources":["[id].svelte"],"sourcesContent":["<script context=\\"module\\">\\n    export async function load({ page: {params: { id }} }) {\\n        const guests = [\\n            {\\n                id: '1234',\\n                name: 'The Moya Family',\\n                seats: [\\n                    {\\n                        name: 'Migdy Moya'\\n                    },\\n                    {\\n                        name: 'Henry Moya'\\n                    },\\n                    {\\n                        name: ''\\n                    }\\n                ]\\n            },\\n            {\\n                id: '2345',\\n                name: 'The Hernandez Family',\\n            },\\n            {\\n                id: '3456',\\n                name: 'The Other Family',\\n            },\\n        ];\\n        const guestGroup = guests.find((g) => id === g.id) || {};\\n        return { props: { guestGroup } };\\n    }\\n<\/script>\\n\\n<script>\\n    import { Form, Label, Container, Col, Row, ButtonGroup, Button, Input, Alert } from 'sveltestrap';\\n    export let guestGroup = {};\\n    const { name, seats } = guestGroup;\\n    let error = '';\\n    const onFormSubmit = (e) => {\\n        e.preventDefault();\\n        if (guestGroup.attending) {\\n                if (seats.find((seat) => !seat.name)) {\\n                error = 'Please enter a name for all your guests';\\n                return;\\n            };\\n            if (seats.find((seat) => !seat.food)) {\\n                error = 'Please enter a food preference for all your guests';\\n                return;\\n            };\\n        };\\n        error = '';\\n        console.log(JSON.stringify(guestGroup, null, 4))\\n    };\\n    const onGroupAttending = () =>{\\n        guestGroup.attending = true;\\n        seats.forEach(seat => {\\n            if (seat.attending === undefined) {\\n                seat.attending = true;\\n            };\\n        });\\n    };\\n    const onGroupNotAttending = () => {\\n        guestGroup.attending = false;\\n        seats.forEach(seat => {\\n            seat.attending = false;\\n        });\\n    };\\n<\/script>\\n\\n<style>\\n    .rsvp-form {\\n        text-align: center\\n    }\\n</style>\\n\\n<h1>RSVP</h1>\\n<div class=\\"rsvp-form\\">\\n    <h2>{name}</h2>\\n    <Form on:submit={onFormSubmit}>\\n        <Container>\\n            <Row class=\\"mb-1\\">\\n                <Col md={{ size: 6, offset: 3}}>\\n                    <Label for=\\"groupAttendanceBtnGroup\\">Will you be able to attend?</Label>\\n                    <ButtonGroup id=\\"groupAttendanceBtnGroup\\" role=\\"group\\" class=\\"w-100\\">\\n                        <Button type=\\"button\\" active={guestGroup.attending} outline color=\\"primary\\" on:click={onGroupAttending}>Yes</Button>\\n                        <Button type=\\"button\\" active={guestGroup.attending === false} outline color=\\"secondary\\" on:click={onGroupNotAttending}>No</Button>\\n                    </ButtonGroup>\\n                </Col>\\n            </Row>\\n            {#if guestGroup.attending !== undefined}\\n                <br>\\n                {#if guestGroup.attending }\\n                <Row>\\n                    <p>Geat! Please tell us a bit about each guest:</p>\\n                </Row>\\n                {#if error}\\n                    <Row>\\n                        <Col size={12}>\\n                            <Alert color=\\"danger\\"><p class=\\"m-0\\">{error}</p></Alert>\\n                        </Col>\\n                    </Row>\\n                {/if}\\n                {#each seats as seat, i}\\n                    <Row>\\n                        <Col>\\n                            <Label>Guest Name:\\n                                <Input invalid={error && !seat.name} feedback=\\"Please enter this guest's name\\" bind:value={seat.name} placeholder={\`Guest #\${i+1}\`}/>\\n                            </Label>\\n                        </Col>\\n                        <Col>\\n                            <Label for=\\"guestAttendanceBtnGroup\\">Attending?</Label>\\n                            <ButtonGroup id=\\"guestAttendanceBtnGroup\\" role=\\"group\\" class=\\"w-100\\">\\n                                <Button type=\\"button\\" outline active={seat.attending} color=\\"primary\\" on:click={() => (seat.attending = true)}>Yes</Button>\\n                                <Button type=\\"button\\" outline active={seat.attending === false} color=\\"secondary\\" on:click={() => (seat.attending = false)}>No</Button>\\n                            </ButtonGroup>\\n                        </Col>\\n                        <Col>\\n                            <Label for=\\"foodPreferenceBtnGroup\\">Food Preference:</Label>\\n                            <ButtonGroup id=\\"foodPreferenceBtnGroup\\" role=\\"group\\" class=\\"w-100\\">\\n                                <Button type=\\"button\\" disabled={!seat.attending} outline active={seat.food === 'Beef'} color={error && !seat.food ? 'danger' : 'dark'} on:click={() => (seat.food = 'Beef')}>Beef</Button>\\n                                <Button type=\\"button\\" disabled={!seat.attending} outline active={seat.food === 'Chicken'} color={error && !seat.food ? 'danger' : 'dark'} on:click={() => (seat.food = 'Chicken')}>Chicken</Button>\\n                                <Button type=\\"button\\" disabled={!seat.attending} outline active={seat.food === 'Vegitarian'} color={error && !seat.food ? 'danger' : 'dark'} on:click={() => (seat.food = 'Vegitarian')}>Vegitarian</Button>\\n                            </ButtonGroup>\\n                        </Col>\\n                    </Row>\\n                {/each}\\n                {:else}\\n                    <Row>\\n                        <p>We're sorry to hear that! Click the button below to let us know.</p>\\n                    </Row>\\n                {/if}\\n                <Button color=\\"light\\" class=\\"mt-1\\">Submit</Button>\\n            {/if}\\n\\n\\n        </Container>\\n    </Form>\\n</div>\\n"],"names":[],"mappings":"AAqEI,UAAU,cAAC,CAAC,AACR,UAAU,CAAE,MAAM;IACtB,CAAC"}`
};
async function load({ page: { params: { id } } }) {
  const guests = [
    {
      id: "1234",
      name: "The Moya Family",
      seats: [{ name: "Migdy Moya" }, { name: "Henry Moya" }, { name: "" }]
    },
    { id: "2345", name: "The Hernandez Family" },
    { id: "3456", name: "The Other Family" }
  ];
  const guestGroup = guests.find((g) => id === g.id) || {};
  return { props: { guestGroup } };
}
var U5Bidu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { guestGroup = {} } = $$props;
  const { name, seats } = guestGroup;
  let error2 = "";
  if ($$props.guestGroup === void 0 && $$bindings.guestGroup && guestGroup !== void 0)
    $$bindings.guestGroup(guestGroup);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `<h1>RSVP</h1>
<div class="${"rsvp-form svelte-sy5ihz"}"><h2>${escape(name)}</h2>
    ${validate_component(Form, "Form").$$render($$result, {}, {}, {
      default: () => `${validate_component(Container, "Container").$$render($$result, {}, {}, {
        default: () => `${validate_component(Row, "Row").$$render($$result, { class: "mb-1" }, {}, {
          default: () => `${validate_component(Col, "Col").$$render($$result, { md: { size: 6, offset: 3 } }, {}, {
            default: () => `${validate_component(Label, "Label").$$render($$result, { for: "groupAttendanceBtnGroup" }, {}, {
              default: () => `Will you be able to attend?`
            })}
                    ${validate_component(ButtonGroup, "ButtonGroup").$$render($$result, {
              id: "groupAttendanceBtnGroup",
              role: "group",
              class: "w-100"
            }, {}, {
              default: () => `${validate_component(Button, "Button").$$render($$result, {
                type: "button",
                active: guestGroup.attending,
                outline: true,
                color: "primary"
              }, {}, { default: () => `Yes` })}
                        ${validate_component(Button, "Button").$$render($$result, {
                type: "button",
                active: guestGroup.attending === false,
                outline: true,
                color: "secondary"
              }, {}, { default: () => `No` })}`
            })}`
          })}`
        })}
            ${guestGroup.attending !== void 0 ? `<br>
                ${guestGroup.attending ? `${validate_component(Row, "Row").$$render($$result, {}, {}, {
          default: () => `<p>Geat! Please tell us a bit about each guest:</p>`
        })}
                ${``}
                ${each(seats, (seat, i) => `${validate_component(Row, "Row").$$render($$result, {}, {}, {
          default: () => `${validate_component(Col, "Col").$$render($$result, {}, {}, {
            default: () => `${validate_component(Label, "Label").$$render($$result, {}, {}, {
              default: () => `Guest Name:
                                ${validate_component(Input, "Input").$$render($$result, {
                invalid: error2,
                feedback: "Please enter this guest's name",
                placeholder: `Guest #${i + 1}`,
                value: seat.name
              }, {
                value: ($$value) => {
                  seat.name = $$value;
                  $$settled = false;
                }
              }, {})}
                            `
            })}
                        `
          })}
                        ${validate_component(Col, "Col").$$render($$result, {}, {}, {
            default: () => `${validate_component(Label, "Label").$$render($$result, { for: "guestAttendanceBtnGroup" }, {}, { default: () => `Attending?` })}
                            ${validate_component(ButtonGroup, "ButtonGroup").$$render($$result, {
              id: "guestAttendanceBtnGroup",
              role: "group",
              class: "w-100"
            }, {}, {
              default: () => `${validate_component(Button, "Button").$$render($$result, {
                type: "button",
                outline: true,
                active: seat.attending,
                color: "primary"
              }, {}, { default: () => `Yes` })}
                                ${validate_component(Button, "Button").$$render($$result, {
                type: "button",
                outline: true,
                active: seat.attending === false,
                color: "secondary"
              }, {}, { default: () => `No` })}
                            `
            })}
                        `
          })}
                        ${validate_component(Col, "Col").$$render($$result, {}, {}, {
            default: () => `${validate_component(Label, "Label").$$render($$result, { for: "foodPreferenceBtnGroup" }, {}, { default: () => `Food Preference:` })}
                            ${validate_component(ButtonGroup, "ButtonGroup").$$render($$result, {
              id: "foodPreferenceBtnGroup",
              role: "group",
              class: "w-100"
            }, {}, {
              default: () => `${validate_component(Button, "Button").$$render($$result, {
                type: "button",
                disabled: !seat.attending,
                outline: true,
                active: seat.food === "Beef",
                color: "dark"
              }, {}, { default: () => `Beef` })}
                                ${validate_component(Button, "Button").$$render($$result, {
                type: "button",
                disabled: !seat.attending,
                outline: true,
                active: seat.food === "Chicken",
                color: "dark"
              }, {}, { default: () => `Chicken` })}
                                ${validate_component(Button, "Button").$$render($$result, {
                type: "button",
                disabled: !seat.attending,
                outline: true,
                active: seat.food === "Vegitarian",
                color: "dark"
              }, {}, { default: () => `Vegitarian` })}
                            `
            })}
                        `
          })}
                    `
        })}`)}` : `${validate_component(Row, "Row").$$render($$result, {}, {}, {
          default: () => `<p>We&#39;re sorry to hear that! Click the button below to let us know.</p>`
        })}`}
                ${validate_component(Button, "Button").$$render($$result, { color: "light", class: "mt-1" }, {}, { default: () => `Submit` })}` : ``}`
      })}`
    })}</div>`;
  } while (!$$settled);
  return $$rendered;
});
var _id_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bidu5D,
  load
});

// .svelte-kit/netlify/entry.js
init();
async function handler(event2) {
  const { path, httpMethod, headers, rawQuery, body, isBase64Encoded } = event2;
  const query = new URLSearchParams(rawQuery);
  const encoding = isBase64Encoded ? "base64" : headers["content-encoding"] || "utf-8";
  const rawBody = typeof body === "string" ? Buffer.from(body, encoding) : body;
  const rendered = await render({
    method: httpMethod,
    headers,
    path,
    query,
    rawBody
  });
  if (rendered) {
    return {
      isBase64Encoded: false,
      statusCode: rendered.status,
      ...splitHeaders(rendered.headers),
      body: rendered.body
    };
  }
  return {
    statusCode: 404,
    body: "Not found"
  };
}
function splitHeaders(headers) {
  const h = {};
  const m = {};
  for (const key in headers) {
    const value = headers[key];
    const target = Array.isArray(value) ? m : h;
    target[key] = value;
  }
  return {
    headers: h,
    multiValueHeaders: m
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
