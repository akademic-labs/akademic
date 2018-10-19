import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireUploadTask } from 'angularfire2/storage';
import { Attachment } from 'app/models/attachment.interface';
import { NotifyService } from 'app/services/notify.service';
import { MessageServicePrimeNG } from '../../services/message.service';

@Component({
  selector: 'aka-upload-page',
  templateUrl: './upload-page.component.html',
  styleUrls: ['./upload-page.component.css']
})
export class UploadPageComponent {

  folderStorage = 'top';
  fileAccept = ['image/jpeg', 'image/png', 'application/pdf', 'image/x-eps'];
  attachs: Attachment[] = [];
  uploads = [];
  attachShow = [];
  indexRemove;

  snapshot: Observable<any>;
  // Main task
  task: AngularFireUploadTask;
  // Progress monitoring
  percentage: Observable<number>;
  // State for dropzone CSS toggling
  isHovering: boolean;

  constructor(
    private _notify: NotifyService,
    public _messageService: MessageServicePrimeNG
  ) { }

  startUpload(event: FileList) {
    for (let i = 0; i < event.length; i++) {
      // Get date and hour of the moment and replace '/' per '-'
      const date = new Date().toLocaleString().replace(/\//g, '-');
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
      if (image || pdf) {
        this.attachs.push({ name: file.name, type: file.type, url: path });
        this.uploads.push({ path, file, metadata });
      } else {
        this._notify.update('warning', `Arquivo '${file.name}' não suportado.`);
      }
    }
    // Render attachments on screen
    this.renderAttach(this.uploads);
  }

  confirm(file, index: number) {
    this.indexRemove = index;
    this._messageService.messageConfirm('confirmation', true, 'warn', null, `Deseja realmente descartar o anexo '${file.name}' ?`);
  }

  renderAttach(uploads) {
    for (let i = 0; i < uploads.length; i++) {
      const reader = new FileReader();
      const file = uploads[i].file;
      reader.onloadend = () => {
        this.attachShow[i] = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeAttach() {
    this.uploads.splice(this.indexRemove, 1);
    this.attachs.splice(this.indexRemove, 1);
    this.attachShow.splice(this.indexRemove, 1);
    this._messageService.close();
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
