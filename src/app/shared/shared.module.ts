import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { XofPipe } from './pipes/xof.pipe';
import { PhoneFormatPipe } from './pipes/phone-format.pipe';
import { ToastContainer } from './components/toast-container/toast-container';
import { Loader } from './components/loader/loader';
import { ConfirmModal } from './components/confirm-modal/confirm-modal';

const SHARED_DECLARATIONS = [XofPipe, PhoneFormatPipe, ToastContainer, Loader, ConfirmModal];

@NgModule({
  declarations: [...SHARED_DECLARATIONS],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, ...SHARED_DECLARATIONS],
})
export class SharedModule {}
