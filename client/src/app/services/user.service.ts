import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../environments/environment';

import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) }; // applied to those that doesnt need jwt

  constructor(private _http: HttpClient) {}

  register(user: User): Observable<User> {
    return this._http
      .post<User>(environment.apiBaseUrl + '/register', user, this.noAuthHeader)
      .pipe(catchError(this.errorHandler));
  }

  login(authCredentials: User): Observable<User> {
    return this._http
      .post<User>(
        environment.apiBaseUrl + '/authenticate',
        authCredentials,
        this.noAuthHeader
      )
      .pipe(catchError(this.errorHandler));
  }

  getUserProfile(): Observable<User> {
    return this._http
      .get<User>(environment.apiBaseUrl + '/')
      .pipe(catchError(this.errorHandler));
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    const token = this.getToken();
    if (token) {
      const userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    } else return null;
  }

  isLoggedIn() {
    const userPayload = this.getUserPayload();
    if (userPayload) {
      return userPayload.exp > Date.now() / 1000;
    }
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
