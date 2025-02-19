export enum Severity {
    None = 'none',
    Info = 'info',
    Warning = 'warning',
    Error = 'error'
}

export class StatusMessage {
  constructor(
    public severity: Severity,
    public title: string,
    public body: string
  ) { }
}