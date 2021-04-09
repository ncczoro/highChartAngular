import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
})
export class AppLoginComponent {

  constructor( private _route: Router ){
  }

  onLogin(userName, userPass) {
    if(userName == 'admin' && userPass == 'admin') {
      this._route.navigateByUrl("/dashboard/all")
    } else {
      this._route.navigateByUrl("/login")
    }
  }
}
