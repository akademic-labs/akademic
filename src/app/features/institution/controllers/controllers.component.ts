import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { Observable } from 'rxjs';

import { Controller } from '../../../models/controller.interace';
import { ControllerService } from '../../../services/controller.service';

@Component({
  selector: 'aka-controllers',
  templateUrl: './controllers.component.html',
  styleUrls: ['./controllers.component.css']
})
export class ControllersComponent implements OnInit {
  controller: Controller;
  controllers$: Observable<Controller[]>;

  constructor(
    private _controllerService: ControllerService,
    public _messageService: MessageService
  ) { }

  ngOnInit() {
    this.controllers$ = this._controllerService.get();
  }

  edit(obj) {
    this.controller = obj;
  }

  remove() {
    this._controllerService.delete(this.controller.uid);
    this._messageService.clear();
  }

  confirmRemove(obj) {
    this.controller = obj;
    this._messageService.add({
      key: 'removeKey', sticky: true, severity: 'warn', summary: 'Tem certeza?',
      detail: `Deseja realmente excluir ${obj.name}?`
    });
  }

}
