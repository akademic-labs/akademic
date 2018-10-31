import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';
import { MessageService } from 'primeng/components/common/messageservice';

import { Activity } from '../../../models/activity.interface';
import { ActivityService } from '../../../services/activity.service';

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
    public _messageService: MessageService
  ) { }

  ngOnInit() {
    this.activity = this._route.snapshot.data['activity'];

    if (this.activity.attachments) {
      this.activity.attachments.forEach(element => {
        this._storage.ref(element.url).getDownloadURL()
          .subscribe(res => {
            this.attachments.push({ name: element.name, type: element.type, url: res }),
              this.loading = false;
          });
      });
    } else { this.loading = false; }
  }

  ngAfterViewInit() {
    // window.scrollTo(0, 0);
    // const contentContainer = document.querySelector('div') || window;
    // contentContainer.scrollTo(0, 0);
  }

  showAttach(attach) {
    this.attachView = attach;
    // document.getElementById('main').classList.add('filter-blur');
  }

  toConfirm(isApproved: boolean) {
    this.isApproved = isApproved;
    this._messageService.add({
      key: 'confKey', severity: 'warn', summary: 'Tem certeza?',
      detail: `Confirma ${isApproved ? 'aprovação' : 'reprovação'} da atividade?`
    });
  }

  onAccept() {
    this.activity.status = this.isApproved ? 'Aprovada' : 'Reprovação';
    this._activityService.onApprove(this.activity, this.isApproved ? 'aprovada' : 'reprovada');
  }
}
