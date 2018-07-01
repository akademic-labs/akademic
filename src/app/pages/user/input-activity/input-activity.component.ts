import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Activity } from 'app/models/activity.interface';
import { ActivityType } from 'app/models/activity-type.interface';

import { ActivityService } from 'app/services/activity.service';
import { ActivityTypeService } from 'app/services/activity-type.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'aka-input-activity',
  templateUrl: './input-activity.component.html',
  styleUrls: ['./input-activity.component.css']
})
export class InputActivityComponent implements OnInit {
  activity: Activity;
  activityForm: FormGroup;
  $activityTypes: Observable<ActivityType[]>;

  constructor(private fb: FormBuilder, public _actService: ActivityService,
    private _actTypesService: ActivityTypeService) { }

  ngOnInit() {
    this.buildForm();
    this.$activityTypes = this._actTypesService.getTypes();
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
      activityType: this.fb.group({
        id: ['', Validators.required]
      })
    });
  }

  onSubmit() {
    if (this.activityForm.valid) {
      this._actService.createActivity(this.activityForm.value)
        .then(result => {
          console.log(result);
          this.activityForm.reset();
          this.buildForm();
        });
    }
  }

}
