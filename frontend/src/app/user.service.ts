// src/app/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
 providedIn: 'root'
})

export class UserService {
 url = 'http://localhost:4200';
 
 constructor(private http: HttpClient) { }
 
  getPlaces(): Observable<any> {
    return this.http.get(this.url + '/assets/json/places.json');
  }

  getLines(): Observable<any> {
    return this.http.get(this.url + '/assets/json/lines.json');
  }

  getConfig(): Observable<any> {
    return this.http.get(this.url + '/assets/json/config.json');
  }

  getToggle(): Observable<any> {
    return this.http.get(this.url + '/assets/json/toggles.json');
  }
}