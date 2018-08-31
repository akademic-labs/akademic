import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageControlErrorModule } from './shared/message-control-error/message-control-error.module';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { LoginModule } from './pages/login/login.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './shared/sidebar/sidebar.module';
import { UploadsModule } from './uploads/uploads.module';
import { ChartCardModule } from './shared/chart-card/chart-card.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { UserComponent } from 'app/pages/user/user.component';
import { InputActivityComponent } from './pages/user/input-activity/input-activity.component';
import { ValidateActivityComponent } from './pages/cordinator/validate-activity/validate-activity.component';
import { CordinatorComponent } from './pages/cordinator/cordinator.component';
import { ActivitypeTypeComponent } from './pages/admin/activitype-type/activitype-type.component';
import { RulesComponent } from './pages/admin/rules/rules.component';
import { ControllerComponent } from './pages/admin/controller/controller.component';
import { CourseComponent } from './pages/admin/course/course.component';
import { InstitutionComponent } from './pages/admin/institution/institution.component';

import { AuthGuard } from './guards/auth.guard';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { environment } from './../environments/environment';

export const firebaseConfig = environment.firebaseConfig;

// PrimeNG
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    InputActivityComponent,
    CordinatorComponent,
    ValidateActivityComponent,
    CourseComponent,
    ControllerComponent,
    RulesComponent,
    ActivitypeTypeComponent,
    InstitutionComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    RouterModule,
    AppRoutingModule,
    ChartCardModule,
    LoginModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    UploadsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),

    MessageControlErrorModule,

    BrowserAnimationsModule,
    DropdownModule,
    CalendarModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
