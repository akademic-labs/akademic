import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Attachment } from 'app/models/attachment.interface';
import { NotifyService } from 'app/services/notify.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AttachmentView } from './../../models/attachment.interface';
import { ActivityService } from './../../services/activity.service';
import { ErrorService } from './../../services/error.service';

@Component({
  selector: 'aka-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.css']
})
export class UploadPageComponent implements OnInit {

  folderStorage = 'dev';
  fileAccept = ['image/jpeg', 'image/png', 'application/pdf', 'image/x-eps', 'video/mp4'];
  fileSize = 50; // MB

  attachments: Attachment[] = [];
  attachmentsView: AttachmentView[] = [];
  subscribe: Subscription;
  indexDelete;
  attachView;
  loading;

  task: AngularFireUploadTask;
  snapshot$: Observable<any>;
  percentage$: Observable<number>;
  uploadState$: Observable<any>;
  downloadURL;

  // State for dropzone CSS toggling
  isHovering: boolean;

  constructor(
    private _notify: NotifyService,
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
                  this._storage.ref(attachments.url).getDownloadURL()
                    .subscribe(
                      res => {
                        this.attachments.push({ name: attachments.name, type: attachments.type, url: attachments.url });

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
                      error => { // error attachments
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
      // const date = new Date().toLocaleString().replace(/\//g, '-');
      // const date = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const date = new Date().toLocaleDateString().split('/').reverse().toString().replace(',', '-').replace(',', '-');
      const time = new Date().toLocaleTimeString();
      const name = file.name;
      // The storage path
      const path = `${this.folderStorage}/${date} ${time} ${name}`;
      // Totally optional metadata
      const metadata = {
        customMetadata: {
          'location': 'Araucária, PR, Brazil',
          'activity': 'complementary-activity'
        }
      }
      // Validation if file is image, pdf or video, otherwise display message format not supported
      const image = true ? file.type.split('/')[0] === 'image' : false;
      const pdf = true ? file.type.split('/')[1] === 'pdf' : false;
      const video = true ? file.type.split('/')[0] === 'video' : false;

      if (image || pdf || video) {
        if (file.size < 1024 * 1024 * this.fileSize) {
          this.attachments.push({ name: file.name, type: file.type, url: path });
          this.task = this._storage.upload(path, file, metadata);
          this.percentage$ = this.task.percentageChanges();
          this.uploadState$ = this.task.snapshotChanges().pipe(map(s => s.state));
          this.snapshot$ = this.task.snapshotChanges();
          this.task.snapshotChanges()
            .pipe(
              finalize(() => {
                this._notify.update('success', `Upload efetuado com sucesso.`);
                this._storage.ref(path).getDownloadURL()
                  .subscribe(
                    res => {
                      // console.log(res);
                      this.downloadURL = res;
                    }
                  );
              })).subscribe();
          this.renderAttach(file, this.downloadURL);
        } else {
          this._notify.update('warning', `O tamanho do arquivo deve ser inferior a ${this.fileSize}MB.`);
        }
      } else {
        this._notify.update('warning', `Arquivo '${file.name}' não suportado. <br> Apenas arquivos com extensão: jpeg, png, pdf ou mp4.`);
      }
    }
  }

  renderAttach(file, downloadURL) {

    const image = true ? file.type.split('/')[0] === 'image' : false;
    const pdf = true ? file.type.split('/')[1] === 'pdf' : false;
    const video = true ? file.type.split('/')[0] === 'video' : false;

    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.attachmentsView.push({ name: file.name, type: file.type, src: reader.result, url: downloadURL, class: 'img-attach' });
      };
      reader.readAsDataURL(file);
    }
    if (pdf) {
      this.attachmentsView.push({ name: file.name, type: file.type, src: 'assets/img/pdf.png', url: downloadURL, class: 'pdf-attach' });
    }
    if (video) {
      this.attachmentsView.push({ name: file.name, type: file.type, src: 'assets/img/video.png', url: downloadURL, class: 'video-attach' });
    }
  }

  deleteAttach() {
    this._messageService.clear();
    const path = this.attachments[this.indexDelete].url;
    this._storage.ref(path).delete().toPromise()
      .then(() => {
        this._notify.update('success', `Anexo: '${this.attachments[this.indexDelete].name}' deletado com sucesso.`);
        this.attachments.splice(this.indexDelete, 1);
        this.attachmentsView.splice(this.indexDelete, 1);
      })
      .catch((error) => {
        this._errorService.handleErrorByCode(error.code);
      })
  }

  confirm(attach, index: number) {
    this.indexDelete = index;
    this._messageService.add({
      key: 'confirmation', sticky: true, severity: 'warn', summary: 'Tem certeza?',
      detail: `Deseja realmente descartar o anexo '${attach.name}'?`
    });
  }

  showAttach(attach) {
    this.attachView = attach;
    // document.getElementById('main').classList.add('filter-blur');
  }

  cancelUpload() {
    this.task.cancel();
    this.percentage$ = null;
    this.uploadState$ = null;
    this.snapshot$ = null;
  }

  toggleHover(event) {
    this.isHovering = event;
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

}
