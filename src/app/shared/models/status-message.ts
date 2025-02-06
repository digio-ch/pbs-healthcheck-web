export type Severity = 'none' | 'info' | 'warning' | 'error';

export class StatusMessage {
  public static SEVERITY_NONE: Severity = 'none';
  public static SEVERITY_INFO: Severity = 'info';
  public static SEVERITY_WARNING: Severity = 'warning';
  public static SEVERITY_ERROR:Severity = 'error';

  constructor(
    public severity: Severity,
    public title: string,
    public body: string
  ) { }
}