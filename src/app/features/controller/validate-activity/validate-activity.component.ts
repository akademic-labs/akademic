import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from 'angularfire2/storage';
import { MessageService } from 'primeng/components/common/messageservice';

import { Activity } from '../../../models/activity.interface';
import { ActivityService } from '../../../services/activity.service';
import { AttachmentView } from './../../../models/attachment.interface';
import { ErrorService } from './../../../services/error.service';
import { sortBy } from './../../../utils/utils';
import { NotifyService } from 'app/services/notify.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'aka-validate-activity',
  templateUrl: './validate-activity.component.html',
  styleUrls: ['./validate-activity.component.css']
})
export class ValidateActivityComponent implements OnInit {

  activity: Activity;
  attachmentsView: AttachmentView[] = [];
  attachView: AttachmentView;
  isApproved: boolean;
  loading: boolean;
  form: FormGroup;
  @ViewChild('inputFeedback') inputFeedback: ElementRef;
  isFeedback: boolean;
  subscription: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _activityService: ActivityService,
    private _storage: AngularFireStorage,
    public _messageService: MessageService,
    private _errorService: ErrorService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _notifyService: NotifyService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.loading = true;
    document.getElementsByClassName('main-panel').item(0).scrollTop = 0;
    // this.activity = this._route.snapshot.data['activity'];
    this.subscription = this._route.params
      .subscribe(params => {
        if (params.id) {
          this._activityService.getActivityById(params.id)
            .subscribe(
              res => {
                this.activity = res;
                if (res.attachments) {
                  if (res.attachments.length) {
                    res.attachments.forEach(attachments => {
                      this.attachmentsView = [];
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
                                  const audio = true ? attachments.type.split('/')[0] === 'audio' : false;
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
                                  if (audio) {
                                    src = 'assets/img/audio.png';
                                    classCss = 'video-attach'
                                  }
                                  this.attachmentsView.push({ name: attachments.name, type: attachments.type, path: resDonwloadURL, createdAt: resMetaData.timeCreated, size: resMetaData.size, src: src, class: classCss });
                                  this.loading = false;
                                  // sort attachments by createdAt, because data coming in disorder
                                  this.attachmentsView = sortBy(this.attachmentsView, 'createdAt', 'asc');
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
              },
              error => {
                this._errorService.handleErrorByCode(error);
              }
            );
        }
      });
  }

  buildForm() {
    this.form = this._formBuilder.group({
      feedback: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
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
    this.activity.status = this.isApproved ? 'Aprovada' : 'Reprovada';
    this._messageService.clear();
    if (this.isApproved) {
      this._activityService.onApprove(this.activity)
        .then(() => {
          this._notifyService.update('success', `Atividade aprovada com sucesso!`);
          this._router.navigate(['/dashboard']);
        });
    } else {
      this.isFeedback = true;
      this.form.get('feedback').markAsTouched();
      setTimeout(() => { this.inputFeedback.nativeElement.focus(); }, 100);
    }
  }

  onDisapprove() {
    this.activity.feedback = this.form.get('feedback').value;
    this._activityService.onApprove(this.activity)
      .then(() => {
        this._notifyService.update('success', `Atividade reprovada com sucesso!`);
        this._router.navigate(['/dashboard']);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
