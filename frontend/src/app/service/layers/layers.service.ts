import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LayersService {


  constructor(
    private httpClient: HttpClient
  ) { }

  getLayerList(): Observable<any> {
    return this.httpClient.get<any>(environment.backend_baseurl + '/layers');
  }

}  