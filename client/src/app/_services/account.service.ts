import { IUser } from './../_models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = 'https://localhost:5001/api/'; 
  private currentUserSource = new ReplaySubject<IUser>(1); 
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any)
  { 
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      // RxJs Operator inside pipe 
      map((response: IUser) => { 
        const user = response; 

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);  
        }
      })
    ); 
  }

  register(model: any)
  {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: IUser) => { 
        if (user) {
          localStorage.setItem('user', JSON.stringify(user)); 
          this.currentUserSource.next(user); 
        }
        return user;
      })
    )
  }

  setCurrentUser(user: IUser)
  {
    this.currentUserSource.next(user);
  }

  logout() 
  {
    localStorage.removeItem('user'); 
    this.currentUserSource.next(null); 
  }
}
