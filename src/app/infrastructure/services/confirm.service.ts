import { Injectable, inject } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable, Subject } from 'rxjs';

export interface ConfirmOptions {
  title?: string;
  content?: string;
  okText?: string;
  cancelText?: string;
  okDanger?: boolean;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private readonly modal = inject(NzModalService);

  /**
   * Muestra un modal de confirmación para eliminar un elemento
   */
  confirmDelete(itemName: string, itemType: string = 'elemento'): Observable<boolean> {
    const result$ = new Subject<boolean>();

    this.modal.confirm({
      nzTitle: '¿Estás seguro?',
      nzContent: `Esta acción eliminará permanentemente ${itemType === 'usuario' ? 'al' : 'el'} ${itemType} <strong>"${itemName}"</strong>. Esta acción no se puede deshacer.`,
      nzOkText: 'Sí, eliminar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancelar',
      nzCentered: true,
      nzClosable: true,
      nzMaskClosable: false,
      nzOnOk: () => {
        result$.next(true);
        result$.complete();
      },
      nzOnCancel: () => {
        result$.next(false);
        result$.complete();
      }
    });

    return result$.asObservable();
  }

  /**
   * Muestra un modal de confirmación genérico
   */
  confirm(options: ConfirmOptions): Observable<boolean> {
    const result$ = new Subject<boolean>();

    this.modal.confirm({
      nzTitle: options.title || '¿Estás seguro?',
      nzContent: options.content || '¿Deseas continuar con esta acción?',
      nzOkText: options.okText || 'Confirmar',
      nzOkType: 'primary',
      nzOkDanger: options.okDanger ?? false,
      nzCancelText: options.cancelText || 'Cancelar',
      nzCentered: true,
      nzClosable: true,
      nzMaskClosable: false,
      nzOnOk: () => {
        result$.next(true);
        result$.complete();
      },
      nzOnCancel: () => {
        result$.next(false);
        result$.complete();
      }
    });

    return result$.asObservable();
  }

  /**
   * Confirmación para banear usuario
   */
  confirmBan(userName: string): Observable<boolean> {
    return this.confirm({
      title: '¿Banear usuario?',
      content: `¿Estás seguro de banear a <strong>"${userName}"</strong>? El usuario no podrá acceder a la plataforma.`,
      okText: 'Sí, banear',
      okDanger: true
    });
  }

  /**
   * Confirmación para desbanear usuario
   */
  confirmUnban(userName: string): Observable<boolean> {
    return this.confirm({
      title: '¿Desbanear usuario?',
      content: `¿Deseas restaurar el acceso de <strong>"${userName}"</strong> a la plataforma?`,
      okText: 'Sí, desbanear',
      okDanger: false
    });
  }
}
