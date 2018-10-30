import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { UserComponent } from 'app/pages/user/user.component';
import { MessageService } from 'primeng/components/common/messageservice';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { LightboxModule } from 'primeng/lightbox';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { environment } from './../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AuthGuard } from './guards/auth.guard';
import { ActivitypeTypeComponent } from './pages/admin/activitype-type/activitype-type.component';
import { ControllerComponent } from './pages/admin/controller/controller.component';
import { CourseComponent } from './pages/admin/course/course.component';
import { InstitutionComponent } from './pages/admin/institution/institution.component';
import { RulesComponent } from './pages/admin/rules/rules.component';
import { ValidateActivityComponent } from './pages/controller/validate-activity/validate-activity.component';
import { HomeComponent } from './pages/home/home.component';
import { SignModule } from './pages/sign/sign.module';
import { InputActivityComponent } from './pages/user/input-activity/input-activity.component';
import { ToSelectIdPipe } from './pipes/to-select-id.pipe';
import { ActivityResolve } from './resolvers/activity.resolver';
import { ChartCardModule } from './shared/chart-card/chart-card.module';
import { Error404Component } from './shared/error404/error404.component';
import { FooterModule } from './shared/footer/footer.module';
import { FormDebugComponent } from './shared/form-debug/form-debug.component';
import { MessageControlErrorModule } from './shared/message-control-error/message-control-error.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { SharedModule } from './shared/shared.module';
import { SidebarModule } from './shared/sidebar/sidebar.module';
import { UploadsModule } from './uploads/uploads.module';

export const firebaseConfig = environment.firebaseConfig;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    InputActivityComponent,
    ValidateActivityComponent,
    CourseComponent,
    ControllerComponent,
    RulesComponent,
    ActivitypeTypeComponent,
    InstitutionComponent,
    Error404Component,
    FormDebugComponent,
    ToSelectIdPipe,
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
    SharedModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    UploadsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),

    MessageControlErrorModule,

    // PrimeNG
    DropdownModule,
    ToastModule,
    TableModule,
    GalleriaModule,
    LightboxModule,
    FileUploadModule,
    DialogModule,
    TooltipModule
  ],
  providers: [AuthGuard, MessageService, ActivityResolve],
  bootstrap: [AppComponent]
})
export class AppModule { }
