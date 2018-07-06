import { Attachment } from './../../models/attachment.interface';
import { Component } from '@angular/core';

import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { NotifyService } from 'app/services/notify.service';

@Component({
  selector: 'aka-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.css']
})
export class UploadPageComponent {
  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // State for dropzone CSS toggling
  isHovering: boolean;

  attach: Attachment;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private _notify: NotifyService) { }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  startUpload(event: FileList) {
    // The File object
    const file = event.item(0);

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      this._notify.update('warning', 'Arquivo não suportado.')
      return;
    }

    // The storage path
    const path = `activities-attach/${new Date().getTime()}-${file.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'atividade-complementar!' };

    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });

    this.attach = { name: file.name, type: file.type, url: path };

    // Progress monitoring
    this.percentage = this.task.percentageChanges();
  }

  // Determines if the upload task is active
  isActive(snapshot) {
    return (
      snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
    );
  }
}
