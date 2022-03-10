import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';

import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  task: AngularFireUploadTask;
  percentage: number;

  constructor(
    private _storage: AngularFireStorage,
    private _errorService: ErrorService
  ) {}

  // upload(array): Observable<any> {
  upload(array) {
    return new Promise((resolve, reject) => {
      // return Observable.create(observer => {
      // return new Observable(() => {
      // return Observable.of(
      for (let i = 0; i < array.length; i++) {
        // main task
        this.task = this._storage.upload(
          array[i].path,
          array[i].file,
          array[i].metadata
        );
        this.task.percentageChanges().subscribe(
          (res) => {
            this.percentage = res;
            console.log('service');
            console.log(res);
            return resolve(res);
          },
          (error) => {
            this._errorService.handleErrorByCode(error.code);
            return reject(error);
          },
          () => {
            // this._notifyService.update('success', 'Upload efetuado com sucesso!');
            console.log('termnei service');
            // observer.complete();
            // this._router.navigate(['/dashboard']);
          }
        );
      }
      // )
    });
    // },
    // error => error
  }

  progress() {
    return this.percentage;
  }
}

// async function waitForPromise() {
//   let result = await Promise.resolve('this is a sample promise');
// }

// this._storageService.upload(this.fileUpload.uploads)
// OBSERVABLE
//   .subscribe(res => { });
// res => {
//   console.log('submit res');
//   console.log(res);
//   // return resolve(res);
// },
//   error => {
//     console.log('submit error');
//     console.log(error);
//   },
//   () => {
//     console.log('submit ())');
//   }
//   );
// PROMISE
// .then(
//   res => {
//     console.log('submit res');
//     console.log(res);
//   },
//   error => {
//     console.log('submit error');
//     console.log(error);
//   }
// );
