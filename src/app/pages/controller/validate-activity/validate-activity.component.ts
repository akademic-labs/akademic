import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';

import { Activity } from '../../../models/activity.interface';
import { ActivityService } from '../../../services/activity.service';
import { MessageServicePrimeNG } from '../../../services/message.service';

@Component({
  selector: 'aka-validate-activity',
  templateUrl: './validate-activity.component.html',
  styleUrls: ['./validate-activity.component.css']
})
export class ValidateActivityComponent implements OnInit {

  activity: Activity;
  attachments = [];
  isApproved: boolean;
  display: boolean;
  attachView;
  loading = true;

  constructor(
    private _route: ActivatedRoute,
    private _activityService: ActivityService,
    private _storage: AngularFireStorage,
    public _messageService: MessageServicePrimeNG,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.activity = this._route.snapshot.data['activity'];

    if (this.activity.attachments !== undefined) {
      this.activity.attachments.forEach(element => {
        this._storage.ref(element.url).getDownloadURL()
          .subscribe(res => {
            this.attachments.push({ name: element.name, type: element.type, url: res }),
              this.loading = false;
          });
      });
    } else { this.loading = false; }
  }

  showAttach(attach) {
    this.attachView = attach;
  }

  toConfirm(isApproved: boolean) {
    this.isApproved = isApproved;
    this._messageService.messageConfirm('confirmation', true, 'warn', null,
      `Confirma ${isApproved ? 'aprovação' : 'reprovação'} da atividade?`);
  }

  onAccept() {
    this.activity.status = this.isApproved ? 'Aprovada' : 'Reprovação';
    this._activityService.onApprove(this.activity, this.isApproved ? 'aprovada' : 'reprovada');
  }
}
