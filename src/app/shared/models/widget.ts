export class Widget {
  constructor(
    public uid: string,
    public className: string,
    public supportsRange: boolean,
    public supportsDate: boolean,
    public data: any = null,
    public allowEmpty: boolean = false
  ) {
  }
}
