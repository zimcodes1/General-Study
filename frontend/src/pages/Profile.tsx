import { useState, useEffect } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs, { type TabType } from "../components/profile/ProfileTabs";
import ProfileStats from "../components/profile/ProfileStats";
import ActivityList from "../components/profile/ActivityList";
import ResourceGrid from "../components/dashboard/ResourceGrid";
import { auth } from "../utils/auth";
import { tokenStorage } from "../utils/auth";

export interface Resource {
	id: string;
	title: string;
	type: "pdf" | "doc" | "docx" | "ppt" | "pptx" | "txt" | "image" | "video" | "audio" | "other";
	subject?: string;
	courseCode: string;
	rating: number;
	department?: string;
	level: string;
	file_type?: string;
	course_name?: string;
}

interface Activity {
	id: string;
	type: 'quiz' | 'exam' | 'upload' | 'bookmark' | 'complete';
	title: string;
	description: string;
	timestamp: string;
	score?: number;
}

interface Stats {
	total_points: number;
	current_streak: number;
	completed_catalogues: number;
	average_score: number;
	last_active_date: string | null;
	total_reviews: number;
	total_bookmarks: number;
	courses_enrolled: number;
}

export default function Profile() {
	const [activeTab, setActiveTab] = useState<TabType>("resources");
	const [userInfo, setUser] = useState<any>(null);
	const  accessToken = tokenStorage.getAccessToken();

	// Resources state
	const [myResources, setMyResources] = useState<Resource[]>([]);
	const [resourcesLoading, setResourcesLoading] = useState(false);
	const [resourcesOffset, setResourcesOffset] = useState(0);
	const [showMoreResourcesBtn, setShowMoreResourcesBtn] = useState(true);

	// Bookmarks state
	const [bookmarkedResources, setBookmarkedResources] = useState<Resource[]>([]);
	const [bookmarksLoading, setBookmarksLoading] = useState(false);
	const [bookmarksOffset, setBookmarksOffset] = useState(0);
	const [showMoreBookmarksBtn, setShowMoreBookmarksBtn] = useState(true);

	// Activity state
	const [activities, setActivities] = useState<Activity[]>([]);
	const [activityLoading, setActivityLoading] = useState(false);

	// Stats state
	const [stats, setStats] = useState<Stats | null>(null);
	const [statsLoading, setStatsLoading] = useState(false);

	useEffect(() => {
		const userData = auth.getUser();
		if (userData) {
			setUser(userData);
		}
	}, []);

	// Fetch My Resources
	useEffect(() => {
		if (activeTab === "resources" && accessToken) {
			fetchMyResources(0);
		}
	}, [activeTab, accessToken]);

	const fetchMyResources = async (offset: number) => {
		setResourcesLoading(true);
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/resources/?uploaded_by=me&limit=9&offset=${offset}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			if (response.ok) {
				const data = await response.json();
				const formattedResources: Resource[] = data.results.map((r: any) => ({
					id: r.id,
					title: r.title,
					type: r.file_type || "other",
					subject: r.department_name,
					courseCode: r.course_code,
					rating: r.rating_avg,
					department: r.department_name,
					level: r.level,
					file_type: r.file_type,
					course_name: r.course_name,
				}));

				if (offset === 0) {
					setMyResources(formattedResources);
				} else {
					setMyResources(prev => [...prev, ...formattedResources]);
				}

				setResourcesOffset(offset + 9);
				setShowMoreResourcesBtn((offset + 9) < data.count);
			}
		} catch (error) {
			console.error('Error fetching resources:', error);
		} finally {
			setResourcesLoading(false);
		}
	};

	// Fetch Bookmarks
	useEffect(() => {
		if (activeTab === "bookmarks" && accessToken) {
			fetchBookmarks(0);
		}
	}, [activeTab, accessToken]);

	const fetchBookmarks = async (offset: number) => {
		setBookmarksLoading(true);
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/resources/bookmarks/?limit=9&offset=${offset}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			if (response.ok) {
				const data = await response.json();
				const formattedResources: Resource[] = data.results.map((r: any) => ({
					id: r.id,
					title: r.title,
					type: r.file_type || "other",
					subject: r.department_name,
					courseCode: r.course_code,
					rating: r.rating_avg,
					department: r.department_name,
					level: r.level,
					file_type: r.file_type,
					course_name: r.course_name,
				}));

				if (offset === 0) {
					setBookmarkedResources(formattedResources);
				} else {
					setBookmarkedResources(prev => [...prev, ...formattedResources]);
				}

				setBookmarksOffset(offset + 9);
				setShowMoreBookmarksBtn((offset + 9) < data.count);
			}
		} catch (error) {
			console.error('Error fetching bookmarks:', error);
		} finally {
			setBookmarksLoading(false);
		}
	};

	// Fetch Activity
	useEffect(() => {
		if (activeTab === "activity" && accessToken) {
			fetchActivity();
		}
	}, [activeTab, accessToken]);

	const fetchActivity = async () => {
		setActivityLoading(true);
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/activities/?limit=20`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			if (response.ok) {
				const data = await response.json();
				const results = data.results || [];

				const formatActivityType = (actionType: string): Activity['type'] => {
					const typeMap: Record<string, Activity['type']> = {
						'resource_upload': 'upload',
						'resource_approved': 'upload',
						'bookmark_add': 'bookmark',
						'bookmark_remove': 'bookmark',
						'review_create': 'complete',
						'review_update': 'complete',
						'assessment_start': 'quiz',
						'assessment_complete': 'exam',
						'catalogue_complete': 'complete',
					};
					return typeMap[actionType] || 'complete';
				};

				const formattedActivities: Activity[] = results.map((a: any) => {
					const createdDate = new Date(a.created_at);
					const now = new Date();
					const diffMs = now.getTime() - createdDate.getTime();
					const diffMins = Math.floor(diffMs / 60000);
					const diffHours = Math.floor(diffMs / 3600000);
					const diffDays = Math.floor(diffMs / 86400000);

					let timeAgo = '';
					if (diffMins < 1) {
						timeAgo = 'Just now';
					} else if (diffMins < 60) {
						timeAgo = `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
					} else if (diffHours < 24) {
						timeAgo = `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
					} else {
						timeAgo = `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
					}

					return {
						id: a.id,
						type: formatActivityType(a.action_type),
						title: a.action_display,
						description: a.resource_title ? `${a.action_display} - ${a.resource_title}` : a.action_display,
						timestamp: timeAgo,
						score: a.metadata?.score,
					};
				});

				setActivities(formattedActivities);
			}
		} catch (error) {
			console.error('Error fetching activities:', error);
		} finally {
			setActivityLoading(false);
		}
	};

	// Fetch Stats
	useEffect(() => {
		if (activeTab === "stats" && accessToken) {
			fetchStats();
		}
	}, [activeTab, accessToken]);

	const fetchStats = async () => {
		setStatsLoading(true);
		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_URL}/users/stats/`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			if (response.ok) {
				const data = await response.json();
				setStats(data);
			}
		} catch (error) {
			console.error('Error fetching stats:', error);
		} finally {
			setStatsLoading(false);
		}
	};

	const handleEditProfile = () => {
		console.log("Edit profile clicked");
	};

	return (
		<DashboardLayout>
			<div className="px-4 lg:px-8 py-8">
				{userInfo && <ProfileHeader {...userInfo} onEdit={handleEditProfile} />}

				<ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

				{activeTab === "resources" && (
					<div>
						<ResourceGrid
							title="My Uploaded Resources"
							resources={myResources.length > 0 ? myResources : []}
							maxItems={myResources.length}
							showRemoveButton
						/>
						{myResources.length === 0 && !resourcesLoading && (
							<div className="text-center py-12">
								<p className="text-on-surface-variant">No resources uploaded yet</p>
							</div>
						)}
						{showMoreResourcesBtn && (
							<div className="flex justify-center mt-8">
								<button
									onClick={() => fetchMyResources(resourcesOffset)}
									disabled={resourcesLoading}
									className="px-6 py-2 text-on-primary cursor-pointer disabled:opacity-50"
								>
									{resourcesLoading ? 'Loading...' : 'Show More +'}
								</button>
							</div>
						)}
					</div>
				)}

				{activeTab === "bookmarks" && (
					<div>
						<ResourceGrid
							title="Bookmarked Resources"
							resources={bookmarkedResources.length > 0 ? bookmarkedResources : []}
							maxItems={bookmarkedResources.length}
							showRemoveButton
						/>
						{bookmarkedResources.length === 0 && !bookmarksLoading && (
							<div className="text-center py-12">
								<p className="text-on-surface-variant">No bookmarks yet</p>
							</div>
						)}
						{showMoreBookmarksBtn && (
							<div className="flex justify-center mt-8">
								<button
									onClick={() => fetchBookmarks(bookmarksOffset)}
									disabled={bookmarksLoading}
									className="px-6 py-2 bg-primary text-on-primary rounded-full hover:bg-primary/90 disabled:opacity-50"
								>
									{bookmarksLoading ? 'Loading...' : 'Show More'}
								</button>
							</div>
						)}
					</div>
				)}

				{activeTab === "activity" && (
					<div>
						{activityLoading ? (
							<div className="text-center py-12">
								<p className="text-on-surface-variant">Loading activity...</p>
							</div>
						) : (
							<ActivityList activities={activities} />
						)}
					</div>
				)}

				{activeTab === "stats" && (
					<div>
						{statsLoading ? (
							<div className="text-center py-12">
								<p className="text-on-surface-variant">Loading stats...</p>
							</div>
						) : stats ? (
							<ProfileStats stats={stats} />
						) : null}
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
