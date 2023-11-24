import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from './database.service';
import { Category } from '../interfaces/category';
import { RxCollection, RxDocument } from 'rxdb';



@Injectable({
  providedIn: 'root'
})
export class CategoryDaoService {
  private collection!: RxCollection
  constructor(
    private database: DatabaseService

  ) { 
  }



  async getObservable(){
    const categories$ = this.database.getDatabase()
    .categories                // collection
    .find({                 // query
        selector: {},
        sort: [{ name: 'asc' }]
    })
    .$;

    return categories$
  }

  async insert(category: Category){
    console.log(category)
    const collectionCategory: RxCollection = this.database.getDatabase().categories;
    const doc: RxDocument = await collectionCategory.insert(category);


    let results = await collectionCategory.find().exec() // <- find all documents
    const items = results.map(result => result.toJSON());
    console.log(items)

  }

  async upsert(category: Category){
    console.log(category)
    const collectionCategory: RxCollection = this.database.getDatabase().categories;
    const doc: RxDocument = await collectionCategory.upsert(category);


    let results = await collectionCategory.find().exec() // <- find all documents
    const items = results.map(result => result.toJSON());
    console.log(items)

  }

  async insertRandom(){
    const collectionCategory: RxCollection = this.database.getDatabase().categories;
    const uuid = uuidv4()
    
    const random = await fetch('https://my.api.mockaroo.com/categories.json?key=3c8d5c80').then(res => res.json());
    let  cat : Category  = random

    cat.name = cat.name?.match(/^\w+/)![0]
    const doc: RxDocument = await collectionCategory.insert({
      id: uuid,
      name: cat.name,
      color: cat.color
    });


    let results = await collectionCategory.find().exec() // <- find all documents
    const items = results.map(result => result.toJSON());
    console.log(items)
  }

  async removeById(id:string){
    const collectionCategory: RxCollection = await this.database.getDatabase().categories;
    const docdel =await collectionCategory.findOne({
      selector: {
        id
      }
    }).exec()
    await docdel.remove()
  }

  async updateById(cat:any){
    const collectionCategory: RxCollection = this.database.getDatabase().categories;
    const docmod =await collectionCategory.findOne({
      selector: {
        id: cat.id
      }
    }).exec()
    await docmod.modify(cat);
  }

 

}