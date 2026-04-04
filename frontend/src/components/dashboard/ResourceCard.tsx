import { FileText, Clock, BookOpen } from "lucide-react";

interface ResourceCardProps {
	title: string;
	type: "pdf" | "video" | "article";
	duration?: string;
	thumbnail?: string;
	subject: string;
	progress?: number;
	courseCode?: string;
}

export default function ResourceCard({
	title,
	type,
	duration,
	thumbnail,
	subject,
	progress,
	courseCode,
}: ResourceCardProps) {
	const getIcon = () => {
		switch (type) {
			case "pdf":
				return <FileText className="w-5 h-5" />;
			case "video":
				return <BookOpen className="w-5 h-5" />;
			default:
				return <FileText className="w-5 h-5" />;
		}
	};

	return (
		<div className="group bg-surface-container-low rounded-2xl overflow-hidden hover:bg-surface-container transition-all duration-300 border border-outline-variant/10 hover:border-outline-variant/30">
			<div className="relative aspect-video bg-surface-container-high overflow-hidden brightness-90 hover:brightness-100 transition-all">
				{thumbnail ? (
					<img
						src={thumbnail}
						alt={title}
						className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center text-on-surface-variant">
						{getIcon()}
					</div>
				)}
				<div className="absolute top-3 left-3 px-3 py-1 bg-tertiary-container border border-tertiary-container    backdrop-blur-md rounded-full text-xs text-tertiary font-medium font-jakarta">
					{courseCode?.toUpperCase()}
				</div>
				<div className="absolute border border-outline-variant/10 top-3 right-3 px-3 py-1 bg-surface-variant/40 backdrop-blur-md rounded-full text-xs text-on-surface font-jakarta">
					{type.toUpperCase()}
				</div>
			</div>

			<div className="p-5">
				<div className="flex items-start justify-between gap-2 mb-2">
					<h3 className="text-sm font-semibold text-on-surface line-clamp-2 group-hover:text-primary transition-colors">
						{title}
					</h3>
				</div>

				<p className="text-xs text-on-surface-variant mb-3">{subject}</p>

				{duration && (
					<div className="flex items-center gap-2 text-xs text-on-surface-variant mb-3">
						<Clock className="w-4 h-4" />
						<span>{duration}</span>
					</div>
				)}

				{progress !== undefined && (
					<div>
						<div className="flex justify-between text-xs text-on-surface-variant mb-1">
							<span>Progress</span>
							<span>{progress}%</span>
						</div>
						<div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
							<div
								className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
								style={{ width: `${progress}%` }}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
