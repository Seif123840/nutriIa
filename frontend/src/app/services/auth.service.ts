import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  currentUser: User | null = null;


  constructor(
      private http: HttpClient,
      private router: Router
  ) {

    const user = localStorage.getItem('user');

    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }


  // REGISTER
  signUp(
      email: string,
      password: string,
      fullName: string
  ): Observable<any> {

    return this.http.post<any>(
        `${this.apiUrl}/register`,
        {
          email,
          password,
          fullName
        }
    ).pipe(

        tap(response => {

          const user: User = {
            id: response.id,
            email: response.email,
            role: response.role
          };


          localStorage.setItem(
              'user',
              JSON.stringify(user)
          );


          localStorage.setItem(
              'token',
              response.token
          );


          localStorage.setItem(
              'role',
              response.role
          );


          this.currentUser = user;

        })

    );
  }



    // LOGIN
    login(credentials: { email: string; password: string }): Observable<any> {

        return this.http.post<any>(
            `${this.apiUrl}/login`,
            credentials
        )
            .pipe(

                tap(response => {

                    console.log("LOGIN RESPONSE :", response);


                    const user: User = {

                        id: response.userId,

                        email: response.email,

                        role: response.role ?? 'USER'

                    };


                    localStorage.setItem(
                        'token',
                        response.token
                    );


                    localStorage.setItem(
                        'role',
                        user.role
                    );


                    localStorage.setItem(
                        'email',
                        user.email
                    );


                    localStorage.setItem(
                        'user',
                        JSON.stringify(user)
                    );


                    this.currentUser = user;


                })

            );
    }
  getCurrentUser(): User | null {

    return this.currentUser;

  }



  logout(): void {

    localStorage.clear();

    this.currentUser = null;

    this.router.navigate(['/login']);

  }



  signOut(): void {

    this.logout();

  }



  getRole(): string | null {

    return localStorage.getItem('role');

  }



  isAdmin(): boolean {

    return this.getRole() === 'ADMIN';

  }



  isAuthenticated(): boolean {

    return !!localStorage.getItem('token');

  }



  getToken(): string | null {

    return localStorage.getItem('token');

  }

}