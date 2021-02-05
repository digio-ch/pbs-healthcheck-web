export class ServerError {
  constructor(
    public statusCode: number,
    public message: string
  ) {
  }
}
