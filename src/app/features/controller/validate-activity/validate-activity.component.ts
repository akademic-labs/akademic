import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  attachView;
  loading = true;
  form: FormGroup;
  @ViewChild('focus') focus: ElementRef;

  constructor(
    private _route: ActivatedRoute,
    private _activityService: ActivityService,
    private _storage: AngularFireStorage,
    public _messageService: MessageService,
    private _errorService: ErrorService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
    document.getElementsByClassName('main-panel').item(0).scrollTop = 0;
    this.activity = this._route.snapshot.data['activity'];
    if (this.activity.attachments.length) {
      this.activity.attachments.forEach(attachments => {
        this._storage.ref(attachments.path).getDownloadURL()
          .subscribe(
            resDonwloadURL => {
              this._storage.ref(attachments.path).getMetadata()
                .subscribe(
                  resMetaData => {
                    let src;
                    let classCss;
                    const image = true ? attachments.type.split('/')[0] === 'image' : false;
                    const pdf = true ? attachments.type.split('/')[1] === 'pdf' : false;
                    const video = true ? attachments.type.split('/')[0] === 'video' : false;
                    if (image) {
                      src = resDonwloadURL;
                      classCss = 'img-attach'
                    }
                    if (pdf) {
                      src = 'assets/img/pdf.png';
                      classCss = 'pdf-attach'
                    }
                    if (video) {
                      src = 'assets/img/video.png';
                      classCss = 'video-attach'
                    }
                    this.attachmentsView.push({ name: attachments.name, type: attachments.type, path: resDonwloadURL, size: resMetaData.size, src: src, class: classCss });
                    this.loading = false;
                    this.attachmentsView.sort()
                  },
                  error => { // error getMetaData
                    this._errorService.handleErrorByCode(error.code);
                    this.loading = false;
                  }
                );
            },
            error => { // error getDownloadURL
              this._errorService.handleErrorByCode(error.code);
              this.loading = false;
            }
          );
      });
    } else { this.loading = false; }
  }

  buildForm() {
    this.form = this._formBuilder.group({
      feedback: ['', Validators.maxLength(500)],
    });
  }

  showAttach(attach) {
    this.attachView = attach;
    // document.getElementById('main').classList.add('filter-blur');
  }

  toConfirm(isApproved: boolean) {
    this.isApproved = isApproved;
    this._messageService.add({
      key: 'confKey', sticky: true, severity: 'warn', summary: 'Tem certeza?',
      detail: `Confirma ${isApproved ? 'aprovação' : 'reprovação'} da atividade?`
    });
  }

  onAccept() {
    this.activity.status = this.isApproved ? 'Aprovada' : 'Reprovação';
    this.activity.feedback = this.form.get('feedback').value;
    this._activityService.onApprove(this.activity, this.isApproved ? 'aprovada' : 'reprovada');
  }

  // toFeedback() {
  //   this.isFeedback = true;
  //   this._messageService.clear();
  //   setTimeout(() => { this.focus.nativeElement.focus(); }, 100);
  // }

  // onSend() {
  //   this.activity.status = this.isApproved ? 'Aprovada' : 'Reprovação';
  //   this.activity.feedback = this.form.get('feedback').value;
  //   // this._activityService.onApprove(this.activity, this.isApproved ? 'aprovada' : 'reprovada');
  // }
}
