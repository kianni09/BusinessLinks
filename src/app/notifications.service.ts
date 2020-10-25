import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
Observable;

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  public permission: any;

  constructor() {
    this.permission = this.isSuported() ? 'default' : 'denied';
  }

  public isSuported(): boolean {
    return 'Notification' in window;
  }

  public requestPermission() {
    if (this.isSuported()) {
      Notification.requestPermission((status) => {
        return (this.permission = status);
      });
    }
  }

  public create$(title: string, options?: PushNotification) {
    return new Observable((obs) => {
      if (!this.isSuported || this.permission != 'garanted') {
        console.log('Notification is disabled...');
      }
      let _notify = new Notification(title, options);
      _notify.onshow = (e) => {
        return obs.next({
          notification: _notify,
          event: e,
        });
      };
      _notify.onclick = (e) => {
        return obs.next({
          notification: _notify,
          event: e,
        });
      };
      _notify.onerror = (e) => {
        return obs.error({
          notification: _notify,
          event: e,
        });
      };
      _notify.onclose = () => {
        return obs.complete();
      }
    });
  }
}

export interface PushNotification {
  body?: string;
  icon?: string;
  tag?: string;
  data?: string;
  renofity?: boolean;
  silent?: boolean;
  sound?: string;
  noscreen?: boolean;
  sticky?: boolean;
  dir?: 'auto' | 'ltr' | 'rtl';
  lang?: string;
  vibrate?: number[];
}
