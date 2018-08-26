import { Router } from '@angular/router';
import { CityStateService } from './../../../services/city-state.service';
import { ValidatorService } from './../../../services/validator.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { States } from 'app/models/states.interface';
import { Cities } from 'app/models/cities.interface';
import { Activity } from 'app/models/activity.interface';
import { ActivityType } from 'app/models/activity-type.interface';

import { ActivityService } from 'app/services/activity.service';
import { ActivityTypeService } from 'app/services/activity-type.service';
import { Observable } from 'rxjs';

// import { UploadPageComponent } from 'app/uploads/upload-page/upload-page.component';
import { NotifyService } from '../../../services/notify.service';
import {
  AngularFireUploadTask,
  AngularFireStorage
} from 'angularfire2/storage';

@Component({
  selector: 'aka-input-activity',
  templateUrl: './input-activity.component.html',
  styleUrls: ['./input-activity.component.css']
})
export class InputActivityComponent implements OnInit {
  // @ViewChild(UploadPageComponent) fileUpload: UploadPageComponent;

  title = 'Entrada de Atividade';
  activity: Activity;
  activityForm: FormGroup;
  $activityTypes: Observable<ActivityType[]>;
  $states: Observable<States[]>;
  $cities: Observable<Cities[]>;
  disabledSave: boolean;
  @ViewChild('inputFocus')
  focusIn: ElementRef;

  task: AngularFireUploadTask;
  // Progress monitoring
  percentage: Observable<number>;
  snapshot: Observable<any>;
  // State for dropzone CSS toggling
  isHovering: boolean;
  // attach: Attachment;
  attach = [];
  attachmentsRender = [];
  attachments = [];

  constructor(
    private fb: FormBuilder,
    public _actService: ActivityService,
    private _actTypesService: ActivityTypeService,
    private _http: HttpClient,
    private _notify: NotifyService,
    private validatorService: ValidatorService,
    private storage: AngularFireStorage,
    private _cityStateService: CityStateService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.buildForm();
    this.$activityTypes = this._actTypesService.get();
    this.$states = this._cityStateService.getStates();
    this.focusIn.nativeElement.focus();
  }

  getCities() {
    const state = this.activityForm.get('state').value;
    this.$cities = this._cityStateService.getCities(state.id);
  }

  buildForm() {
    this.activityForm = this.fb.group({
      initialDate: ['', Validators.required],
      finalDate: ['', Validators.required],
      createdAt: [new Date().toISOString().split('T')[0]],
      description: ['', Validators.required],
      hoursDuration: ['', Validators.required],
      local: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      schoolYear: ['', Validators.required],
      semester: ['', Validators.required],
      observation: [''],
      activityType: ['', Validators.required],
      attach: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.activityForm.valid) {
      this._actService
        .createActivity(this.activityForm.value, this.attach)
        .then(result => {
          console.log(result);
          this.activityForm.reset();
          this.attachmentsRender = null;
          this.focusIn.nativeElement.focus();
        });
      // Upload Attachments
      for (let i = 0; i < this.attachments.length; i++) {
                                        // path,                file,                   customMetadata
        this.task = this.storage.upload(this.attachments[i][0], this.attachments[i][1], this.attachments[i][2]);
        // Progress monitoring
        this.percentage = this.task.percentageChanges();
      }
      // this._router.navigate(['/dashboard']);
    } else {
      this.validatorService.checkOut(this.activityForm);
      this.disabledSave = true;
    }
  }

  renderAttach(event) {
    for (let index = 0; index < event.length; index++) {
      const reader = new FileReader();
      const file = event[index][1];
      // const file = event[index][2];
      reader.onloadend = () => {
        this.attachmentsRender[index] = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  startAttach(event: FileList) {
    for (let i = 0; i < event.length; i++) {
      const path = `test/${new Date().toISOString().split('T')[0]}-${event.item(i).name}`;
      // this.path = `activities-attach/${new Date().getTime()}-${this.file[index].name}`;
      const customMetadata = { app: 'atividade-complementar!' };

      const file = [];
      file.push(path, event.item(i), { customMetadata });
      // file.push(this.autoIncrement(this.attachments), path, event.item(i), { customMetadata });
      this.attachments.push(file);
      this.attach.push({
        name: event.item(i).name,
        type: event.item(i).type,
        url: path
      });

      // Render attachments on screen
      this.renderAttach(this.attachments);
    }

    // Client-side validation example
    // if (this.file.type.split('/')[0] !== 'image') {
    //   this._notify.update('warning', 'Arquivo não suportado.');
    //   return;
    // }
  }

  autoIncrement(obj) {
    let increment;
    if (obj.length > 0) {
      increment = Object.keys(obj).length + 1;
    } else {
      increment = 1;
    }
    return increment;
  };

  removeAttach(event) {
    this.attachmentsRender = [];
    this.attachments = [];
    console.log('event: ' + event);

    // this.attachments.slice(1, 1);

  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }

}
