import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor(
    private httpClient: HttpClient
  ) { }

  getMapApp(search: string = "", offset: number = 0, limit: number = 0, order: string = '', dir: string = '', id: string = ''): Observable<any> {
    return this.httpClient.get<any>(environment.backend_baseurl + "/admin/map_app?search=" + search + "&offset=" + offset + "&limit=" + limit + "&order=" + order + "&dir=" + dir);
  }

  getMapAppLayerlist(search: string = "", offset: number = 0, limit: number = 0, order: string = '', dir: string = '', uuid: any = ''): Observable<any> {
    return this.httpClient.get<any>(environment.backend_baseurl + "/admin/map_app/layers?search=" + search + "&offset=" + offset + "&limit=" + limit + "&order=" + order + "&dir=" + dir + "&uuid="+ uuid);
  }

  postLayerList(body: any): Observable<any> {
    return this.httpClient.post<any>(environment.backend_baseurl + '/admin/map_app/layers/post', JSON.stringify(body));
  }

  updateLayerList(body: any): Observable<any> {
    return this.httpClient.put<any>(environment.backend_baseurl + '/admin/map_app/layers/update', JSON.stringify(body));
  }

}  