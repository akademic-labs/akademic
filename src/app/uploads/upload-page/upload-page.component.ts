import { Component } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Attachment } from 'app/models/attachment.interface';
import { CityStateService } from './../../services/city-state.service';
import { NotifyService } from 'app/services/notify.service';

@Component({
  selector: 'aka-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.css']
})
export class UploadPageComponent {

  folderStorage = 'test';

  // Main task
  task: AngularFireUploadTask;

  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;

  // State for dropzone CSS toggling
  isHovering: boolean;

  attach: Attachment;

  // Upload old
  attachmentsRender = [];

  // Upload new
  attachmentsUpload = [];
  attachmentsActivity = [];

  constructor(
    private storage: AngularFireStorage,
    private _notify: NotifyService,
    private _service: CityStateService
  ) { }

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

  // UPLOAD OLD - COMPONENT MANUAL
  // renderAttach(event) {
  //   for (let index = 0; index < event.length; index++) {
  //     const reader = new FileReader();
  //     const file = event[index][1];
  //     // const file = event[index][2];
  //     reader.onloadend = () => {
  //       this.attachmentsRender[index] = reader.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }
  // startAttach(event: FileList) {
  //   for (let i = 0; i < event.length; i++) {
  //     const path = `test/${new Date().toISOString().split('T')[0]}-${event.item(i).name}`;
  //     // this.path = `activities-attach/${new Date().getTime()}-${this.file[index].name}`;
  //     const customMetadata = { app: 'atividade-complementar!' };

  //     const file = [];
  //     file.push(path, event.item(i), { customMetadata });
  //     // file.push(this.autoIncrement(this.attachments), path, event.item(i), { customMetadata });
  //     this.attachments.push(file);
  //     this.attach.push({
  //       name: event.item(i).name,
  //       type: event.item(i).type,
  //       url: path
  //     });

  //     // Render attachments on screen
  //     this.renderAttach(this.attachments);
  //   }
  // }
  // autoIncrement(obj) {
  //   let increment;
  //   if (obj.length > 0) {
  //     increment = Object.keys(obj).length + 1;
  //   } else {
  //     increment = 1;
  //   }
  //   return increment;
  // };
  // tslint:disable-next-line:max-line-length
  // this.task = this.storage.upload(this.uploadComponent.attachments[i][0], this.uploadComponent.attachments[i][1], this.uploadComponent.attachments[i][2]);

  // UPLOAD NEW - COMPONENT PRIMENG
  uploadAttach(event) {
    for (const file of event.files) {
      // get date and hour of the moment and replace '/' per '-'
      const date = new Date().toLocaleString().replace(/\//g, '-');
      const name = file.name;
      const path = `${this.folderStorage}/${date} ${name}`;
      // this._service.getLocation()
      //   .subscribe(res => {
      //     console.log(res);
      //   })
      const metadata = {
        customMetadata: {
          'location': 'Araucária, PR, Brazil',
          'activity': 'complementary-activity'
        }
      }
      this.attachmentsUpload.push({ path, file, metadata });
      this.attachmentsActivity.push({ name: file.name, type: file.type, url: path });
    }
  }
  removeAttach(file) {
    // get index object where name equals file params
    const index = this.attachmentsUpload.findIndex(x => x.file.name === file.file.name);
    // then remove file objects
    this.attachmentsUpload.splice(index, 1);
    this.attachmentsActivity.splice(index, 1);
  }
  clearAttachments() {
    this.attachmentsUpload = [];
    this.attachmentsActivity = [];
  }

}
