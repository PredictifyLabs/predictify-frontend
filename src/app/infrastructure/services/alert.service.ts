import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult, SweetAlertIcon } from 'sweetalert2';

export interface AlertOptions {
  title?: string;
  text?: string;
  html?: string;
  icon?: SweetAlertIcon;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  timer?: number;
  timerProgressBar?: boolean;
  showLoaderOnConfirm?: boolean;
  allowOutsideClick?: boolean;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  input?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'range' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file' | 'url';
  inputPlaceholder?: string;
  inputValue?: string;
  inputOptions?: Record<string, string>;
  inputValidator?: (value: string) => string | null | Promise<string | null>;
  footer?: string;
  backdrop?: boolean | string;
  position?: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end';
  grow?: 'row' | 'column' | 'fullscreen' | false;
  customClass?: {
    container?: string;
    popup?: string;
    header?: string;
    title?: string;
    closeButton?: string;
    icon?: string;
    image?: string;
    htmlContainer?: string;
    input?: string;
    inputLabel?: string;
    validationMessage?: string;
    actions?: string;
    confirmButton?: string;
    denyButton?: string;
    cancelButton?: string;
    loader?: string;
    footer?: string;
  };
}

export interface ToastOptions {
  title: string;
  icon?: SweetAlertIcon;
  position?: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end';
  timer?: number;
  showConfirmButton?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  
  private readonly defaultColors = {
    confirm: '#6366f1',
    cancel: '#64748b',
    danger: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6'
  };

  // ═══════════════════════════════════════════════════════════
  // ALERTAS BÁSICAS
  // ═══════════════════════════════════════════════════════════

