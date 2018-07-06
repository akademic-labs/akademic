import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app.routing';
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

import { AuthGuard } from './guards/auth.guard';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from './../environments/environment';
import { CordinatorComponent } from './pages/cordinator/cordinator.component';
import { ValidateActivityComponent } from './pages/cordinator/validate-activity/validate-activity.component';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { HttpClientModule } from '@angular/common/http';
export const firebaseConfig = environment.firebaseConfig;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    InputActivityComponent,
    CordinatorComponent,
    ValidateActivityComponent
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
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
