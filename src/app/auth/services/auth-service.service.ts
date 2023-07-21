import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environments';
import { AuthStatus, CheckTokenResponse, LoginResponse, User, UserRegister } from '../interfaces';
import { RegisterResponse } from '../interfaces/register-response';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject( HttpClient );

  private _currentUser = signal<User|null>(null);
  private _authstatus = signal<AuthStatus>(AuthStatus.checking);

  //! Al mundo exterior
  public currentUser = computed( () => this._currentUser() );
  public authstatus = computed( () => this._authstatus() );


  constructor(){
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user:User, token: string): boolean {

    this._currentUser.set(user);
    this._authstatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;

  }

  login( email: string, password: string ): Observable<boolean>{
    const url = `${ this.baseUrl }/auth/login`;
    const body = {email, password };

    return this.http.post<LoginResponse>(url, body)
      .pipe(
        map( ({ user, token }) => this.setAuthentication(user, token)),
        catchError( err => throwError( () => err.error.message)),
      );

  }

  register( userRegister: UserRegister ): Observable<boolean>{
    const url = `${ this.baseUrl }/auth/register`;
    const {email, password, name } = userRegister;
    const body = {email, password, name };

    return this.http.post<RegisterResponse>(url, body)
      .pipe(
        map( () => true),
        catchError( err => throwError( () => err.error.message)),
      );

  }

  checkAuthStatus(): Observable<boolean>{
    const url = `${ this.baseUrl }/auth/check-token`;
    const token = localStorage.getItem('token');

    if( !token ) {
      this.logout();
      return of(false)
    };

    const headers = new HttpHeaders()
      .set('Authorization',`Bearer ${ token }`);

    return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map( ({ user, token }) => this.setAuthentication(user, token)),
        catchError( () => {
          this._authstatus.set( AuthStatus.notAuthenticated );
          return of(false)
        })
      )

  }

  logout(): void {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authstatus.set(AuthStatus.notAuthenticated);
  }

}
