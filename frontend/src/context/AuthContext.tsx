import { createContext, useContext } from "react";

interface AuthContextType {
	isLoggedIn: boolean;
	username: string | null;
	userId: number | null;
	isLive: boolean;
	profilePicture: string | null;
	setIsLoggedIn: (value: boolean) => void;
	setUsername: (value: string | null) => void;
	setUserId: (value: number | null) => void;
	setIsLive: (value: boolean) => void;
	setProfilePicture: (value: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
