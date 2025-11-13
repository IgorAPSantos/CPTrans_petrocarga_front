import { parseCookies, setCookie, destroyCookie } from 'nookies';
import axios, { AxiosError } from 'axios';

const TOKEN_COOKIE_NAME = "petrocarga.token";

const { [ TOKEN_COOKIE_NAME ]: token } = parseCookies();

export const api = axios.create({
    baseURL: 'http://localhost:8080',
});

if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

api.interceptors.response.use(
    (response)=> response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            destroyCookie(undefined, TOKEN_COOKIE_NAME);
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const setAuthToken = (newToken: string) => {
    setCookie(undefined, TOKEN_COOKIE_NAME, newToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
    });
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
}

export const removeAuthToken = () => {
    destroyCookie(undefined, TOKEN_COOKIE_NAME);
    delete api.defaults.headers.common['Authorization'];
}