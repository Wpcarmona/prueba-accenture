import { TestBed } from '@angular/core/testing';

import { RemoteConfigFirebase } from './remote-config-firebase';

describe('RemoteConfigFirebase', () => {
  let service: RemoteConfigFirebase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoteConfigFirebase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
