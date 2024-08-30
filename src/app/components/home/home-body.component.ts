import { Component } from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { HeaderComponent } from "../header/header.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'homeBody',
  standalone: true,
  imports: [MatButtonModule,
            MatDividerModule,
            RouterModule,
            MatIconModule,
            HeaderComponent],
  templateUrl: './home-body.component.html',
})
export class HomeBodyComponent {

}
