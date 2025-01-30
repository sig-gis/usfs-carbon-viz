import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MapCatalogueService {


  constructor(
    private httpClient: HttpClient
  ) { }

  getMapCatalogue(search: string = "", offset: number = 0, limit: number = 0, order: string = '', dir: string = '', id: string = ''): Observable<any> {
    return this.httpClient.get<any>(environment.backend_baseurl + "/map?search=" + search + "&offset=" + offset + "&limit=" + limit + "&order=" + order + "&dir=" + dir + "&id="+ id);
  }

}  