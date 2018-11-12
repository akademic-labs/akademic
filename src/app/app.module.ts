import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from 'angularfire2';

import { environment } from './../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CoreModule } from './core/core.module';
import { AdminModule } from './features/admin/admin.module';
import { ControllerModule } from './features/controller/controller.module';
import { HomeModule } from './features/home/home.module';
import { InstitutionModule } from './features/institution/institution.module';
import { ProfileModule } from './features/profile/profile.module';
import { SignModule } from './features/sign/sign.module';
import { StudentModule } from './features/student/student.module';
import { AuthGuard } from './guards/auth.guard';
import { ToSelectIdPipe } from './pipes/to-select-id.pipe';
import { FormDebugComponent } from './shared/form-debug/form-debug.component';

export const firebaseConfig = environment.firebaseConfig;

@NgModule({
  declarations: [
    AppComponent,
    FormDebugComponent,
    ToSelectIdPipe
  ],
  imports: [
    BrowserModule,
    CoreModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    SignModule,
    HomeModule,
    ProfileModule,
    AngularFireModule.initializeApp(firebaseConfig),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
