import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Institution } from '../../../models/institution.interface';
import { InstitutionService } from '../../../services/institution.service';

@Component({
  selector: 'aka-institution',
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.css']
})
export class InstitutionComponent implements OnInit {

  title = 'Instituições';
  button = 'Adicionar';
  institutionForm: FormGroup;
  institution: Institution;
  institutions$: Observable<Institution[]>;
  @ViewChild('inputFocus') focusIn: ElementRef;

  constructor(
    private _institutionFormBuilder: FormBuilder,
    private _institutionService: InstitutionService
  ) { }

  ngOnInit() {
    this.institutions$ = this._institutionService.get();
    this.buildForm();
    this.focusIn.nativeElement.focus();
  }

  buildForm() {
    this.institutionForm = this._institutionFormBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      name: [null, Validators.compose([Validators.required])]
    });
  }

  save() {
    if (!this.institutionForm.get('uid').value) {
      this._institutionService.post(this.institutionForm.value);
    } else {
      this._institutionService.put(this.institution.uid, this.institutionForm.value);
    }
    this.institutionForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
  }

  edit(obj) {
    this.institutionForm.patchValue({ uid: obj.uid, name: obj.name });
    this.institution = obj;
    this.button = 'Atualizar';
    this.focusIn.nativeElement.focus();
  }

  remove(uid) {
    this._institutionService.delete(uid);
    this.institutionForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
  }

}
