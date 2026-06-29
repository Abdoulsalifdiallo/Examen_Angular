import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: false,
  templateUrl: './confirm-modal.html',
})
export class ConfirmModal {
  @Input() show = false;
  @Input() title = 'Confirmation';
  @Input() message = 'Êtes-vous sûr ?';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
}
