import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  // HttpErrorResponse,
  // HttpResponse
} from '@angular/common/http';
// import { Router } from '@angular/router';
import {Observable} from 'rxjs'; // of, // , throwError
// import { catchError  } from 'rxjs/internal/operators'; // map,

import { environment } from '../../environments/environment';

import { AuthService } from '../service/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    // private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // let reqInject: any;
    req = req.clone({ headers: req.headers.set('Accept', 'application/json') });

    if (!req.headers.has('Content-Type')) {
      req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    }

    if (this.authService.getStatus()) {
      /*
      if (req.headers.get('Content-Type') == null) {
        reqInject = req.clone({
          headers: req.headers.set(
            'Authorization', environment.token_header + ' ' + this.authService.getToken()
          ).set(
            'Content-Type', 'application/json'
          )
        });
      } else {
        reqInject = req.clone({
          headers: req.headers.set(
            'Authorization', environment.token_header + ' ' + this.authService.getToken()
          )
        });
      }

      // return next.handle(reqInject);
      return next.handle(reqInject).pipe(catchError((error, caught) => {
        this.handleError(error);
        return of(error);
      }) as any);
      */
      req = req.clone({ headers: req.headers.set('Authorization', environment.token_header + ' ' + this.authService.getToken()) });

      return next.handle(req); // catchError(this.handleErrorInterceptor)
    } else {
      return next.handle(req); // .pipe(catchError(this.handleErrorInterceptor))
    }
  }

  // private handleErrorInterceptor(error: HttpErrorResponse): Observable<any> {
  //   if (error.error instanceof ErrorEvent) {
  //     // client-side error
  //     console.log(`Error: ${error.error.message}`);
  //   } else {
  //     // server-side error
  //     console.log(`Error Code: ${error.status}\nMessage: ${error.message}`);
  //   }
  //
  //   // console.log('Error : ', error);
  //   // console.log('Error Status : ', error.status);
  //   /*
  //   if (error.status === 500) {
  //     alert('Internal server error');
  //     return of(error.message);
  //   } else if (error.status === 400) {
  //     alert('Page not found');
  //     return of(error.message);
  //   } else if (error.status === 401) {
  //     this.router.navigate(['/auth/login']);
  //     return of(error.message);
  //   }
  //   throw Error;
  //   */
  //   return throwError(error);
  // }

}
