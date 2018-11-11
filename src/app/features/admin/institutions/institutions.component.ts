import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { Observable } from 'rxjs';

import { Institution } from '../../../models/institution.interface';
import { InstitutionService } from '../../../services/institution.service';
import { Cols } from '../../../models/cols.interface';

@Component({
  selector: 'aka-institutions',
  templateUrl: './institutions.component.html'
})
export class InstitutionsComponent implements OnInit {

  @ViewChild('inputFocus') focusIn: ElementRef;
  title = 'Instituições';
  button = 'Adicionar';
  institutionForm: FormGroup;
  institution: Institution;
  institutions$: Observable<Institution[]>;
  cols: Cols[];

  constructor(
    private _institutionFormBuilder: FormBuilder,
    private _institutionService: InstitutionService,
    private _messageService: MessageService
  ) { }

  ngOnInit() {
    this.institutions$ = this._institutionService.get();
    this.buildForm();
    this.focusIn.nativeElement.focus();

    this.cols = [
      { field: 'instituicao', header: 'Nome' },
      { field: 'cnpj', header: 'CNPJ' },
      { field: 'sigla', header: 'Sigla'},
      { field: 'uf', header: 'UF' },
      { field: 'actions', header: 'Ações' }
    ];
  }

  buildForm() {
    this.institutionForm = this._institutionFormBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      name: [null, Validators.required]
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

  remove() {
    this._institutionService.delete(this.institution.uid);
    this.institutionForm.reset();
    this.button = 'Adicionar';
    this.focusIn.nativeElement.focus();
  }

  confirm(obj) {
    this.institution = obj;
    this._messageService.add({
      key: 'confirmationKey', sticky: true, severity: 'warn', summary: 'Tem certeza?',
      detail: `Deseja realmente excluir '${obj.name}'?`
    });
  }

}
