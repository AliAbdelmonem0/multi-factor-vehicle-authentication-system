// Use environment variable for production, fallback to dynamic localhost for dev
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;

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
