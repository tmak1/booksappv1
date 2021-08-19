class HttpError extends Error {
  constructor(message = 'Internal server error', code = 500) {
    super(message);
    this.message = message;
    this.code = code;
  }
}

export default HttpError;
