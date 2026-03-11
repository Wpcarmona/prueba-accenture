import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { TodoStoreService } from '../services/todo-store.service';
import { FEATURE_FLAGS } from 'src/app/core/config/config-flag';
import { RemoteConfigService } from 'src/app/core/services/remote-config-firebase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  readonly store = inject(TodoStoreService);
  readonly remoteConfig = inject(RemoteConfigService);

  showCategories = this.remoteConfig.isEnabled(FEATURE_FLAGS.categoriesEnabled);

  async ionViewWillEnter(): Promise<void> {
    await this.store.init();
  }
}
