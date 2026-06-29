import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  readonly toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  success(message: string): void {
    this.push('success', message);
  }

  error(message: string): void {
    this.push('error', message);
  }

  info(message: string): void {
    this.push('info', message);
  }

  dismiss(id: number): void {
    this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id));
  }

  private push(kind: ToastKind, message: string): void {
    const toast: Toast = { id: this.nextId++, kind, message };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);
    setTimeout(() => this.dismiss(toast.id), 5000);
  }
}
