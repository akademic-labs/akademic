import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { NotifyService } from 'app/services/notify.service';
import { sortBy } from 'app/utils/utils';
import { MessageService } from 'primeng/components/common/messageservice';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { Attachment, AttachmentView } from './../../../models/attachment.interface';
import { ActivityService } from './../../../services/activity.service';
import { ErrorService } from './../../../services/error.service';

@Component({
  selector: 'aka-uploads-page',
  templateUrl: './uploads-page.component.html',
  styleUrls: ['./uploads-page.component.css']
})
export class UploadsPageComponent implements OnInit {

  folderStorage = 'dev/';
  filesAccept = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'audio/mp3'];
  maxfileSize = 50; // MB
  attachments: Attachment[] = [];
  attachmentsView: AttachmentView[] = [];
  subscribe: Subscription;
  indexDelete: number;
  attachView: AttachmentView;
  loading: boolean;
  task: AngularFireUploadTask;
  snapshot$: Observable<any>;
  percentage$: Observable<number>;
  uploadState: string;
  downloadURL$: Observable<string>;
  @Output() saveEvent = new EventEmitter();

  // State for dropzone CSS toggling
  isHovering: boolean;

  constructor(
    private _notifyService: NotifyService,
    public _messageService: MessageService,
    private _route: ActivatedRoute,
    private _storage: AngularFireStorage,
    private _activityService: ActivityService,
    private _errorService: ErrorService
  ) { }

  ngOnInit() {
    this.subscribe = this._route.paramMap.subscribe(params => {
      if (params.get('id')) {
        this.loading = true;
        this._activityService.getActivityById(params.get('id'))
          .subscribe(
            activity => {
              if (activity.attachments.length) {
                activity.attachments.forEach(attachments => {
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
                              this.attachments.push({ name: attachments.name, type: attachments.type, path: attachments.path, createdAt: resMetaData.timeCreated });
                              this.attachmentsView.push({ name: attachments.name, type: attachments.type, path: resDonwloadURL, createdAt: resMetaData.timeCreated, size: resMetaData.size, src: src, class: classCss });
                              this.loading = false;
                              // sort attachments by createdAt, because data coming in disorder
                              this.attachments = sortBy(this.attachments, 'createdAt', 'asc');
                              this.attachmentsView = sortBy(this.attachmentsView, 'createdAt', 'asc');
                            },
                            error => { // error getMetaData
                              this.loading = false;
                              this._errorService.handleErrorByCode(error.code);
                            }
                          );
                      },
                      error => { // error getDownloadURL
                        this.loading = false;
                        this._errorService.handleErrorByCode(error.code);
                      }
                    );
                });
              } else { this.loading = false; }
            },
            error => { // error activity
              this.loading = false;
              this._errorService.handleErrorByCode(error.code);
            }
          );
      }
    });
  }

  startUpload(event: FileList) {
    for (let i = 0; i < event.length; i++) {
      const file = event[i];
      const date = new Date().toLocaleDateString().split('/').reverse().join().replace(/,/g, '-');
      const time = new Date().toLocaleTimeString();
      const name = file.name;
      // The storage path
      const path = `${this.folderStorage}${date} ${time} ${name}`;
      // Totally optional metadata
      const metadata = {
        customMetadata: {
          'location': 'Araucária, PR, Brazil',
          'activity': 'complementary-activity',
          'user': 'user'
        }
      }
      // Validation if file is image, pdf or video, otherwise display message format not supported
      const image = true ? file.type.split('/')[0] === 'image' : false;
      const pdf = true ? file.type.split('/')[1] === 'pdf' : false;
      const video = true ? file.type.split('/')[0] === 'video' : false;
      const audio = true ? file.type.split('/')[0] === 'audio' : false;

      if (image || pdf || video || audio) {
        if (file.size < 1024 * 1024 * this.maxfileSize) {
          this.attachments.push({ name: file.name, type: file.type, path: path });
          this.task = this._storage.upload(path, file, metadata);
          this.percentage$ = this.task.percentageChanges();
          this.task.snapshotChanges().subscribe(res => { this.uploadState = res.state });
          this.snapshot$ = this.task.snapshotChanges();
          this.task.snapshotChanges()
            .pipe(
              finalize(() => {
                this._notifyService.update('success', `Upload efetuado com sucesso.`);
                this.downloadURL$ = this._storage.ref(path).getDownloadURL();
                this.uploadState = null;
                // this.saveEvent.emit(true);
              })).subscribe();
          this.renderAttach(file, this.downloadURL$, file.size);
        } else {
          this._notifyService.update('warning', `O tamanho do arquivo deve ser inferior a ${this.maxfileSize}MB.`);
        }
      } else {
        this._notifyService.update('warning', `Arquivo '${file.name}' não suportado. <br> Apenas arquivos com extensão: <br> ${this.filesAccept}.`.replace(/,/g, ', '));
      }
    }
  }

  renderAttach(file, downloadURL, size) {
    const image = true ? file.type.split('/')[0] === 'image' : false;
    const pdf = true ? file.type.split('/')[1] === 'pdf' : false;
    const video = true ? file.type.split('/')[0] === 'video' : false;
    const audio = true ? file.type.split('/')[0] === 'audio' : false;

    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.attachmentsView.push({ name: file.name, type: file.type, path: reader.result, size: size, src: reader.result, class: 'img-attach' });
      };
      reader.readAsDataURL(file);
    }
    if (pdf) {
      this.attachmentsView.push({ name: file.name, type: file.type, path: downloadURL, size: size, src: 'assets/img/pdf.png', class: 'pdf-attach' });
    }
    if (video) {
      this.attachmentsView.push({ name: file.name, type: file.type, path: downloadURL, size: size, src: 'assets/img/video.png', class: 'video-attach' });
    }
    if (audio) {
      this.attachmentsView.push({ name: file.name, type: file.type, path: downloadURL, size: size, src: 'assets/img/audio.png', class: 'video-attach' });
    }
  }

  confirm(attach, index: number) {
    this.indexDelete = index;
    this._messageService.add({
      key: 'confirmation', sticky: true, severity: 'warn', summary: 'Tem certeza?',
      detail: `Deseja realmente descartar o anexo '${attach.name}'?`
    });
  }

  deleteAttach() {
    this._messageService.clear();
    const path = this.attachments[this.indexDelete].path;
    this._storage.ref(path).delete().toPromise()
      .then(() => {
        this._notifyService.update('success', `Anexo: '${this.attachments[this.indexDelete].name}' deletado com sucesso.`);
        this.attachments.splice(this.indexDelete, 1);
        this.attachmentsView.splice(this.indexDelete, 1);
        this.resetProgress();
        // this.saveEvent.emit(true);
      })
      .catch((error) => {
        this._errorService.handleErrorByCode(error.code);
      });
  }

  showAttach(attach) {
    this.attachView = attach;
    // document.getElementById('main').classList.add('filter-blur');
  }

  cancelUpload() {
    const indexDelete = this.attachments.length - 1;
    this.task.cancel();
    this.percentage$ = null;
    this.uploadState = null;
    this.snapshot$ = null;
    this._notifyService.update('success', `Anexo: '${this.attachments[indexDelete].name}' cancelado com sucesso.`);
    this.attachments.splice(indexDelete, 1);
    this.attachmentsView.splice(indexDelete, 1);
  }

  toggleHover(event) {
    this.isHovering = event;
  }

  resetAttachments() {
    this.attachmentsView = [];
    this.attachments = [];
    this.ngOnDestroy();
  }

  resetProgress() {
    this.percentage$ = null;
    this.uploadState = null;
    this.snapshot$ = null;
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

}
