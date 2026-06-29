import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Toast, ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: false,
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
})
export class ToastContainer {
  toasts$: Observable<Toast[]>;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  alertClass(kind: Toast['kind']): string {
    switch (kind) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      default:
        return 'alert-info';
    }
  }

  toastIcon(kind: Toast['kind']): string {
    switch (kind) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-exclamation-triangle-fill';
      default:
        return 'bi-info-circle-fill';
    }
  }
}
