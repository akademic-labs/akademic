import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { Observable } from 'rxjs';

import { Controller } from '../../../models/controller.interace';
import { Course } from '../../../models/course.interface';
import { CourseService } from '../../../services/course.service';
import { ControllerService } from '../../../services/controller.service';

@Component({
  selector: 'aka-controllers',
  templateUrl: './controllers.component.html',
  styleUrls: ['./controllers.component.css']
})
export class ControllersComponent implements OnInit {

  @ViewChild('inputFocus') focusIn: ElementRef;
  button = 'Adicionar';
  controllerForm: FormGroup;
  controller: Controller;
  controllers$: Observable<Controller[]>;
  courses$: Observable<Course[]>;

  constructor(
    private _controllerFormBuilder: FormBuilder,
    private _controllerService: ControllerService,
    private _courseService: CourseService,
    public _messageService: MessageService
  ) { }

  ngOnInit() {
    this.courses$ = this._courseService.get();
    this.controllers$ = this._controllerService.get();
    this.buildForm();
    this.focusIn.nativeElement.focus();
  }

  buildForm() {
    this.controllerForm = this._controllerFormBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      name: [null, [
        Validators.required,
        Validators.pattern('[a-zA-ZÀ-ú ]*'),
        Validators.maxLength(20)
      ]],
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

  remove() {
    this._controllerService.delete(this.controller.uid);
    this.controllerForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
    this._messageService.clear();
  }

  compareCourse(obj1, obj2) {
    return obj1 && obj2 ? (obj1.uid === obj2.uid) : obj1 === obj2;
  }

  confirmRemove(obj) {
    this.controller = obj;
    this._messageService.add({
      key: 'removeKey', sticky: true, severity: 'warn', summary: 'Tem certeza?',
      detail: `Deseja realmente excluir '${obj.name}'?`
    });
  }

}
