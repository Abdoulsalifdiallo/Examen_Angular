import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: false,
  templateUrl: './loader.html',
})
export class Loader {
  @Input() show = false;
  @Input() label = 'Chargement...';
}
