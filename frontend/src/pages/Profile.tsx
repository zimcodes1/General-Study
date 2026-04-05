import { useState, useEffect } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs, { type TabType } from "../components/profile/ProfileTabs";
import ProfileStats from "../components/profile/ProfileStats";
import ActivityList from "../components/profile/ActivityList";
import ResourceGrid from "../components/dashboard/ResourceGrid";
import { auth } from "../utils/auth";

export default function Profile() {
	const [activeTab, setActiveTab] = useState<TabType>("resources");

	const [userInfo, setUser] = useState<any>(null);
	useEffect(() => {
		const userData = auth.getUser();
		setUser(userData);
	}, []);

	const myResources = [
		{
			id: "1",
			title: "Advanced Python Programming",
			type: "pdf" as const,
			subject: "Programming",
			courseCode: "CSC 305",
			rating: 4.8,
			department: "Computer Science",
			level: "Advanced",
		},
		{
			id: "2",
			title: "Database Design Principles",
			type: "pdf" as const,
			subject: "Database Systems",
			courseCode: "CSC 310",
			rating: 4.5,
			department: "Computer Science",
			level: "Intermediate",
		},
		{
			id: "3",
			title: "Cybersecurity Best Practices",
			type: "pdf" as const,
			subject: "Security",
			courseCode: "CSC 320",
			rating: 4.9,
			department: "Computer Science",
			level: "Intermediate",
		},
	];

	const bookmarkedResources = [
		{
			id: "4",
			title: "Introduction to Machine Learning",
			type: "pdf" as const,
			subject: "Computer Science",
			courseCode: "CSC 201",
			rating: 4.8,
			department: "Computer Science",
			level: "Advanced",
		},
		{
			id: "5",
			title: "Data Structures & Algorithms",
			type: "pdf" as const,
			subject: "Computer Science",
			courseCode: "CSC 301",
			rating: 4.9,
			department: "Computer Science",
			level: "Intermediate",
		},
		{
			id: "6",
			title: "Cloud Computing Essentials",
			type: "pdf" as const,
			subject: "Cloud Computing",
			courseCode: "CSC 405",
			rating: 4.6,
			department: "Computer Science",
			level: "Advanced",
		},
	];

	const handleEditProfile = () => {
		console.log("Edit profile clicked");
	};

	return (
		<DashboardLayout>
			<div className="px-4 lg:px-8 py-8">
				<ProfileHeader {...userInfo} onEdit={handleEditProfile} />

				<ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

				{activeTab === "resources" && (
					<div>
						<ResourceGrid
							title="My Uploaded Resources"
							resources={myResources}
							maxItems={myResources.length}
							showRemoveButton
						/>
					</div>
				)}

				{activeTab === "bookmarks" && (
					<div>
						<ResourceGrid
							title="Bookmarked Resources"
							resources={bookmarkedResources}
							maxItems={bookmarkedResources.length}
							showRemoveButton
						/>
					</div>
				)}

				{activeTab === "activity" && (
					<div>
						<ActivityList />
					</div>
				)}

				{activeTab === "stats" && (
					<div>
						<ProfileStats />
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
