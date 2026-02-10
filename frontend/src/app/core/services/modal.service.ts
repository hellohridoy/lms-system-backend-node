import { Injectable, signal } from '@angular/core';

export type ModalType = 'success' | 'error' | 'info';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private _visible = signal(false);
    private _message = signal('');
    private _type = signal<ModalType>('success');

    visible = this._visible.asReadonly();
    message = this._message.asReadonly();
    type = this._type.asReadonly();

    show(message: string, type: ModalType = 'success') {
        this._message.set(message);
        this._type.set(type);
        this._visible.set(true);

        setTimeout(() => {
            this._visible.set(false);
        }, 2000);
    }
}
