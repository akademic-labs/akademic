import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { Activity } from 'app/models/activity.interface';
import { ActivityService } from 'app/services/activity.service';
import { MessageServicePrimeNG } from '../../../services/message.service';

@Component({
  selector: 'aka-validate-activity',
  templateUrl: './validate-activity.component.html',
  styleUrls: ['./validate-activity.component.css']
})
export class ValidateActivityComponent implements OnInit, OnDestroy {

  title = 'Validação de Atividade';
  activity: Activity;
  uidActivity: string;
  subscribe: Subscription;
  attachments = [];
  lastAction;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _activityService: ActivityService,
    private _storage: AngularFireStorage,
    private _messageService: MessageServicePrimeNG
  ) { }

  ngOnInit() {
    this.subscribe = this._route.paramMap.subscribe(params => {
      this.uidActivity = params.get('id');
      this._activityService.getActivityById(this.uidActivity)
        .subscribe(response => {
          this.activity = response;
          response.attachment.forEach(element => {
            this._storage.ref(element.url).getDownloadURL().
              subscribe(res => {
                const data = { name: element.name, type: element.type, url: res };
                this.attachments.push(data)
              });
          });
        });
    });
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  toConfirm(param) {
    this.lastAction = param;
    let msg;
    if (param === 'approve') {
      msg = 'aprovação';
    }
    if (param === 'disapprove') {
      msg = 'reprovação';
    }
    this._messageService.messageConfirm('remove', true, 'warn', '', `Confirma ${msg} da atividade '${this.activity.description}' ?`);
  }

  toAccept() {
    if (this.lastAction === 'approve') {
      this.activity.status = 'A'; // Aproved
      this._activityService.updateActivity(this.uidActivity, this.activity, 'aprovada');
    }
    if (this.lastAction === 'disapprove') {
      this.activity.status = 'R'; // Reproved
      this._activityService.updateActivity(this.uidActivity, this.activity, 'reprovada');
    }
  }

  toReject() {
    this._messageService.closeMessageConfirm('remove');
  }

}
