import { MessageService } from 'primeng/components/common/messageservice';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageControlErrorModule } from './shared/message-control-error/message-control-error.module';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { SignModule } from './pages/sign/sign.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FooterModule } from './shared/footer/footer.module';
import { SidebarModule } from './shared/sidebar/sidebar.module';
import { UploadsModule } from './uploads/uploads.module';
import { ChartCardModule } from './shared/chart-card/chart-card.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { UserComponent } from 'app/pages/user/user.component';
import { RulesComponent } from './pages/admin/rules/rules.component';
import { CourseComponent } from './pages/admin/course/course.component';
import { Error404Component } from './shared/error404/error404.component';
import { CordinatorComponent } from './pages/cordinator/cordinator.component';
import { ControllerComponent } from './pages/admin/controller/controller.component';
import { InstitutionComponent } from './pages/admin/institution/institution.component';
import { InputActivityComponent } from './pages/user/input-activity/input-activity.component';
import { ActivitypeTypeComponent } from './pages/admin/activitype-type/activitype-type.component';
import { ValidateActivityComponent } from './pages/cordinator/validate-activity/validate-activity.component';

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
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { LightboxModule } from 'primeng/lightbox';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';

import { ToSelectIdPipe } from './pipes/to-select-id.pipe';
import { HttpModule } from '@angular/http';
import { FormDebugComponent } from './shared/form-debug/form-debug.component';


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
    InstitutionComponent,
    Error404Component,
    FormDebugComponent,
    ToSelectIdPipe
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    NavbarModule,
    FooterModule,
    SidebarModule,
    RouterModule,
    AppRoutingModule,
    ChartCardModule,
    SignModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    UploadsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),

    MessageControlErrorModule,

    // PrimeNG
    BrowserAnimationsModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    TableModule,
    GalleriaModule,
    LightboxModule,
    FileUploadModule,
    DialogModule,
    TooltipModule
  ],
  providers: [AuthGuard, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
