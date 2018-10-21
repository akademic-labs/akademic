import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../../../models/course.interface';
import { CourseService } from '../../../services/course.service';
import { Institution } from 'app/models/institution.interface';
import { InstitutionService } from 'app/services/institution.service';
import { MessageServicePrimeNG } from 'app/services/message.service';

@Component({
  selector: 'aka-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courseForm: FormGroup;
  course: Course;
  courses$: Observable<{}>;
  institutions$: Observable<Institution[]>;
  @ViewChild('inputFocus') focus: ElementRef;
  button = 'Adicionar';

  constructor(
    private _courseFormBuilder: FormBuilder,
    private _courseService: CourseService,
    private _institutionService: InstitutionService,
    public _messageService: MessageServicePrimeNG,
  ) { }

  ngOnInit() {
    this.courses$ = this._courseService.getJoinInstitution();
    this.institutions$ = this._institutionService.get();
    this.buildForm();
    this.focus.nativeElement.focus();
  }

  buildForm() {
    this.courseForm = this._courseFormBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      name: [null, Validators.required],
      institutionUid: [null, Validators.required]
    });
  }

  save() {
    // before submit assigns only the institution uid in the course
    this.courseForm.patchValue({ institutionUid: this.courseForm.get('institutionUid').value.uid });
    if (!this.courseForm.get('uid').value) {
      this._courseService.post(this.courseForm.value);
    } else {
      this._courseService.put(this.course.uid, this.courseForm.value);
    }
    this.renderForm();
  }

  edit(obj) {
    const institutionUid = { uid: obj.institutionUid, name: obj.institution.name };
    this.courseForm.patchValue({ uid: obj.uid, name: obj.name, institutionUid: institutionUid });
    this.course = obj;
    this.button = 'Atualizar';
    this.focus.nativeElement.focus();
  }

  remove() {
    this._courseService.delete(this.course.uid);
    this.renderForm();
    this._messageService.close();
  }

  renderForm() {
    this.button = 'Adicionar';
    this.courseForm.reset();
    this.focus.nativeElement.focus();
  }

  confirm(obj) {
    this.course = obj;
    this._messageService.messageConfirm('confirmation', true, 'warn', null, `Deseja realmente excluir '${obj.name}' ?`);
  }

}
