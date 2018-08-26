import { Course } from './../../../models/course.interface';
import { ControllerService } from './../../../services/controller.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Controller } from '../../../models/controller.interace';
import { CourseService } from '../../../services/course.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'aka-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.css']
})
export class ControllerComponent implements OnInit {

  title = 'Controladores';
  button = 'Adicionar';
  controllerForm: FormGroup;
  controller: Controller;
  $controllers: Observable<Controller[]>;
  $courses: Observable<Course[]>;
  @ViewChild('inputFocus') focusIn: ElementRef;

  constructor(
    private _controllerFormBuilder: FormBuilder,
    private _controllerService: ControllerService,
    private _courseService: CourseService
  ) {}

  ngOnInit() {
    this.$courses = this._courseService.get();
    this.$controllers = this._controllerService.get();
    this.buildForm();
    this.focusIn.nativeElement.focus();
  }

  // tslint:disable-next-line:member-ordering
  validatorsName = [
    Validators.required,
    Validators.pattern('[a-zA-ZÀ-ú ]*'),
    Validators.maxLength(20)
  ];

  buildForm() {
    this.controllerForm = this._controllerFormBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      name: [null, Validators.compose(this.validatorsName)],
      course: [null, Validators.required]
    });
  }

  save() {
    if (!this.controllerForm.get('uid').value) {
      this._controllerService.post(this.controllerForm.value);
    } else {
      this._controllerService.put(this.controller.uid, this.controllerForm.value);
    }
    this.controllerForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
  }

  edit(obj) {
    this.controllerForm.patchValue({ uid: obj.uid, name: obj.name, course: obj.course });
    this.controller = obj;
    this.button = 'Atualizar';
    this.focusIn.nativeElement.focus();
  }

  remove(uid) {
    this._controllerService.delete(uid);
    this.controllerForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
  }

  compareCourse(obj1, obj2) {
    return obj1 && obj2 ? (obj1.uid === obj2.uid) : obj1 === obj2;
  }

}