  success(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: this.defaultColors.success,
      confirmButtonText: 'Aceptar',
      timer: 3000,
      timerProgressBar: true
    });
  }

  error(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: this.defaultColors.danger,
      confirmButtonText: 'Entendido'
    });
  }

  warning(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: this.defaultColors.warning,
      confirmButtonText: 'Entendido'
    });
  }

  info(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonColor: this.defaultColors.info,
      confirmButtonText: 'Entendido'
    });
  }

  // ═══════════════════════════════════════════════════════════
  // ALERTAS DE CONFIRMACIÓN
  // ═══════════════════════════════════════════════════════════

  confirm(title: string, text?: string, confirmText = 'Sí, confirmar', cancelText = 'Cancelar'): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: this.defaultColors.confirm,
      cancelButtonColor: this.defaultColors.cancel,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true
    });
  }

  confirmDanger(title: string, text?: string, confirmText = 'Sí, eliminar', cancelText = 'Cancelar'): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonColor: this.defaultColors.danger,
      cancelButtonColor: this.defaultColors.cancel,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true
    });
  }

  // ═══════════════════════════════════════════════════════════
  // TOAST NOTIFICATIONS
  // ═══════════════════════════════════════════════════════════

  private createToast() {
    return Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
  }

  toast(options: ToastOptions): Promise<SweetAlertResult> {
    const Toast = this.createToast();
    return Toast.fire({
      icon: options.icon || 'info',
      title: options.title,
      position: options.position || 'top-end',
      timer: options.timer || 3000,
      showConfirmButton: options.showConfirmButton || false
    });
  }

  toastSuccess(title: string): Promise<SweetAlertResult> {
    return this.toast({ title, icon: 'success' });
  }

  toastError(title: string): Promise<SweetAlertResult> {
    return this.toast({ title, icon: 'error', timer: 5000 });
  }

  toastWarning(title: string): Promise<SweetAlertResult> {
    return this.toast({ title, icon: 'warning' });
  }

  toastInfo(title: string): Promise<SweetAlertResult> {
    return this.toast({ title, icon: 'info' });
  }

  // ═══════════════════════════════════════════════════════════
  // ALERTAS CON INPUT
  // ═══════════════════════════════════════════════════════════

  promptText(title: string, placeholder?: string, defaultValue?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      input: 'text',
      inputPlaceholder: placeholder || '',
      inputValue: defaultValue || '',
      showCancelButton: true,
      confirmButtonColor: this.defaultColors.confirm,
      cancelButtonColor: this.defaultColors.cancel,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Este campo es requerido';
        }
        return null;
      }
    });
  }

  promptEmail(title: string, placeholder?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      input: 'email',
      inputPlaceholder: placeholder || 'correo@ejemplo.com',
      showCancelButton: true,
      confirmButtonColor: this.defaultColors.confirm,
      cancelButtonColor: this.defaultColors.cancel,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'El email es requerido';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Email inválido';
        }
        return null;
      }
    });
  }

  promptTextarea(title: string, placeholder?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      input: 'textarea',
      inputPlaceholder: placeholder || '',
      showCancelButton: true,
      confirmButtonColor: this.defaultColors.confirm,
      cancelButtonColor: this.defaultColors.cancel,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    });
  }

  promptSelect(title: string, options: Record<string, string>): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      input: 'select',
      inputOptions: options,
      showCancelButton: true,
      confirmButtonColor: this.defaultColors.confirm,
      cancelButtonColor: this.defaultColors.cancel,
      confirmButtonText: 'Seleccionar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes seleccionar una opción';
        }
        return null;
      }
    });
  }

  // ═══════════════════════════════════════════════════════════
  // ALERTAS AVANZADAS
  // ═══════════════════════════════════════════════════════════

  loading(title: string, text?: string): void {
    Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  closeLoading(): void {
    Swal.close();
  }

  successWithCallback(title: string, text: string | undefined, callback: () => void): Promise<void> {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: this.defaultColors.success,
      confirmButtonText: 'Continuar',
      allowOutsideClick: false
    }).then(() => {
      callback();
    });
  }

  htmlAlert(title: string, html: string, icon: SweetAlertIcon = 'info'): Promise<SweetAlertResult> {
    return Swal.fire({
      icon,
      title,
      html,
      confirmButtonColor: this.defaultColors.confirm,
      confirmButtonText: 'Aceptar'
    });
  }

  imageAlert(title: string, imageUrl: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text,
      imageUrl,
      imageWidth: 200,
      imageAlt: title,
      confirmButtonColor: this.defaultColors.confirm,
      confirmButtonText: 'Aceptar'
    });
  }

  timedAlert(title: string, text: string, seconds: number, icon: SweetAlertIcon = 'info'): Promise<SweetAlertResult> {
    return Swal.fire({
      icon,
      title,
      text,
      timer: seconds * 1000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }

  // ═══════════════════════════════════════════════════════════
  // ALERTAS PERSONALIZADAS PARA PREDICTIFY
  // ═══════════════════════════════════════════════════════════

  welcomeUser(userName: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'success',
      title: `¡Bienvenido, ${userName}!`,
      text: 'Has iniciado sesión correctamente',
      confirmButtonColor: this.defaultColors.success,
      confirmButtonText: 'Ir al inicio',
      timer: 3000,
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });
  }

  registrationSuccess(email: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'success',
      title: '¡Cuenta creada exitosamente!',
      html: `
        <p>Tu cuenta ha sido registrada con el email:</p>
        <p><strong>${email}</strong></p>
        <p class="text-sm text-gray-500 mt-2">Ya puedes empezar a explorar eventos</p>
      `,
      confirmButtonColor: this.defaultColors.success,
      confirmButtonText: 'Comenzar',
      showClass: {
        popup: 'animate__animated animate__zoomIn'
      }
    });
  }

  logoutConfirm(): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'question',
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir de tu cuenta?',
      showCancelButton: true,
      confirmButtonColor: this.defaultColors.danger,
      cancelButtonColor: this.defaultColors.cancel,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });
  }

  eventRegistrationSuccess(eventName: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'success',
      title: '¡Inscripción exitosa!',
      html: `
        <p>Te has inscrito correctamente al evento:</p>
        <p><strong>${eventName}</strong></p>
        <p class="text-sm text-gray-500 mt-2">Revisa tu email para más detalles</p>
      `,
      confirmButtonColor: this.defaultColors.success,
      confirmButtonText: 'Ver mis eventos',
      showCancelButton: true,
      cancelButtonText: 'Seguir explorando',
      cancelButtonColor: this.defaultColors.cancel
    });
  }

  eventCancellationConfirm(eventName: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'warning',
      title: '¿Cancelar inscripción?',
      html: `
        <p>¿Estás seguro de cancelar tu inscripción a:</p>
        <p><strong>${eventName}</strong></p>
        <p class="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer</p>
      `,
      showCancelButton: true,
      confirmButtonColor: this.defaultColors.danger,
      cancelButtonColor: this.defaultColors.cancel,
      confirmButtonText: 'Sí, cancelar inscripción',
      cancelButtonText: 'Mantener inscripción',
      reverseButtons: true
    });
  }

  deleteConfirm(itemName: string, itemType = 'elemento'): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'warning',
      title: `¿Eliminar ${itemType}?`,
      html: `
        <p>Estás a punto de eliminar:</p>
        <p><strong>${itemName}</strong></p>
        <p class="text-sm text-red-500 mt-2">Esta acción no se puede deshacer</p>
      `,
      showCancelButton: true,
      confirmButtonColor: this.defaultColors.danger,
      cancelButtonColor: this.defaultColors.cancel,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });
  }

  networkError(): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'error',
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.',
      confirmButtonColor: this.defaultColors.danger,
      confirmButtonText: 'Reintentar'
    });
  }

  sessionExpired(): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'warning',
      title: 'Sesión expirada',
      text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      confirmButtonColor: this.defaultColors.warning,
      confirmButtonText: 'Iniciar sesión',
      allowOutsideClick: false
    });
  }

  custom(options: Record<string, unknown>): Promise<SweetAlertResult> {
    return Swal.fire({
      confirmButtonColor: this.defaultColors.confirm,
      cancelButtonColor: this.defaultColors.cancel,
      ...options
    });
  }
}
