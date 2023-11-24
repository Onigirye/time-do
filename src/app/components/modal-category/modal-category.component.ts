import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category } from 'src/app/interfaces/category';

@Component({
  selector: 'app-modal-category',
  templateUrl: './modal-category.component.html',
  styleUrls: ['./modal-category.component.scss'],
})


export class ModalCategoryComponent implements OnInit {
  @Input() id!: string
  @Input() name!: string
  @Input() color!: string;
  @Input() action!: string;
  @Input() type!: string;

  // action: string = 'create'
  colors: string[] = []

  constructor(private modalCtrl: ModalController) {
    this.colors = ['success', 'warning', 'danger', 'medium', 'light', 'purple', 'blue', 'coffee', 'aqua']
  }

  ngOnInit() { }

  confirm() {
    const data: Category = {
      id: this.id,
      name: this.name,
      color: this.color
    }
    return this.modalCtrl.dismiss(data, 'confirm');
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
