// Dynamic API URL that works for localhost and network IP
const API_URL = `http://${window.location.hostname}:8000`;

export const getDrivers = async () => {
    const response = await fetch(`${API_URL}/drivers/`);
    if (!response.ok) throw new Error("Failed to fetch drivers");
    return response.json();
};

export const createDriver = async (formData) => {
    const response = await fetch(`${API_URL}/drivers/`, {
        method: "POST",
        body: formData, // Send as FormData for file upload
    });
    if (!response.ok) throw new Error("Failed to create driver");
    return response.json();
};

export { API_URL };
