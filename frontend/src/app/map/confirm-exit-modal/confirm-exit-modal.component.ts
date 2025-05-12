import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-exit-modal',
  template: `
    <div class="modal-backdrop">
      <div class="modal-content">
        <h3>Are you sure you want to leave?</h3>
        <p>You have unfinished export tasks. They will be canceled.</p>
        <div class="modal-actions">
          <button (click)="confirm(true)">Yes, leave</button>
          <button (click)="confirm(false)">No, stay</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./confirm-exit-modal.component.scss']
})
export class ConfirmExitModalComponent {
  @Output() decision = new EventEmitter<boolean>();
  confirm(value: boolean) {
    this.decision.emit(value);
  }
}
