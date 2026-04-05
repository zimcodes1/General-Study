import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Zap } from "lucide-react";
import Google from "../components/svgs/Google";
import { useEffect, useState, type FormEvent } from "react";
import { auth } from "../utils/auth";

export default function Login() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			await auth.login(formData);
			navigate("/dashboard");
		} catch (err: any) {
			setError(err.message || "Login failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		document.title = "Login - General Study";
	}, []);

	return (
		<div className="min-h-screen bg-surface flex items-center justify-center px-4 py-8 relative">
			<div className="w-full max-w-md">
				<div className="text-center mb-12">
					<div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl mb-6">
						<img src="/images/logo.png" alt="General Study Logo" />
					</div>
					<h1 className="text-4xl font-bold text-on-surface mb-2 tracking-tight">
						General Study
					</h1>
					<p className="text-on-surface-variant text-sm tracking-wide">
						SMARTER STUDY. POWERED BY AI.
					</p>
				</div>

				<div className="bg-surface-container-low/60 backdrop-blur-[40px] rounded-3xl p-8 border border-outline-variant/15">
					{error && (
						<div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
							{error}
						</div>
					)}
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<label className="block text-on-surface-variant text-xs uppercase tracking-wider mb-3 font-jakarta">
								Email Address
							</label>
							<div className="relative">
								<Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="name@example.com"
									required
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								/>
							</div>
						</div>

						<div>
							<div className="flex justify-between items-center mb-3">
								<label className="block text-on-surface-variant text-xs uppercase tracking-wider font-jakarta">
									Password
								</label>
								<Link
									to="/forgot-password"
									className="text-tertiary text-xs hover:text-tertiary/80 transition-colors"
								>
									Forgot Password?
								</Link>
							</div>
							<div className="relative">
								<Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
								<input
									type="password"
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="••••••••"
									required
									className="w-full bg-surface-container-low rounded-xl pl-12 pr-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/50 focus:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-tertiary/30 transition-all"
								/>
							</div>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary-fixed font-semibold py-4 rounded-full hover:shadow-[0_0_40px_rgba(155,168,255,0.3)] transition-all duration-300 flex items-center justify-center gap-2 font-jakarta disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Logging in..." : "Login & Continue"}
							<Zap className="w-5 h-5 fill-current" />
						</button>
					</form>

					<div className="mt-8">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-outline-variant/20"></div>
							</div>
							<div className="relative flex justify-center text-xs">
								<span className="bg-surface-container-low px-4 text-on-surface-variant">
									OR CONTINUE WITH
								</span>
							</div>
						</div>

						<div className="flex justify-center items-center mt-6">
							<button className="w-full bg-surface-container-high rounded-xl py-3 text-on-surface text-sm font-jakarta hover:bg-surface-container-highest transition-colors flex items-center justify-center gap-2">
								<Google />
								Google
							</button>
						</div>
					</div>
				</div>

				<p className="text-center mt-8 text-on-surface-variant text-sm">
					Don't have an account?{" "}
					<Link
						to="/signup"
						className="text-tertiary hover:text-tertiary/80 transition-colors font-semibold"
					>
						Sign up
					</Link>
				</p>
			</div>
		</div>
	);
}
