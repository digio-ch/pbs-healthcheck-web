export enum Severity {
    None = 'none',
    Info = 'info',
    Warning = 'warning',
    Error = 'error'
}

export interface StatusMessage {
  severity: Severity,
  title: string,
  body: string
}