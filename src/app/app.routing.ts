import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { ControllerGuard } from './guards/controller.guard';
import { InstitutionGuard } from './guards/institution.guard';
import { IsLoggedGuard } from './guards/is-logged.guard';
import { StudentGuard } from './guards/student.guard';
import { CoursesComponent } from './features/admin/courses/courses.component';
import { InstitutionsComponent } from './features/admin/institutions/institutions.component';
import { RulesComponent } from './features/controller/rules/rules.component';
import { ValidateActivityComponent } from './features/controller/validate-activity/validate-activity.component';
import { HomeComponent } from './features/home/home.component';
import { ActivityTypeComponent } from './features/institution/activity-type/activity-type.component';
import { ControllersComponent } from './features/institution/controllers/controllers.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SignComponent } from './features/sign/sign.component';
import { SignInComponent } from './features/sign/signin/sign-in.component';
import { SignUpComponent } from './features/sign/signup/sign-up.component';
import { InputActivityComponent } from './features/student/input-activity/input-activity.component';
import { ActivityResolve } from './resolvers/activity.resolver';
import { Error404Component } from './core/error404/error404.component';

const routes: Routes = [
  {
    path: '', component: SignComponent, canActivate: [IsLoggedGuard], children: [
      { path: '', component: SignInComponent },
      { path: 'signup', component: SignUpComponent }
    ]
  },
  { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'input-activity', component: InputActivityComponent, canActivate: [AuthGuard, StudentGuard] },
  { path: 'input-activity/:id', component: InputActivityComponent, canActivate: [AuthGuard, StudentGuard] },
  { path: 'validate-activity/:id', component: ValidateActivityComponent, canActivate: [AuthGuard, ControllerGuard], resolve: { activity: ActivityResolve } },
  { path: 'institutions', component: InstitutionsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'activity-types', component: ActivityTypeComponent, canActivate: [AuthGuard, ControllerGuard] },
  { path: 'controllers', component: ControllersComponent, canActivate: [AuthGuard, InstitutionGuard] },
  { path: 'rules', component: RulesComponent, canActivate: [AuthGuard, ControllerGuard] },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
