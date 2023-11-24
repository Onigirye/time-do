import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Task } from 'src/app/interfaces/task';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.scss'],
})


export class ModalTaskComponent  implements OnInit {

  @Input() task!: Task
  // @Input() name!: string
  // @Input() category!: string
  // @Input() datestart!: string;
  // @Input() dateend!: string;
  @Input() type!: string;
  today = new Date().toISOString();
  //data: string[] = []

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  confirm() {
    // const data: Task = {
    //   id: this.id,
    //   name: this.name,
    //   category: this.category
    // }
    return this.modalCtrl.dismiss(this.task, 'confirm');
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  formatDate(value: any, type:string) {
    const date = DateTime.fromISO(value)
    // this.dateValue = value;
    if(type == 'start'){
      this.task.dateStart = date.toFormat('dd/MM/yyyy')  
    }if(type == 'end'){
      this.task.dateEnd = date.toFormat('dd/MM/yyyy')
    }
    
  } 

}
