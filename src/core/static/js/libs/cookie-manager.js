const getCookie = (cookieKey) => {
    return Cookies.get(cookieKey);
}

const setCookie = (key, value, args = { expires: new Date('December 31, 2034 03:24:00'),
                                                          path: '/' }) => {
    Cookies.set(key, value, args);
}
