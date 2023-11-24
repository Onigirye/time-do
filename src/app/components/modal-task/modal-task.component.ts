import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from 'src/app/interfaces/task';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.scss'],
})


export class ModalTaskComponent  implements OnInit {

  @Input() id!: string
  @Input() name!: string
  @Input() datestart!: string;
  @Input() dateend!: string;
  @Input() type!: string;

  //data: string[] = []

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  confirm() {
    const data: Task = {
      id: this.id,
      name: this.name,
    }
    return this.modalCtrl.dismiss(data, 'confirm');
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
