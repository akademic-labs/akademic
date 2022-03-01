import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { Error404Component } from './core/error404/error404.component';
import { HomeComponent } from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SignComponent } from './features/sign/sign.component';
import { SignInComponent } from './features/sign/signin/sign-in.component';
import { SignUpComponent } from './features/sign/signup/sign-up.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { ControllerGuard } from './guards/controller.guard';
import { InstitutionGuard } from './guards/institution.guard';
import { IsLoggedGuard } from './guards/is-logged.guard';
import { StudentGuard } from './guards/student.guard';

const routes: Routes = [
  {
    path: '',
    component: SignComponent,
    canActivate: [IsLoggedGuard],
    children: [
      { path: '', component: SignInComponent },
      { path: 'signup', component: SignUpComponent },
    ],
  },
  { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'student',
    loadChildren: () =>
      import('./features/student/student.module').then((m) => m.StudentModule),
    canActivate: [AuthGuard, StudentGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'institution',
    loadChildren: () =>
      import('./features/institution/institution.module').then(
        (m) => m.InstitutionModule
      ),
    canActivate: [AuthGuard, InstitutionGuard],
  },
  {
    path: 'controller',
    loadChildren: () =>
      import('./features/controller/controller.module').then(
        (m) => m.ControllerModule
      ),
    canActivate: [AuthGuard, ControllerGuard],
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./features/events/events.module').then((m) => m.EventsModule),
    canActivate: [AuthGuard],
  },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [CommonModule, BrowserModule, RouterModule.forRoot(routes)],
  exports: [],
})
export class AppRoutingModule {}
