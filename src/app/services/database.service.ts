import { Injectable } from '@angular/core';
import { RxDatabase, addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';

import { createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import categorySchema from '../schemes/category';
import taskSchema from '../schemes/task';
import userSchema from '../schemes/user';

addRxPlugin(RxDBDevModePlugin); //only in dev mode

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
  private database!: RxDatabase;
  private databaseReady!: BehaviorSubject<boolean>;
  collections: any

  constructor(
    private platform: Platform,

  ) {
    this.createDatabase()
  }

  private createDatabase() {
    this.platform.ready().then(async ready => {
      if (ready) {
        this.databaseReady = new BehaviorSubject(false)
        await createRxDatabase({
          name: 'timedodb',
          storage: getRxStorageDexie(),
          multiInstance: true,
        }).then(async (db: RxDatabase) => {
          this.database = db
          console.log("bd criado")
          await this.createCollections()
          console.log("collections criados")
        }).catch(err => {
          console.error('[database-create]: ', err)
        });
      }
    })
  }

  private async createCollections() {
    try {
      this.collections = await this.database.addCollections({
        categories: {
          schema: categorySchema
        },
        tasks: {
          schema:taskSchema
        },
        users: {
          schema:userSchema
        }
      });

      this.databaseReady.next(true)
    } catch (err) {
      console.error('[create-collections]: ', err)
    }

  }

  getDatabase() {
    return this.database;
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  async recreateDatabase() {
    await this.database.categories.remove()
    this.createCollections()
  }

}