import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from './database.service';
import { Task } from '../interfaces/task';
import { RxCollection, RxDocument } from 'rxdb';

@Injectable({
  providedIn: 'root',
})
export class TaskDaoService {
  private collection!: RxCollection;
  constructor(private database: DatabaseService) {}

  async getObservable(id: string) {
    const tasks$ = this.database
      .getDatabase()
      .tasks // collection
      .find({
        // query
        selector: {
          category: { $eq: id },
        },
        sort: [{ name: 'asc' }],
      }).$;

    return tasks$;
  }

  async insert(task: Task) {
    console.log(task);
    const collectionTask: RxCollection = this.database.getDatabase().tasks;
    const doc: RxDocument = await collectionTask.insert(task);

    let results = await collectionTask.find().exec(); // <- find all documents
    const items = results.map((result) => result.toJSON());
    console.log(items);
  }

  async upsert(task: Task) {
    console.log(task);
    const collectionTask: RxCollection = this.database.getDatabase().tasks;
    const doc: RxDocument = await collectionTask.upsert(task);

    let results = await collectionTask.find().exec(); // <- find all documents
    const items = results.map((result) => result.toJSON());
    console.log(items);
  }

  async insertRandom() {
    const collectionTask: RxCollection = this.database.getDatabase().tasks;
    const uuid = uuidv4();

    const random = await fetch(
      'https://my.api.mockaroo.com/categories.json?key=3c8d5c80'
    ).then((res) => res.json());
    let cat: Task = random;

    cat.name = cat.name?.match(/^\w+/)![0];
    const doc: RxDocument = await collectionTask.insert({
      id: uuid,
      name: cat.name,
    });

    let results = await collectionTask.find().exec(); // <- find all documents
    const items = results.map((result) => result.toJSON());
    console.log(items);
  }

  async removeById(id: string) {
    const collectionTask: RxCollection = this.database.getDatabase().tasks;
    const docdel = await collectionTask
      .findOne({
        selector: {
          id,
        },
      })
      .exec();
    await docdel.remove();
  }

  async updateById(cat: any) {
    const collectionTask: RxCollection = this.database.getDatabase().tasks;
    const docmod = await collectionTask
      .findOne({
        selector: {
          id: cat.id,
        },
      })
      .exec();
    await docmod.modify(cat);
  }

  async countTaskByCategoryId(id: any) {
    const collectionTask: RxCollection = this.database.getDatabase().tasks;
    const docs = await collectionTask.find({
      selector: {
        category: {
          $eq: id,
        },
      },
    });
    console.log(docs)
  }
}
