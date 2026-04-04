import { Link } from "react-router-dom";
import {
	User,
	Mail,
	Phone,
	GraduationCap,
	Building2,
	Lock,
	Zap,
} from "lucide-react";
import { useState } from "react";

export default function Signup() {
	const [password, setPassword] = useState("");

	const getPasswordStrength = (pass: string) => {
		if (pass.length === 0) return { strength: 0, label: "" };
		if (pass.length < 6) return { strength: 1, label: "WEAK" };
		if (pass.length < 10) return { strength: 2, label: "MEDIUM" };
		return { strength: 3, label: "STRONG" };
	};

	const { strength, label } = getPasswordStrength(password);

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
					<form className="space-y-5">
						<div>
							<div className="relative">
								<User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<input
									type="text"
									placeholder="Full Name"
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								/>
							</div>
						</div>

						<div>
							<div className="relative">
								<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<input
									type="email"
									placeholder="Email Address"
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="relative">
								<Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<input
									type="tel"
									placeholder="Phone Number"
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								/>
							</div>
							<div className="relative">
								<GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<input
									type="text"
									placeholder="School"
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="relative">
								<Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<select className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface-variant appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all">
									<option>Department</option>
									<option>Computer Science</option>
									<option>Engineering</option>
									<option>Business</option>
								</select>
							</div>
							<div className="relative">
								<GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<select className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface-variant appearance-none focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all">
									<option>Level</option>
									<option>Undergraduate</option>
									<option>Graduate</option>
									<option>PhD</option>
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
									placeholder="Confirm Password"
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								/>
							</div>
						</div>

						<div className="flex items-start gap-3">
							<input
								type="checkbox"
								id="terms"
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
							className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold py-4 rounded-full hover:shadow-[0_0_40px_rgba(155,168,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2 font-jakarta"
						>
							Create Account
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
