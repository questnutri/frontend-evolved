import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { AuthService } from '@qn/services'
import { BACKEND_GATEWAY_URL } from 'src/app/config/setup.token'

enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH'
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly BACKEND_GATEWAY_URL = inject(BACKEND_GATEWAY_URL)
    private readonly authService = inject(AuthService)
    private readonly http = inject(HttpClient)
    private baseHeaders: HttpHeaders = new HttpHeaders()
    private authEnabled = false

    get authenticated(): ApiService {
        const clone = Object.create(this)
        clone.authEnabled = true
        return clone
    }

    private buildHeaders(): HttpHeaders {
        let headers = this.baseHeaders
        const token = this.authService.accessToken()
        if (this.authEnabled && token) headers = headers.set('Authorization', `Bearer ${token}`)
        return headers
    }

    get<T>(url: string, options: object = {}): Observable<any> {
        return this.request<T>(HttpMethod.GET, url, undefined, options)
    }

    post<T>(url: string, body?: any, options: object = {}): Observable<any> {
        return this.request<T>(HttpMethod.POST, url, body, options)
    }

    put<T>(url: string, body?: any, options: object = {}): Observable<any> {
        return this.request<T>(HttpMethod.PUT, url, body, options)
    }

    delete<T>(url: string, options: object = {}): Observable<any> {
        return this.request<T>(HttpMethod.DELETE, url, undefined, options)
    }

    patch<T>(url: string, body?: any, options: object = {}): Observable<any> {
        return this.request<T>(HttpMethod.PATCH, url, body, options)
    }

    private request<T>(method: HttpMethod, url: string, body?: any, options: any = {}): Observable<any> {
        const headers = this.buildHeaders()
        const requestOptions = { ...options, headers, observe: 'body' as const, responseType: 'json' as const }
        const fullUrl = this.buildUrl(url)
        switch (method) {
            case HttpMethod.GET:
                return this.http.get<T>(fullUrl, requestOptions)
            case HttpMethod.POST:
                return this.http.post<T>(fullUrl, body, requestOptions)
            case HttpMethod.PUT:
                return this.http.put<T>(fullUrl, body, requestOptions)
            case HttpMethod.DELETE:
                return this.http.delete<T>(fullUrl, requestOptions)
            case HttpMethod.PATCH:
                return this.http.patch<T>(fullUrl, body, requestOptions)
        }
    }

    private buildUrl(path: string): string {
        if (!path) return this.BACKEND_GATEWAY_URL
        if (path.startsWith('http')) return path
        const base = this.BACKEND_GATEWAY_URL.endsWith('/') ? this.BACKEND_GATEWAY_URL.slice(0, -1) : this.BACKEND_GATEWAY_URL
        const cleanPath = path.startsWith('/') ? path : `/${path}`
        console.log(`${base}${cleanPath}`);
        return `${base}${cleanPath}`
    }
}
