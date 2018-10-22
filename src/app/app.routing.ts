import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { IsLoggedGuard } from './guards/is-logged.guard';
import { ActivitypeTypeComponent } from './pages/admin/activitype-type/activitype-type.component';
import { ControllerComponent } from './pages/admin/controller/controller.component';
import { CourseComponent } from './pages/admin/course/course.component';
import { InstitutionComponent } from './pages/admin/institution/institution.component';
import { RulesComponent } from './pages/admin/rules/rules.component';
import { ValidateActivityComponent } from './pages/controller/validate-activity/validate-activity.component';
import { HomeComponent } from './pages/home/home.component';
import { SignComponent } from './pages/sign/sign.component';
import { SignInComponent } from './pages/sign/signin/sign-in.component';
import { SignUpComponent } from './pages/sign/signup/sign-up.component';
import { InputActivityComponent } from './pages/user/input-activity/input-activity.component';
import { UserComponent } from './pages/user/user.component';
import { ActivityResolve } from './resolvers/activity.resolver';
import { Error404Component } from './shared/error404/error404.component';

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
  { path: 'input-activity/:id', component: InputActivityComponent, canActivate: [AuthGuard] },
  { path: 'validate-activity/:id', component: ValidateActivityComponent, canActivate: [AuthGuard], resolve: { activity: ActivityResolve } },
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
