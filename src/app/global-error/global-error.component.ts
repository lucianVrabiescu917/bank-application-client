import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-global-error',
  templateUrl: './global-error.component.html',
  styleUrls: ['./global-error.component.scss']
})
export class GlobalErrorComponent {
  @Input() errorMessage: string | null = null;

  displayError(message: string): void {
    this.errorMessage = message;
  }
}
