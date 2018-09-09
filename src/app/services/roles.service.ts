import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor() {
  }

  // helpers role-based authorization, to be used in a *ngIf or similar

  isStudent(user: User): boolean {
    const allowed = ['student', 'administrator'];
    return this.checkAuthorization(user, allowed);
  }

  isController(user: User): boolean {
    const allowed = ['controller', 'administrator'];
    return this.checkAuthorization(user, allowed);
  }

  isAdmin(user: User): boolean {
    const allowed = ['administrator'];
    return this.checkAuthorization(user, allowed);
  }

  // determines if user has matching role
  public checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) { return false; }

    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }

    return false;
  }
}

