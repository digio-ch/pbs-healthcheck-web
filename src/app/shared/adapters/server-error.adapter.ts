import {Adapter} from './adapter';
import {ServerError} from '../models/server-error';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerErrorAdapter extends Adapter<ServerError> {

  constructor() {
    super();
  }

  adapt(item: any): ServerError {
    return new ServerError(
      item.status,
      item.error.message
    );
  }

}
