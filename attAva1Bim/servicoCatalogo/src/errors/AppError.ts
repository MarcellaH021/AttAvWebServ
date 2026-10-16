export class AppError extends Error {
  public readonly statusCode: number;
  public readonly origem: string;

  constructor(message: string, statusCode: number, origem: string) {
    super(message);
    this.statusCode = statusCode;
    this.origem = origem;
  }
}