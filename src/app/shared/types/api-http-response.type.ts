export type ApiHttpResponse<SUCCESS, ERROR> = SUCCESS| {
    error: true,
    data: ERROR,
    message: string
}