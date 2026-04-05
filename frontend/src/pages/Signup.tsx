import { Link, useNavigate } from "react-router-dom";
import {
	User,
	Mail,
	Phone,
	GraduationCap,
	Building2,
	Lock,
	Zap,
} from "lucide-react";
import { useState, useEffect, type FormEvent } from "react";
import { auth, type RegisterData, authAPI, type Faculty, type Department } from "../utils/auth";

export default function Signup() {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [formData, setFormData] = useState({
		full_name: "",
		email: "",
		phone: "",
		school: "",
		faculty_id: "",
		department_id: "",
		degree_level: "",
		current_level: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [loadingDepartments, setLoadingDepartments] = useState(false);

	const getPasswordStrength = (pass: string) => {
		if (pass.length === 0) return { strength: 0, label: "" };
		if (pass.length < 6) return { strength: 1, label: "WEAK" };
		if (pass.length < 10) return { strength: 2, label: "MEDIUM" };
		return { strength: 3, label: "STRONG" };
	};

	const { strength, label } = getPasswordStrength(password);

	useEffect(() => {
		document.title = "Sign Up - General Study";
		loadFaculties();
	}, []);

	const loadFaculties = async () => {
		try {
			const data = await authAPI.getFaculties();
			setFaculties(data);
		} catch (err) {
			console.error('Failed to load faculties:', err);
		}
	};

	const loadDepartments = async (facultyId: string) => {
		setLoadingDepartments(true);
		try {
			const data = await authAPI.getDepartments(facultyId);
			setDepartments(data);
		} catch (err) {
			console.error('Failed to load departments:', err);
		} finally {
			setLoadingDepartments(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;

		if (name === 'faculty_id' && value) {
			setFormData({ ...formData, faculty_id: value, department_id: '' });
			setDepartments([]);
			loadDepartments(value);
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters");
			return;
		}

		if (!formData.faculty_id || !formData.department_id || !formData.degree_level || !formData.current_level) {
			setError("Please fill all required fields");
			return;
		}

		setLoading(true);

		try {
			const registerData: RegisterData = {
				...formData,
				password,
			};
			await auth.register(registerData);
			navigate("/dashboard");
		} catch (err: any) {
			setError(err.message || "Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12 relative">
			<div className="w-full max-w-2xl">
				<div className="text-center mb-8">
					<span className="flex justify-center gap-2 items-center mx-auto">
						<img src="/images/logo.png" alt="General Study Logo" width={35} />
						<h1 className="text-2xl font-bold text-on-surface mb-1 tracking-tight">
							General Study
						</h1>
					</span>
					<h2 className="text-3xl md:text-4xl font-bold text-on-surface mb-2">
						Create Your Account
					</h2>
					<p className="text-on-surface-variant text-sm">
						Start your smart learning journey
					</p>
				</div>

				<div className="bg-surface-container-low/60 backdrop-blur-[40px] rounded-3xl p-8 border border-outline-variant/15">
					{error && (
						<div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
							{error}
						</div>
					)}
					<form className="space-y-5" onSubmit={handleSubmit}>
						<div>
							<div className="relative">
								<User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<input
									type="text"
									name="full_name"
									value={formData.full_name}
									onChange={handleChange}
									placeholder="Full Name"
									required
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								/>
							</div>
						</div>

						<div>
							<div className="relative">
								<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="Email Address"
									required
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="relative">
								<Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<input
									type="tel"
									name="phone"
									value={formData.phone}
									onChange={handleChange}
									placeholder="Phone Number"
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								/>
							</div>
							<div className="relative">
								<GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<input
									type="text"
									name="school"
									value={formData.school}
									onChange={handleChange}
									placeholder="School"
									required
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="relative">
								<Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<select
									name="faculty_id"
									value={formData.faculty_id}
									onChange={handleChange}
									required
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								>
									<option value="">Select Faculty</option>
									{faculties.map((faculty) => (
										<option key={faculty.id} value={faculty.id}>
											{faculty.name}
										</option>
									))}
								</select>
							</div>
							<div className="relative">
								<Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<select
									name="department_id"
									value={formData.department_id}
									onChange={handleChange}
									required
									disabled={!formData.faculty_id || loadingDepartments}
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<option value="">
										{loadingDepartments ? 'Loading...' : 'Select Department'}
									</option>
									{departments.map((dept) => (
										<option key={dept.id} value={dept.id}>
											{dept.name}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="relative">
								<GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<select
									name="degree_level"
									value={formData.degree_level}
									onChange={handleChange}
									required
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								>
									<option value="">Degree Level</option>
									<option value="undergraduate">Undergraduate</option>
									<option value="graduate">Graduate</option>
									<option value="postgraduate">Postgraduate</option>
								</select>
							</div>
							<div className="relative">
								<GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<select
									name="current_level"
									value={formData.current_level}
									onChange={handleChange}
									required
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								>
									<option value="">Current Level</option>
									<option value="100">100 Level</option>
									<option value="200">200 Level</option>
									<option value="300">300 Level</option>
									<option value="400">400 Level</option>
									<option value="500">500 Level</option>
									<option value="600">600 Level</option>
								</select>
							</div>
						</div>

						<div>
							<div className="relative">
								<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<input
									type="password"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								/>
							</div>
							{password && (
								<div className="mt-2 flex items-center gap-2">
									<div className="flex-1 flex gap-1">
										{[1, 2, 3].map((i) => (
											<div
												key={i}
												className={`h-1 flex-1 rounded-full transition-all ${
													i <= strength
														? "bg-gradient-to-r from-primary to-secondary"
														: "bg-surface-container-high"
												}`}
											/>
										))}
									</div>
									<span className="text-xs text-on-surface-variant font-jakarta">
										{label}
									</span>
								</div>
							)}
						</div>

						<div>
							<div className="relative">
								<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<input
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Confirm Password"
									required
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								/>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<input
								type="checkbox"
								id="terms"
								required
								className="mt-1 w-4 h-4 accent-[#a7aaba] rounded border-outline-variant bg-surface-container-low focus:ring-2 focus:ring-tertiary/30"
							/>
							<label
								htmlFor="terms"
								className="text-sm text-on-surface-variant"
							>
								I agree to the{" "}
								<Link
									to="/terms"
									className="text-tertiary hover:text-tertiary/80"
								>
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link
									to="/privacy"
									className="text-tertiary hover:text-tertiary/80"
								>
									Privacy Policy
								</Link>
								.
							</label>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold py-4 rounded-full hover:shadow-[0_0_40px_rgba(155,168,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2 font-jakarta disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Creating Account..." : "Create Account"}
							<Zap className="w-5 h-5 fill-current" />
						</button>
					</form>
				</div>

				<p className="text-center mt-6 text-on-surface-variant text-sm">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-tertiary hover:text-tertiary/80 transition-colors font-semibold"
					>
						Login
					</Link>
				</p>

				<footer className="mt-12 flex flex-wrap justify-between max-sm:justify-center items-center gap-4 text-xs text-on-surface-variant">
					<div>
						<p className="font-bold mb-1 max-sm:text-center">General Study</p>
						<p>© 2026 General Study. All rights reserved.</p>
					</div>
					<div className="flex gap-6 max-sm:hidden">
						<Link
							to="/privacy"
							className="hover:text-on-surface transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							to="/terms"
							className="hover:text-on-surface transition-colors"
						>
							Terms of Service
						</Link>
						<Link
							to="/integrity"
							className="hover:text-on-surface transition-colors"
						>
							Academic Integrity
						</Link>
						<Link
							to="/support"
							className="hover:text-on-surface transition-colors"
						>
							Support
						</Link>
					</div>
				</footer>
			</div>
		</div>
	);
}
