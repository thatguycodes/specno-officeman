import { Injectable } from '@angular/core';
import { Office } from 'src/app/shared/models/office.model';
import { Staff } from 'src/app/shared/models/staff.model';

import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireList } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotifyService } from './notify.service';

@Injectable({
  providedIn: 'root'
})
export class OfficemanService {

  officesRef: AngularFireList<Office>;
  staffRef: AngularFireList<Staff>;

  constructor(public db: AngularFireDatabase, private notify: NotifyService) {
    this.officesRef = db.list<Office>('/offices');
    // this.staffRef = db.list<Staff>('/staff');
  }
  getAll(): Observable<Office[]> {
    return this.officesRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(offices => ({ key: offices.payload.key, ...offices.payload.val() }))));
  }
  createOffice(office: Office): any {
    return this.officesRef.push(office).then(() => this.notify.showSuccess('Office Added Successfully!!!', 'Add Office'));
  }
  updateOffice(office: Office): any {
    return this.officesRef.update(office.key, office).then().catch();
  }
  deleteOffice(key: string): any {
    return this.officesRef.remove(key);
  }

  /* CRUD FOR STAFF */

  getAllStaff(key: string): Observable<Staff[]> {
    this.staffRef = this.db.list<Staff>(`/offices/${key}/staff`);
    return this.staffRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(staff => (({key: staff.payload.key, ...staff.payload.val()})))));
  }

  createStaff(staff: Staff): any {
    this.staffRef = this.db.list(`/offices/${staff.officeKey}/staff`);
    staff.id = this.getRandomString(24);
    return this.staffRef.push(staff);
  }
  updateStaff(staff: Staff): any {
    this.staffRef = this.db.list(`/offices/${staff.officeKey}/staff`);
    return this.staffRef.update(staff.key, staff);
  }
  deleteStaff(staff: Staff): any {
    this.staffRef = this.db.list(`/offices/${staff.officeKey}/staff`);
    return this.staffRef.remove(staff.key).then().catch(err => console.error(err));
  }
  getRandomString(length): string {
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for ( let i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}


}
