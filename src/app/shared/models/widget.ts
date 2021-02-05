export class Widget {
  constructor(
    public uid: string,
    public className: string,
    public rows: number,
    public cols: number,
    public supportsRange: boolean,
    public supportsDate: boolean,
    public data: any = null
  ) {
  }
}
