import { FileText, Star, ExternalLink } from "lucide-react";

interface ResourceCardProps {
	title: string;
	type: "pdf" | "image" | "document";
	thumbnail?: string;
	subject: string;
	progress?: number;
	courseCode?: string;
	rating?: number;
	department?: string;
	level?: string;
}

export default function ResourceCard({
	title,
	thumbnail,
	subject,
	progress,
	courseCode,
	rating,
	department,
	level,
}: ResourceCardProps) {
	const getIcon = () => {
		return <FileText className="w-8 h-8" />;
	};

	return (
		<div className="group bg-surface-container-low rounded-[20px] overflow-hidden hover:bg-surface-container transition-all duration-300 border border-outline-variant/10 hover:border-outline-variant/30 hover:shadow-[0_20px_60px_rgba(155,168,255,0.15)] hover:-translate-y-1">
			<div className="relative aspect-[4/3] bg-surface-container-high overflow-hidden">
				{thumbnail ? (
					<img
						src={thumbnail}
						alt={title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-on-surface-variant/40">
						{getIcon()}
					</div>
				)}
				{courseCode && (
					<div className="absolute top-3 left-3 px-3 py-1.5 bg-tertiary-container/80 backdrop-blur-md rounded-full text-xs text-tertiary font-semibold font-jakarta">
						{courseCode}
					</div>
				)}
			</div>

			<div className="p-5">
				<h3 className="text-base font-semibold text-on-surface line-clamp-2 mb-2 group-hover:text-primary transition-colors">
					{title}
				</h3>

				<p className="text-sm text-on-surface-variant mb-3">{subject}</p>

				{rating !== undefined && (
					<div className="flex items-center gap-2 mb-3">
						<div className="flex items-center gap-1">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className={`w-4 h-4 ${
										i < Math.floor(rating)
											? 'fill-tertiary text-tertiary'
											: 'text-surface-container-high'
									}`}
								/>
							))}
						</div>
						<span className="text-xs text-on-surface-variant font-jakarta">{rating.toFixed(1)}</span>
					</div>
				)}

				{(department || level) && (
					<div className="flex items-center gap-2 mb-4 text-xs text-on-surface-variant">
						{department && <span>{department}</span>}
						{department && level && <span>•</span>}
						{level && <span>{level}</span>}
					</div>
				)}

				{progress !== undefined ? (
					<div>
						<div className="flex justify-between text-xs text-on-surface-variant mb-2">
							<span>Progress</span>
							<span className="font-semibold">{progress}%</span>
						</div>
						<div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				) : (
					<button className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary-fixed text-sm font-semibold py-2.5 rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 font-jakarta">
						View
						<ExternalLink className="w-4 h-4" />
					</button>
				)}
			</div>
		</div>
	);
}
