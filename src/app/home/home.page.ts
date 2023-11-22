import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Category } from '../interfaces/category';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {
  categoria: string = '' 
  lista: Category[] = []
  alertButtons = ['OK'];
  alertInputs = [
    {
      placeholder: 'Nome',
    },
  ];


  constructor(private router: Router, private storage: Storage, private alertController: AlertController) {
    this.lista = [{
      id: 0,
      name: 'Casa'
    }, {
      id: 1,
      name: 'Compras'
    }, {
      id: 2,
      name: 'Escola'
    }]
  }


  async OnClickCard(id: number) {
    console.log("Happy");
    await this.storage.set("categoria", this.lista[id]);
    await this.router.navigate(["/list"],);
  }

  onClickDelete(ident:number) {
    const deleta = this.lista.filter(item => item.id !== ident)
    this.lista = deleta
    console.log(this.lista)
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: "Nova categoria",
      message: "Qual o nome da nova categoria",
      inputs: [
        {
          name: "category",
          type: 'text',
          placeholder: "Categoria"
        }],
      buttons: [{
        text: "Salvar",
        role: "save",
        handler: (res) => { console.log('nada') }
      }, 'Cancel']
    });

    await alert.present();
    const result = await alert.onDidDismiss()
    return result

  }

  async addNewCatedory() {
    const {data, role} = await this.presentAlert()
    console.log(role)
    if( role== "save") {
      console.log(data.values)
      const { category } = data.values
      const id = this.lista[this.lista.length -1].id + 1
      this.lista.push({
        id, name: category
      })
    }
    console.log(this.lista)
  }
}
