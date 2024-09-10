import { Component } from '@angular/core';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { HeaderComponent } from "../header/header.component";
import { RouterModule } from '@angular/router';
import { HomeBodyComponent } from "./home-body.component";
import { BackgroundComponent } from "../background/background.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule,
    MatDividerModule,
    RouterModule,
    MatIconModule,
    HeaderComponent, HomeBodyComponent, BackgroundComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}