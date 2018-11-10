import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';
import { MessageService } from 'primeng/components/common/messageservice';

import { Activity } from '../../../models/activity.interface';
import { ActivityService } from '../../../services/activity.service';
import { AttachmentView } from './../../../models/attachment.interface';
import { ErrorService } from './../../../services/error.service';

@Component({
  selector: 'aka-validate-activity',
  templateUrl: './validate-activity.component.html',
  styleUrls: ['./validate-activity.component.css']
})
export class ValidateActivityComponent implements OnInit {

  activity: Activity;
  attachmentsView: AttachmentView[] = [];
  isApproved: boolean;
  display: boolean;
  attachView;
  loading = true;

  constructor(
    private _route: ActivatedRoute,
    private _activityService: ActivityService,
    private _storage: AngularFireStorage,
    public _messageService: MessageService,
    private _errorService: ErrorService
  ) { }

  ngOnInit() {
    this.activity = this._route.snapshot.data['activity'];

    if (this.activity.attachments.length) {
      this.activity.attachments.forEach(attachments => {
        this._storage.ref(attachments.url).getDownloadURL()
          .subscribe(
            res => {

              const image = true ? attachments.type.split('/')[0] === 'image' : false;
              const pdf = true ? attachments.type.split('/')[1] === 'pdf' : false;
              const video = true ? attachments.type.split('/')[0] === 'video' : false;

              if (image) {
                this.attachmentsView.push({ name: attachments.name, type: attachments.type, src: res, url: res, class: 'img-attach' });
              }
              if (pdf) {
                this.attachmentsView.push({ name: attachments.name, type: attachments.type, src: 'assets/img/pdf.png', url: res, class: 'pdf-attach' });
              }
              if (video) {
                this.attachmentsView.push({ name: attachments.name, type: attachments.type, src: 'assets/img/video.png', url: res, class: 'video-attach' });
              }
              this.loading = false;
            },
            error => {
              this._errorService.handleErrorByCode(error.code);
              this.loading = false;
            }
          );
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
