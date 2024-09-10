import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { HeaderComponent } from "../header/header.component";
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import { BackgroundComponent } from "../background/background.component";
@Component({
  selector: 'app-offline',
  standalone: true,
  imports: [MatButtonModule,
    MatDividerModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    HeaderComponent,
    MatCardModule,
    FormsModule, BackgroundComponent],
            changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './offline.component.html',
  styleUrl: './offline.component.css'
})
export class OfflineComponent {


  testoOrganizzazione = ` Sei un organizzazione e fatichi a trovare artisti locali
   che partecipino ai tuoi eventi? \n\nCrea subito il tuo post da fissare in bacheca e manda richieste all' elenco artisti`;
  testoArtista = ` Sei un artista in cerca di eventi nelle vicinanze a cui iscriverti?\n\n
   Registrati e manda la tua richiesta di partecipazione agli eventi di tuo interesse presenti in bacheca.`;
  constructor() { }

  ngOnInit() {

  }

 
}
