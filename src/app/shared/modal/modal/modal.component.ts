import { Component, ViewEncapsulation, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import {ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  private element: any;

  constructor(private modalService: ModalService, private el: ElementRef) {
    this.element = el.nativeElement;
   }

  ngOnInit(): void {

  // ensure id attribute exists
  if (!this.id) {
    console.error('modal must have id');
    return;
  }
  // move element to bottom of page (just before </body>) so it can be displayed abouve everything else
  document.body.appendChild(this.element);

  // close modal on background click
  this.element.addEventListener('click', el => {
    if (el.target.className === 'app-modal') {
      this.close();
    }
  });

  // add instance of this modal to the service to make it accessible to controllers
  this.modalService.add(this);
  }
  // remove self from modal service when component is destroyed
  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
}
// open modal
open(): void {
  this.element.style.display = 'block';
  document.body.classList.add('app-modal-open');
}
 // close modal
 close(): void {
  this.element.style.display = 'none';
  document.body.classList.remove('app-modal-open');
}
}
