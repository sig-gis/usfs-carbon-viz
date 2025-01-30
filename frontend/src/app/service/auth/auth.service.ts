import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

// import * as jwt_decode from 'jwt-decode';
import jwt_decode from 'jwt-decode';
// import { user } from 'ng-heroicon';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  authBehaviorSubject = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient
  ) { console.log('AuthService instance created.'); }

  setInitStatus(): void {
    this.authBehaviorSubject.next(this.getStatus());
  }

  getStatus(): boolean {
    try {
      const decode = jwt_decode((localStorage.getItem(environment.token_name) || ''));
      // @ts-ignore
      if (decode.exp < Math.floor(Date.now() / 1000)) {
        this.removeToken();
        return false;
      }
      return true;
      /*
      if (localStorage.getItem(environment.token_name) || null) {
        return true;
      } else {
        return false;
      }
      */
    } catch (Error) {
      return false;
    }
  }

  getToken(): string {
    return (localStorage.getItem(environment.token_name) || '');
  }

  setToken(token: string): void {
    localStorage.setItem(environment.token_name, token);
    this.authBehaviorSubject.next(true);
  }

  removeToken(): void {
    localStorage.removeItem(environment.token_name);
    this.authBehaviorSubject.next(false);
  }

  getIdUser(): string {
    return (localStorage.getItem(environment.id_user) || '');
  }

  setIdUser(idUser: string): void {
    localStorage.setItem(environment.id_user, idUser);
    this.authBehaviorSubject.next(true);
  }

  getRole() {
    return localStorage.getItem('role');
  }

  removeIdUser(): void {
    localStorage.removeItem(environment.id_user);
    this.authBehaviorSubject.next(false);
  }

  getAuthToken(): Observable<any> {
    return this.httpClient.get<any>(environment.api_baseurl + '/auth/token.json');
  }

  postAuthLogin(paramLoginData: any): Observable<any> {
    return this.httpClient.post<any>(environment.backend_baseurl + '/auth/login', JSON.stringify(paramLoginData));
  }

  postAuthLoginTes(paramLoginData: any): Observable<any> {
    return this.httpClient.post<any>(environment.backend_baseurl + '/auth/testing', JSON.stringify(paramLoginData));
  }

  getAuthLogout(): Observable<any> {
    return this.httpClient.get<any>(environment.backend_baseurl + '/auth/logout');
  }

  ngOnDestroy(): void {
    // console.log('AuthService instance destroyed.');
  }

  getAuthInit(userId: any): Observable<any> {
    return this.httpClient.post<any>(environment.backend_baseurl + '/auth/init', JSON.stringify(userId));
  }

  getAuthinfo(userId: any): Observable<any> {
    return this.httpClient.get<any>(environment.backend_baseurl + '/auth/user/' + userId);
  }
}
