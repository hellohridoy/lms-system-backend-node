import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DataUpdateService {
    private dataUpdatedSource = new Subject<void>();
    dataUpdated$ = this.dataUpdatedSource.asObservable();

    notifyUpdate() {
        this.dataUpdatedSource.next();
    }
}
