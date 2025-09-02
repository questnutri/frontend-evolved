import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HealthService } from './health.service';
import { BACKEND_GATEWAY_URL } from '../../config/setup.token';

describe('HealthService', () => {
  let service: HealthService;
  let httpMock: HttpTestingController;
  const api = 'http://test/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: BACKEND_GATEWAY_URL, useValue: api }]
    });
    service = TestBed.inject(HealthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('parses array responses', async () => {
    const promise = service.getHealth();
    const req = httpMock.expectOne(`${api}/health`);
    req.flush([{ name: 'a', healthy: true }]);
    const res = await promise;
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('a');
    expect(res[0].healthy).toBe(true);
  });

  it('parses object with services', async () => {
    const promise = service.getHealth();
    const req = httpMock.expectOne(`${api}/health`);
    req.flush({ services: [{ name: 'b', healthy: false }] });
    const res = await promise;
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('b');
  });

  it('parses services-status map', async () => {
    const promise = service.getHealth();
    const req = httpMock.expectOne(`${api}/health`);
    req.flush({ 'services-status': { admin: true, auth: false } });
    const res = await promise;
    expect(res.find(r => r.name === 'admin')?.healthy).toBe(true);
    expect(res.find(r => r.name === 'auth')?.healthy).toBe(false);
  });

  it('parses map style response', async () => {
    const promise = service.getHealth();
    const req = httpMock.expectOne(`${api}/health`);
    req.flush({ gateway: { healthy: true, info: 'ok' } });
    const res = await promise;
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('gateway');
    expect(res[0].healthy).toBe(true);
  });

  it('returns gateway unhealthy on error', async () => {
    const promise = service.getHealth();
    const req = httpMock.expectOne(`${api}/health`);
    req.error(new ErrorEvent('network'));
    const res = await promise;
    expect(res.length).toBe(1);
    expect(res[0].name).toBe('gateway');
    expect(res[0].healthy).toBe(false);
  });
});
