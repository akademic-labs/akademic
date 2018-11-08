import { FormGroup,  FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Rules } from '../../../models/rules.interface';
import { Course } from '../../../models/course.interface';
import { ActivityType } from 'app/models/activity-type.interface';
import { Ruleservice } from '../../../services/rules.service';
import { CourseService } from '../../../services/course.service';
import { ActivityTypeService } from './../../../services/activity-type.service';

@Component({
  selector: 'aka-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {

  title = 'Regras';
  button = 'Adicionar';
  ruleForm: FormGroup;
  rule: Rules;
  rules$: Observable<Rules[]>;
  courses$: Observable<{}>;
  activityTypes$: Observable<ActivityType[]>;
  @ViewChild('inputFocus')
  focusIn: ElementRef;

  constructor(
    private _rulesFormBuilder: FormBuilder,
    private _rulesService: Ruleservice,
    private _courseService: CourseService,
    private _activityTypeService: ActivityTypeService
  ) {}

   ngOnInit() {
    this.rules$ = this._rulesService.get();
    this.activityTypes$ = this._activityTypeService.get();
    this.courses$ = this._courseService.get();
    this.buildForm();
    this.focusIn.nativeElement.focus();
   }

  buildForm() {
    this.ruleForm = this._rulesFormBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      name: [null, Validators.required],
      hours: [null, Validators.required],
      course: [null, Validators.required],
      activityType: [null, Validators.required]
    });
  }

  save() {
    console.log(this.ruleForm.value);
    if (!this.ruleForm.get('uid').value) {
      this._rulesService.post(this.ruleForm.value);
    } else {
      this._rulesService.put(this.rule.uid, this.ruleForm.value);
    }
    this.ruleForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
  }

  edit(obj) {
    console.log(obj);
    this.ruleForm
      .patchValue({
        uid: obj.uid,
        name: obj.name,
        hours: obj.hours,
        course: obj.course,
        activityType: obj.activityType
      });
    this.rule = obj;
    this.button = 'Atualizar';
    this.focusIn.nativeElement.focus();
  }

  remove(uid) {
    console.log(uid);
    this._rulesService.delete(uid);
    this.ruleForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
  }

  compare(obj1, obj2) {
    return obj1 && obj2 ? (obj1.uid === obj2.uid && obj1.description === obj2.description) : obj1 === obj2;
  }

}
