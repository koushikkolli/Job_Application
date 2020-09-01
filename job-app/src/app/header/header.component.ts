import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userSub: Subscription
  isLoggedIn = false;
  displayName: string;
  loginType: string;
  constructor(private authService:AuthService) { }
  

  ngOnInit(): void {
    console.log(this.authService.user);
    this.authService.user.subscribe((user)=>{
      this.isLoggedIn = !!user
      if(user){
        console.log(user.displayName);
        this.displayName = user.displayName;
        if (this.displayName.slice(this.displayName.length - 2) == "_0"){
            this.loginType = "Candidate"
        }
        else{
          this.loginType = "Employee"
        }
      }
  });
  }

  onLogOut(){
    this.authService.logout();
  }

}
