export type ApiHttpResponse<SUCCESS, ERROR = any> = SUCCESS | {
    error: true,
    data: ERROR,
    message: string
}