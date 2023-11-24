import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from './database.service';
import { User } from '../interfaces/user';
import { RxCollection, RxDocument } from 'rxdb';

@Injectable({
  providedIn: 'root'
})
export class UserDaoService {
  private collection!: RxCollection

  constructor(private database: DatabaseService) {

  }

  async register(newUser: User) {
    const userCollection: RxCollection = await this.database.getDatabase().users

    const user = await userCollection.findOne({                 // query
      selector: {
        login: { $eq: newUser.login }
      },
    }).exec()

    console.log("achei", user)

    if (user != null) {
      return { success: false }
    } else {
      // newUser.id = uuidv4()
      const user: RxDocument = await userCollection.insert(newUser);


      return { success: true, user }
    }

  }
  async auth(user: User) {
    const userCollection: RxCollection = await this.database.getDatabase().users

    const userDoc = await userCollection.findOne({                 // query
      selector: {
        login: { $eq: user.login },
        password : { $eq: user.password }
      },
    }).exec()
    console.log(userDoc)
    if (user != null) {
      return {success: true, user : userDoc.toJSON()}
    }else{
      return {success: false, user: {}}
    }

  }

}
