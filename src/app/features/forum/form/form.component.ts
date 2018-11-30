import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Cities } from './../../../models/cities.interface';
import { Post } from './../../../models/post.interface';
import { States } from './../../../models/states.interface';
import { AuthService } from './../../../services/auth.service';
import { ForumService } from './../../../services/forum.service';
import { NotifyService } from './../../../services/notify.service';
import { UtilsService } from './../../../services/utils.service';

@Component({
  selector: 'aka-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  form: FormGroup;
  states$: Observable<States[]>;
  cities$: Observable<Cities[]>;

  constructor(private _formBuilder: FormBuilder, private _forumService: ForumService,
    private _auth: AuthService, private _notify: NotifyService, private _utilsService: UtilsService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.states$ = this._utilsService.getStates();

    this.form = this._formBuilder.group({
      uid: new FormControl({ value: null, disabled: true }),
      title: ['', Validators.required],
      description: ['', Validators.required],
      local: ['', [Validators.required, Validators.maxLength(15)]],
      state: ['', Validators.required],
      city: ['', Validators.required],
      createdAt: new Date(),
      updatedAt: new Date(),
      votes: [0]
    });
  }

  onSubmit({ value, valid }: { value: Post, valid: boolean }) {
    if (valid) {
      this._forumService.create(value).then(() => {
        this.buildForm();
        this._notify.update('success', 'Evento adicionado com sucesso!');
      });
    }
  }

  getCities() {
    if (this.form.get('state').value) {
      this.cities$ = this._utilsService.getCities(this.form.get('state').value.id);
    } else {
      this.form.get('city').setValue(null);
      this.cities$ = null;
    }
  }
}
