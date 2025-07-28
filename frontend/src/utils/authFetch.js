export async function refreshToken() {
    const refToken = localStorage.getItem("refresh");

    if (!refToken) return null;

    const response = await fetch("http://localhost:8000/exercises/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refToken })
    });
    const data = await response.json();
    
    if (response.ok) {
        localStorage.setItem("access", data.access);
        return data.access;
    } else {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
        return null;
    }
}

export async function authFetch(url, options = {}) {
    let token = localStorage.getItem("access");
    options.headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`
    };
    let response = await fetch(url, options);
    if (response.status === 401) {
        token = await refreshToken();
        if (token) {
            options.headers.Authorization = `Bearer ${token}`;
            response = await fetch(url, options);
        }
    }
    return response;
}