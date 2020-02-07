import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LoggingService } from '../logging/log.service';

@Injectable({
  providedIn: 'root'
})
export class ReadOnlyDBService {

  constructor(
    private afs: AngularFirestore,   // Inject Firestore service
    private logServ: LoggingService
  ) {

  }

  // vrací danou collection
  public async GetCollection(name: string) {
    return(this.afs.collection(name));
  }
}
