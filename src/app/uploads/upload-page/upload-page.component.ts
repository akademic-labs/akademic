import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Attachment } from 'app/models/attachment.interface';
import { NotifyService } from 'app/services/notify.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Observable, Subscription } from 'rxjs';

import { ActivityService } from './../../services/activity.service';

@Component({
  selector: 'aka-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.css']
})
export class UploadPageComponent implements OnInit {

  folderStorage = 'test';
  fileAccept = ['image/jpeg', 'image/png', 'application/pdf', 'image/x-eps', 'video/mp4'];
  // 'video/mp4', 'audio/mp3'
  attachments: Attachment[] = [];
  // @Input() attachments: Attachment[] = [];
  uploads = [];
  attachShow = [];
  indexRemove;
  attachView;
  subscribe: Subscription;
  loading = true;

  snapshot: Observable<any>;
  // Main task
  task: AngularFireUploadTask;
  // Progress monitoring
  percentage: Observable<number>;
  // State for dropzone CSS toggling
  isHovering: boolean;

  constructor(
    private _notify: NotifyService,
    public _messageService: MessageService,
    private _route: ActivatedRoute,
    private _storage: AngularFireStorage,
    private _activityService: ActivityService
  ) { }

  ngOnInit() {
    this.subscribe = this._route.paramMap.subscribe(params => {
      if (params.get('id')) {
        this._activityService.getActivityById(params.get('id'))
          .subscribe(activity => {
            if (activity.attachments.length) {
              activity.attachments.forEach(element => {
                this._storage.ref(element.url).getDownloadURL()
                  .subscribe(res => {
                    this.attachments.push({ name: element.name, type: element.type, url: element.url })
                    this.attachShow.push({ name: element.name, type: element.type, url: res });
                    this.loading = false;
                  });
              });
            } else { this.loading = false; }
          });
      } else { this.loading = false; }
    });
  }

  startUpload(event: FileList) {
    for (let i = 0; i < event.length; i++) {
      // Get date and hour of the moment and replace '/' per '-'
      const date = new Date().toLocaleString('pt-br', { timeZone: 'UTC' }).replace(/\//g, '-');
      const file = event[i];
      const name = file.name;
      // The storage path
      const path = `${this.folderStorage}/${date} ${name}`;
      // Totally optional metadata
      const metadata = {
        customMetadata: {
          'location': 'Araucária, PR, Brazil',
          'activity': 'complementary-activity'
        }
      }
      // Validation if file is image or pdf, case not, show message unsuportted format
      const image = true ? file.type.split('/')[0] === 'image' : false;
      const pdf = true ? file.type.split('/')[1] === 'pdf' : false;
      const video = true ? file.type.split('/')[0] === 'video' : false;
      if (image || pdf || video) {
        this.attachments.push({ name: file.name, type: file.type, url: path });
        this.uploads.push({ path, file, metadata });
      } else {
        this._notify.update('warning', `Arquivo '${file.name}' não suportado.`);
      }
    }
    // Render attachments on screen
    this.renderAttach(this.uploads);
  }

  confirm(attach, index: number) {
    this.indexRemove = index;
    this._messageService.add({
      key: 'confirmation', sticky: true, severity: 'warn', summary: 'Tem certeza?',
      detail: `Deseja realmente descartar o anexo '${attach.name}'?`
    });
  }

  renderAttach(uploads) {
    for (let i = 0; i < uploads.length; i++) {
      const reader = new FileReader();
      const file = uploads[i].file;
      const image = true ? file.type.split('/')[0] === 'image' : false;
      const pdf = true ? file.type.split('/')[1] === 'pdf' : false;
      const video = true ? file.type.split('/')[0] === 'video' : false;
      if (image) {
        reader.onloadend = () => {
          this.attachShow.push({ name: file.name, type: file.type, url: reader.result });
        };
        reader.readAsDataURL(file);
      }
      if (pdf) {
        this.attachShow.push({ name: file.name, type: file.type, url: 'assets/img/pdf.png' });
      }
      if (video) {
        this.attachShow.push({ name: file.name, type: file.type, url: 'assets/img/video.png' });
      }
    }
  }

  showAttach(attach) {
    this.attachView = attach;
    // document.getElementById('main').classList.add('filter-blur');
  }

  removeAttach() {
    this.uploads.splice(this.indexRemove, 1);
    this.attachments.splice(this.indexRemove, 1);
    this.attachShow.splice(this.indexRemove, 1);
    this._messageService.clear();
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return (
      snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
    );
  }

}
