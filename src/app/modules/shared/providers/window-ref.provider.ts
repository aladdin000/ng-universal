import { Injectable } from '@angular/core';

function _window(): Window {
  return (typeof window !== undefined) ? window : null;
}

@Injectable()
export class WindowRefProvider {
  get nativeWindow(): Window {
    return _window();
  }
}
