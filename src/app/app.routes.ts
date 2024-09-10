import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignComponent } from './components/sign/sign.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EventComponent } from './components/event/event.component';
import { ShowcaseComponent } from './components/showcase/showcase.component';
import { AuthGuard } from './services/auth.guard';
import { NgModule } from '@angular/core';
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { NotificationComponent } from './components/notifications/notification.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { OfflineComponent } from './components/offline/offline.component';
import { ArtistsComponent } from './components/artists/artists.component';  

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'sign', component: SignComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'event/:id', component: EventComponent }, 
    { path: 'add-event', component: AddEventComponent },
    { path: 'showcase', component: ShowcaseComponent },
    { path: 'set-password', component: SetPasswordComponent },
    { path: 'notifications', component: NotificationComponent },

    { path: 'artists', component: ArtistsComponent }, 
    { path: 'offline', component: OfflineComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
  ];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

  export class AppRoutingModule {}
