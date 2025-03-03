import React, { useState, useEffect, useCallback, useRef } from "react";
import AuthModal from "../components/Auth/AuthModal";
import { useAuthModal } from "../hooks/useAuthModal";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { useFollow } from "../hooks/useFollow";
import { useNavigate } from "react-router-dom";
import Button from "../components/Input/Button";
import DynamicPageContent from "../components/Layout/DynamicPageContent";
import LoadingScreen from "../components/Layout/LoadingScreen";
import { StreamListItem } from "../components/Layout/ListItem";
import { EditIcon } from "lucide-react";
import ListRow from "../components/Layout/ListRow";
import { useStreams, useVods } from "../hooks/useContent";

interface UserProfileData {
	id: number;
	username: string;
	bio: string;
	followerCount: number;
	isPartnered: boolean;
	isLive: boolean;
}

const UserPage: React.FC = () => {
	const [userPageVariant, setUserPageVariant] = useState<"personal" | "user" | "admin">("user");
	const [profileData, setProfileData] = useState<UserProfileData>();
	const { isFollowing, checkFollowStatus, followUser, unfollowUser } = useFollow();
	const { showAuthModal, setShowAuthModal } = useAuthModal();
	const { username: loggedInUsername, profilePicture, setProfilePicture } = useAuth();
	const initialProfilePicture = useRef(profilePicture);
	const { username } = useParams();
	const { vods } = useVods(`/api/vods/${username}`);
	const navigate = useNavigate();
	const { streams } = useStreams(`/api/streams/${username}/data`);
	const currentStream = streams[0];

	const fetchProfileData = useCallback(async () => {
		try {
			// Profile data
			const profileResponse = await fetch(`/api/user/${username}`);
			const profileData = await profileResponse.json();
			setProfileData({
				id: profileData.user_id,
				username: profileData.username,
				bio: profileData.bio || "This user hasn't written a bio yet.",
				followerCount: profileData.num_followers || 0,
				isPartnered: profileData.isPartnered || false,
				isLive: profileData.is_live,
			});
		} catch (err) {
			console.error("Error fetching profile data:", err);
			window.location.href = "/404";
		}
	}, [username]);

	// Saves uploaded image as profile picture for the user
	const saveUploadedImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files) return;
		const img = files[0];
		if (img) {
			const formData = new FormData();
			formData.append("image", img);

			try {
				const response = await fetch("/api/user/profile_picture/upload", {
					method: "POST",
					body: formData,
				});

				if (response.ok) {
					console.log("Success");
					console.log(URL.createObjectURL(img))
					setProfilePicture(URL.createObjectURL(img));
				}
			} catch (error) {
				console.log("Failure");
			}
		}
	};

	const handleNavigation = (path: string) => {
		if (profilePicture === initialProfilePicture.current) {
			// Variable hasn't changed - use React Router navigation
			navigate(path);
		} else {
			// Variable has changed - use full page reload
			window.location.href = path;
		}
	};

	// Store initial profile picture to know if it changes later
	useEffect(() => {
		initialProfilePicture.current = profilePicture;
	}, []);

	// Check if the current user is the currently logged-in user
	useEffect(() => {
		if (username === loggedInUsername) setUserPageVariant("personal");
		// else if (data.isAdmin) setUserPageVariant("admin");
		else setUserPageVariant("user");

		if (loggedInUsername && username) checkFollowStatus(username);
	}, [username, loggedInUsername, checkFollowStatus]);

	// Fetch user profile data
	useEffect(() => {
		if (!username) return;
		fetchProfileData();
	}, [fetchProfileData]);

	if (!profileData) return <LoadingScreen />;

	return (
		<DynamicPageContent className="min-h-screen text-white flex flex-col">
			<div className="flex justify-evenly self-center items-center h-full px-4 pt-14 pb-8 mx-auto max-w-[80vw] w-full">
				<div className="grid grid-cols-4 grid-rows-[0.1fr_4fr] w-full gap-8">
					{/* Profile Section - TOP  */}

					<div
						id="profile"
						className="col-span-4 row-span-1 h-full bg-[var(--user-bg)] 
        rounded-[30px] p-3 shadow-lg 
        relative flex flex-col items-center"
					>
						{/* Border Overlay (Always on Top) */}
						<div className="absolute left-[0px] inset-0 border-[5px] border-[var(--user-borderBg)] rounded-[20px] z-20"></div>

						{/* Background Box */}
						<div
							className="absolute flex top-0 left-[0.55px] w-[99.9%] h-[5vh] min-h-[1em] max-h-[10em] rounded-t-[25.5px] 
                 bg-[var(--user-box)] z-10 flex-shrink justify-center"
							style={{ boxShadow: "var(--user-box-shadow)" }}
						>
							{/* <div className="absolute top-4 w-[99.8%] h-[1vh] min-h-[1em] max-h-[2em]  bg-[var(--user-box-strip)]"></div> */}
						</div>
						{/* Profile Picture */}
						<div
							className={`relative -top-[40px] sm:-top-[90px] w-[16vw] h-[16vw] sm:w-[20vw] sm:h-[20vw] max-w-[10em] max-h-[10em]
               rounded-full flex-shrink-0 border-4 ${profileData.isLive ? "border-[#ff0000]" : "border-[var(--user-pfp-border)]"
								} inset-0 z-20`}
							style={{ boxShadow: "var(--user-pfp-border-shadow)" }}
						>
							<label
								className={`w-full h-full ${userPageVariant === "personal" ? "group cursor-pointer" : ""} overflow-visible rounded-full`}
							>
								{/* If user is live then displays a live div */}
								{profileData.isLive ? (
									<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#ff0000] text-white text-sm font-bold py-1 sm:px-5 px-4 z-30 flex items-center justify-center rounded-tr-xl rounded-bl-xl rounded-tl-xl rounded-br-xl">
										LIVE
									</div>
								) : (
									""
								)}
								<img
									src={userPageVariant === "personal" && profilePicture ? profilePicture : `/user/${profileData.username}/profile_picture`}
									onError={(e) => {
										e.currentTarget.src = "/images/pfps/default.png";
										e.currentTarget.onerror = null;
									}}
									alt={`${profileData.username}'s profile`}
									className="sm:w-full h-full object-cover rounded-full group-hover:brightness-50 relative z-0 transition-all"
								/>

								{/* If current user is the profile user then allow profile picture swap */}
								{userPageVariant === "personal" && (
									<div className="absolute top-0 bottom-0 left-0 right-0 m-auto flex items-center justify-center opacity-0 z-50 group-hover:opacity-100 transition-opacity duration-200">
										<EditIcon size={75} className="text-white bg-black/50 p-1 rounded-3xl" />
										<input type="file" className="hidden" onChange={saveUploadedImage} accept="image/*" />
									</div>
								)}
							</label>
						</div>

						{/* Username - Now Directly Below PFP */}
						<h1 className="text-[var(--user-name)] text-[1.5em] sm:text-[2em] font-bold -mt-[45px] sm:-mt-[90px] text-center">
							{profileData.username}
						</h1>

						{/* Follower Count  */}
						<div className="flex items-center space-x-2 mb-6">
							<span className="text-gray-400">{profileData.followerCount.toLocaleString()} followers</span>
							{profileData.isPartnered && <span className="bg-purple-600 text-white text-sm px-2 py-1 rounded">Partner</span>}
						</div>

						{/* (Un)Follow Button  */}
						{userPageVariant != "personal" ? (
							!isFollowing ? (
								<Button
									extraClasses="w-full bg-purple-700 z-50 hover:bg-[#28005e]"
									onClick={() => followUser(profileData.id, setShowAuthModal)}
								>
									Follow
								</Button>
							) : (
								<Button extraClasses="w-full bg-[#a80000] z-50" onClick={() => unfollowUser(profileData?.id, setShowAuthModal)}>
									Unfollow
								</Button>
							)
						) : (
							""
						)}
					</div>

					{/* Bio */}
					<div className="col-span-1 bg-[var(--user-sideBox)] rounded-lg p-6 grid grid-rows-[auto_1fr] text-center items-center justify-center">
						{/* User Type (e.g., "USER") */}
						<small className="text-green-400">{userPageVariant.toUpperCase()}</small>

						<div className="mt-6 text-center">
							<h2 className="text-xl font-semibold mb-3">About {profileData.username}</h2>
							<p className="text-gray-300 whitespace-pre-wrap">{profileData.bio}</p>
						</div>
					</div>

					{/* Content Section */}
					<div
						id="content"
						className="col-span-2 bg-[var(--user-contentBox)] rounded-lg p-6 grid grid-rows-[auto_1fr] text-center items-center justify-center"
					>
						{/* Stream */}
						{currentStream && (
							<div className="mb-8">
								<h2 className="text-2xl bg-[#ff0000] border py-4 px-12 font-black mb-4 rounded-[4rem]">Currently Live!</h2>
								<StreamListItem
									id={profileData.id}
									title={currentStream.title || ""}
									streamCategory=""
									username=""
									viewers={currentStream.viewers || 0}
									thumbnail={currentStream.thumbnail}
									onItemClick={() => {
										handleNavigation(`/${profileData.username}`);
									}}
								/>
							</div>
						)}
						{/* VODs */}
						{vods.length > 0 && (
							<div>
								<h2 className="text-2xl font-bold mb-4"></h2>
								<ListRow
									type="vod"
									title={`Past Broadcasts (${vods.length})`}
									items={vods}
									onItemClick={(vod) => {
										console.log("VOD Clicked:", vod);
									}}
									extraClasses="w-fit max-w-[40vw] py-0 mt-0"
									amountForScroll={2}
									itemExtraClasses="w-[15vw]"
								/>
							</div>
						)}
						{/* No Content */}
						{vods.length === 0 && currentStream && <h2 className="text-2xl font-bold mb-4">No Content Made Yet</h2>}
					</div>

					<div
						id="mini"
						className="bg-[var(--user-sideBox)] col-span-1 rounded-lg  text-center items-center justify-center
  flex flex-col flex-grow gap-4 p-[2rem]"
					>
						<div
							className="bg-[var(--user-follow-bg)] rounded-[1em] hover:scale-105 transition-all ease-in-out duration-300 
                 flex items-center justify-center w-full p-4 content-start"
							onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--follow-shadow)")}
							onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
						>
							<button className="text-[var(--follow-text)] whitespace-pre-wrap" onClick={() => handleNavigation(`/user/${username}/following?tab=streamers`)}>
								Following
							</button>
						</div>
						<div
							className="bg-[var(--user-follow-bg)] rounded-[1em] hover:scale-105 transition-all ease-in-out duration-300 
                 flex items-center justify-center w-full p-4 content-start"
							onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--follow-shadow)")}
							onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
						>
							<ul className="list-none">
								<li className="text-[var(--follow-text)] whitespace-pre-wrap list-none">Streamers</li>
							</ul>
						</div>
						<div
							className="bg-[var(--user-follow-bg)] rounded-[1em] hover:scale-105 transition-all ease-in-out duration-300 
                 flex items-center justify-center w-full p-4 content-start"
							onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--follow-shadow)")}
							onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
						>
							<button onClick={() => handleNavigation(`/user/${username}/following?tab=categories`)}>Categories</button>
						</div>
					</div>
				</div>
			</div>
			{showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
		</DynamicPageContent>
	);
};

export default UserPage;
