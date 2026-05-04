import {
	Search,
	Menu,
	User,
	LogOut,
	ChevronDown,
	Flame,
	Loader2,
} from "lucide-react";
import { auth } from "../../utils/auth";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFileTypeMeta } from "./ResourceCard";
import type { ResourceFileType } from "./ResourceCard";

interface SearchResult {
	id: string;
	title: string;
	course_code?: string;
	file_type?: string;
	faculty_name?: string;
	rating_avg?: number;
}

interface TopbarProps {
	onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
	const [user, setUser] = useState<any>(null);
	const [showDropdown, setShowDropdown] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [showSearchResults, setShowSearchResults] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

	useEffect(() => {
		const userData = auth.getUser();
		setUser(userData);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowDropdown(false);
			}
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setShowSearchResults(false);
			}
		};

		if (showDropdown || showSearchResults) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showDropdown, showSearchResults]);

	useEffect(() => {
		const searchResources = async () => {
			if (!searchQuery.trim()) {
				setSearchResults([]);
				setShowSearchResults(false);
				return;
			}

			setSearchLoading(true);
			try {
				const accessToken = auth.isAuthenticated() ? localStorage.getItem('access_token') : null;
				const response = await fetch(
					`${apiUrl}/resources/?search=${encodeURIComponent(searchQuery)}&limit=5`,
					{
						headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
					}
				);

				if (response.ok) {
					const data = await response.json();
					setSearchResults(data.results || []);
					setShowSearchResults(true);
				} else {
					setSearchResults([]);
				}
			} catch (err) {
				console.error('Search error:', err);
				setSearchResults([]);
			} finally {
				setSearchLoading(false);
			}
		};

		const debounceTimer = setTimeout(searchResources, 300);
		return () => clearTimeout(debounceTimer);
	}, [searchQuery, apiUrl]);

	const getInitials = (name: string) => {
		if (!name) return "U";
		const names = name.split(" ");
		if (names.length >= 2) {
			return (names[0][0] + names[names.length - 1][0]).toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	};

	const handleSearchResultClick = (resourceId: string) => {
		setShowSearchResults(false);
		setSearchQuery("");
		navigate(`/catalogue/${resourceId}`);
	};

	const handleLogout = () => {
		auth.logout();
		navigate("/login");
	};

	return (
		<header className="sticky top-0 z-30 bg-surface-container-low/60 backdrop-blur-[40px] border-b border-outline-variant/15">
			<div className="flex items-center justify-between px-4 lg:px-8 py-4">
				<div className="flex items-center gap-4 flex-1">
					<button
						onClick={onMenuClick}
						className="lg:hidden text-on-surface-variant hover:text-on-surface"
					>
						<Menu className="w-6 h-6" />
					</button>

					<div className="relative flex-1 max-w-xl" ref={searchRef}>
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant z-10" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onFocus={() => searchQuery && setShowSearchResults(true)}
							placeholder="Search courses, resources..."
							className="w-full bg-surface-container-low rounded-full pl-12 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
						/>
						{searchLoading && (
							<Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant animate-spin" />
						)}
						{showSearchResults && searchResults.length > 0 && (
							<div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-low rounded-2xl shadow-lg border border-outline-variant/20 overflow-hidden z-50 max-h-96 overflow-y-auto">
								{searchResults.map((result) => {
									const fileTypeMeta = getFileTypeMeta((result.file_type?.toLowerCase() || 'other') as ResourceFileType);
									const FileIcon = fileTypeMeta.icon;
									return (
										<button
											key={result.id}
											onClick={() => handleSearchResultClick(result.id)}
											className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-colors text-left"
										>
											<div className={`w-10 h-10 rounded-xl border ${fileTypeMeta.className} flex items-center justify-center flex-shrink-0`}>
												<FileIcon className="w-5 h-5" />
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-semibold text-on-surface truncate">{result.title}</p>
												<div className="flex items-center gap-2 text-xs text-on-surface-variant">
													{result.course_code && <span>{result.course_code}</span>}
													{result.course_code && result.faculty_name && <span>•</span>}
													{result.faculty_name && <span className="truncate">{result.faculty_name}</span>}
												</div>
											</div>
											{result.rating_avg !== undefined && result.rating_avg > 0 && (
												<span className="text-xs text-on-surface-variant flex-shrink-0">
													⭐ {result.rating_avg.toFixed(1)}
												</span>
											)}
										</button>
									);
								})}
							</div>
						)}
						{showSearchResults && searchQuery && !searchLoading && searchResults.length === 0 && (
							<div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-low rounded-2xl shadow-lg border border-outline-variant/20 overflow-hidden z-50 p-4 text-center">
								<p className="text-sm text-on-surface-variant">No resources found</p>
							</div>
						)}
					</div>
				</div>

				<div className="flex items-center gap-4">
					<span className="flex items-center text-sm text-on-surface-variant">
            <p className="text-[20px]">
              {user?.streak || "0"}
            </p>
						<button className="relative text-on-surface-variant hover:text-on-surface transition-colors">
							<Flame className="w-5 h-5" />
							<span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-tertiary rounded-full"></span>
						</button>
					</span>
					<div
						className="flex items-center gap-3 pl-4 border-l border-outline-variant/20 relative"
						ref={dropdownRef}
					>
						<div className="hidden sm:block text-right">
							<p className="text-sm font-semibold text-on-surface">
								{user?.full_name || "User"}
							</p>
							<p className="text-xs text-on-surface-variant">
								{user?.faculty?.name || user?.department?.name || "Student"}
							</p>
						</div>
						<button
							onClick={() => setShowDropdown(!showDropdown)}
							className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
						>
							<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary-fixed font-bold text-sm">
								{user ? getInitials(user.full_name) : "U"}
							</div>
							<ChevronDown className="w-4 h-4 text-on-surface-variant hidden sm:block" />
						</button>

						{showDropdown && (
							<div className="absolute top-full right-0 mt-2 w-48 bg-surface-container-low rounded-2xl shadow-lg border border-outline-variant/20 overflow-hidden z-50">
								<Link
									to="/profile"
									onClick={() => setShowDropdown(false)}
									className="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-container transition-colors"
								>
									<User className="w-4 h-4" />
									<span className="text-sm font-jakarta">Profile</span>
								</Link>
								<button
									onClick={handleLogout}
									className="w-full flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-container transition-colors"
								>
									<LogOut className="w-4 h-4" />
									<span className="text-sm font-jakarta">Logout</span>
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}
