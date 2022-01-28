import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { Cols } from './../../../models/cols.interface';
import { Course } from './../../../models/course.interface';
import { User } from './../../../models/user.interface';
import { InstitutionService } from './../../../services/institution.service';
import { NotifyService } from './../../../services/notify.service';
import { UserService } from './../../../services/user.service';

@Component({
  selector: 'aka-controllers',
  templateUrl: './controllers.component.html',
  styleUrls: ['./controllers.component.css'],
})
export class ControllersComponent implements OnInit {
  controller: User;
  courses$: Observable<Course[]>;
  controllers$: Observable<User[]>;
  currentInstitutionUid: string;
  loading = false;
  cols: Cols[];

  constructor(
    public _messageService: MessageService,
    public _authService: AuthService,
    private _institutionService: InstitutionService,
    private _userService: UserService,
    private _notify: NotifyService
  ) {}

  ngOnInit() {
    this.cols = [
      { field: 'uid', header: 'UID' },
      { field: 'displayName', header: 'Nome' },
      { field: 'course.name', header: 'Curso' },
      { field: 'actions', header: '' },
    ];

    this._authService.user$.pipe(take(1)).subscribe((user) => {
      this.currentInstitutionUid = user.institution;
      this.courses$ = this._institutionService.getInstitutionCourses(
        this.currentInstitutionUid
      );
      this.controllers$ = this._userService.getControllerByInstitution(
        this.currentInstitutionUid
      );
    });
  }

  onSubmit({ value, valid }: { value: User; valid: boolean }) {
    if (valid) {
      this.loading = true;
      const dataUser: User = {
        uid: null,
        email: value.email,
        displayName: value.displayName,
        photoURL: null,
        status: 'A',
        roles: { controller: true },
        createdAt: new Date(),
        course: value.course,
        institution: this.currentInstitutionUid,
        password: value.password,
      };

      this._userService
        .addNew(dataUser)
        .then(() => {
          this._notify.update('success', 'Usuário criado com sucesso!');
          this.loading = false;
        })
        .catch(() => (this.loading = false));
    }
  }

  edit(obj: User) {
    this.controller = obj;
  }

  remove() {
    this._userService.delete(this.controller.uid);
    this._messageService.clear();
  }

  confirmRemove(obj) {
    this.controller = obj;
    this._messageService.add({
      key: 'removeKey',
      sticky: true,
      severity: 'warn',
      summary: 'Tem certeza?',
      detail: `Deseja realmente excluir ${obj.name}?`,
    });
  }
}
