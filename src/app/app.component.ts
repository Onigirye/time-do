import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AuthenticationService } from './services/authentication.service';
import { NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private authService: AuthenticationService,
    private router: Router,
    private platform: Platform,
  ) {
    this.initializeApp();
   }
  ngOnInit() {
    
    this.storage.create();
  }

  private async verifyIfIsLogged() {
    const token = await this.storage.get("token")
    console.log("token: ", token)
    this.authService.authState.subscribe(state => {
      if (state) {
        let navExtras: NavigationExtras = {
          skipLocationChange: true,
          replaceUrl: true
        };
        this.router.navigateByUrl("/home", navExtras)
      } else {
        this.router.navigateByUrl("/login")
      }
    })
  }

  initializeApp() {
    this.platform.ready().then(async () => {
       this.verifyIfIsLogged()
    })
  }

}

