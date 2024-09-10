import { Component } from '@angular/core';
import { AuthComponent } from "../auth/auth.component";
import { HeaderComponent } from "../header/header.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BackgroundComponent } from "../background/background.component";

export enum SignMode {
  Login = 'Login',
  Register = 'Register'
}

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [AuthComponent, RouterModule, HeaderComponent, BackgroundComponent],
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']  // Note the correction: 'styleUrls' instead of 'styleUrl'
})
export class SignComponent {
  mode: SignMode = SignMode.Login;  // Default to Login

  constructor(private route: ActivatedRoute) {
    // Get the mode from the query parameters
    this.route.queryParams.subscribe(params => {
      if (params['mode'] === SignMode.Register) {
        this.mode = SignMode.Register;
      } else {
        this.mode = SignMode.Login;
      }
    });
  }
  }

