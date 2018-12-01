import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, combineLatest } from 'rxjs';
import { take, switchMap, map } from 'rxjs/operators';

import { Comment } from './../models/comment.interface';
import { Post } from './../models/post.interface';
import { documentJoin } from './../rxjs-operators/document-join.operator';
import { leftJoinDocument } from './../rxjs-operators/left-join-document.operator';
import { AuthService } from './auth.service';
import { ErrorService } from './error.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  constructor(
    private _afs: AngularFirestore,
    private _errorService: ErrorService,
    private _dbService: FirestoreService,
    private _authService: AuthService
  ) { }

  get(): Observable<Post[]> {
    return this._dbService.colWithId$<Post>('posts')
      .pipe(
        leftJoinDocument(this._afs, 'owner', 'users'),
        switchMap((posts: Post[]) => {
          const result = posts.map(post => {
            return this.getComments(post.uid)
              .pipe(
                map(comments => Object.assign(post, { comments }))
              );
          });
          return combineLatest(...result);
        })
      );
  }

  getComments(postUid: string): Observable<Comment[]> {
    return this._dbService.colWithId$<Comment>(`posts/${postUid}/comments`)
      .pipe(
        leftJoinDocument(this._afs, 'user', 'users')
      );
  }

  getByOwner(uid: string) {
    return this._dbService.colWithId$<Post>('posts', ref => ref.where('owner', '==', uid));
  }

  getById(uid: string): Observable<Post> {
    return this._dbService.docWithId$<Post>('posts/' + uid).pipe(
      documentJoin(this._afs, { user: 'users' })
    );
  }

  async addComment(postUid: string, comment: Comment) {
    try {
      return this._afs.collection('posts').doc(postUid).collection('comments').add(comment);
    } catch (error) {
      return this._errorService.handleErrorByCode(error.code);
    }
  }

  async create(post: Post) {
    const user = await this._authService.user$.pipe(take(1)).toPromise();
    post.owner = user.uid;
    await this._dbService.add<Post>('posts', post);
  }

  async update(post: Post, uid: string) {
    const user = await this._authService.user$.pipe(take(1)).toPromise();
    post.owner = user.uid;
    await this._dbService.set<Post>(`posts/${uid}`, post);
  }

  vote(post: Post) {
    return this._dbService.set<Post>(`posts/${post.uid}`, post);
  }
}
