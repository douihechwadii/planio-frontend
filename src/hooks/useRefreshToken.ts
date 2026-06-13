import { useAuth } from "@/store/authStore";
import axios from "axios";

export default function useRefreshToken() {
    const { login } = useAuth();

    return async (): Promise<void> => {
        const refreshToken = localStorage.getItem("refreshToken")

        const { data } = await axios.post(
            import.meta.env.PROD
            ? `${import.meta.env.VITE_API_URL ?? ""}/api/auth/refresh-token`
            : "/api/auth/refresh-token",
            { refreshToken, deviceId: "web" }
        );

        login(data);
    };
}