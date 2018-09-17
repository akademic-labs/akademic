import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { UserComponent } from 'app/pages/user/user.component';
import { SignComponent } from 'app/pages/sign/sign.component';
import { RulesComponent } from './pages/admin/rules/rules.component';
import { CourseComponent } from './pages/admin/course/course.component';
import { SignUpComponent } from 'app/pages/sign/signup/sign-up.component';
import { SignInComponent } from 'app/pages/sign/signin/sign-in.component';
import { Error404Component } from 'app/shared/error404/error404.component';
import { ControllerComponent } from './pages/admin/controller/controller.component';
import { InstitutionComponent } from './pages/admin/institution/institution.component';
import { InputActivityComponent } from 'app/pages/user/input-activity/input-activity.component';
import { ActivitypeTypeComponent } from './pages/admin/activitype-type/activitype-type.component';
import { ValidateActivityComponent } from './pages/cordinator/validate-activity/validate-activity.component';

import { AuthGuard } from 'app/guards/auth.guard';
import { IsLoggedGuard } from './guards/is-logged.guard';

const routes: Routes = [
  {
    path: '', component: SignComponent, canActivate: [IsLoggedGuard], children: [
      { path: '', component: SignInComponent },
      { path: 'signup', component: SignUpComponent }
    ]
  },
  { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'input-activity', component: InputActivityComponent, canActivate: [AuthGuard] },
  { path: 'validate-activity', component: ValidateActivityComponent, canActivate: [AuthGuard] },
  { path: 'institution', component: InstitutionComponent, canActivate: [AuthGuard] },
  { path: 'course', component: CourseComponent, canActivate: [AuthGuard] },
  { path: 'acitivityType', component: ActivitypeTypeComponent, canActivate: [AuthGuard] },
  { path: 'controller', component: ControllerComponent, canActivate: [AuthGuard] },
  { path: 'rules', component: RulesComponent, canActivate: [AuthGuard] },
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
