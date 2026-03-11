import { Injectable } from '@angular/core';
import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  activate,
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
  getString,
  onConfigUpdate,
  RemoteConfig,
} from 'firebase/remote-config';
import { firebaseConfig } from '../config/firebase';

@Injectable({ providedIn: 'root' })
export class RemoteConfigService {
  private remoteConfig!: RemoteConfig;

  async init(): Promise<void> {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

    this.remoteConfig = getRemoteConfig(app);

    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: 60_000,
      fetchTimeoutMillis: 60_000,
    };

    this.remoteConfig.defaultConfig = {
      feature_new_checkout: 'false',
      feature_new_profile: 'false',
    };

    try {
      await fetchAndActivate(this.remoteConfig);
    } catch (error) {
      console.error('Remote Config fetch error', error);
    }

    onConfigUpdate(this.remoteConfig, {
      next: async () => {
        await activate(this.remoteConfig);
      },
      error: (error) => {
        console.error('Remote Config realtime error', error);
      },
      complete: () => {},
    });
  }

  isEnabled(key: string): boolean {
    return getBoolean(this.remoteConfig, key);
  }

  getText(key: string): string {
    return getString(this.remoteConfig, key);
  }
}