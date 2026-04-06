import { FileText, Star, ExternalLink, X, File, Image, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import type { ElementType } from "react";

export type ResourceFileType =
	| "pdf"
	| "doc"
	| "docx"
	| "ppt"
	| "pptx"
	| "txt"
	| "image"
	| "document"
	| "other";

interface ResourceCardProps {
	id?: string;
	title: string;
	type: ResourceFileType;
	thumbnail?: string;
	subject: string;
	progress?: number;
	courseCode?: string;
	rating?: number;
	department?: string;
	level?: string;
	showRemoveButton?: boolean;
	onRemove?: () => void;
}

const getFileTypeMeta = (fileType: ResourceFileType) => {
	let label = "FILE";
	let icon: ElementType = File;
	let className = "text-on-surface-variant bg-surface-container border-outline-variant/20";

	switch (fileType) {
		case "pdf":
			label = "PDF";
			icon = FileText;
			className = "text-red-500 bg-red-500/10 border-red-500/20";
			break;
		case "doc":
		case "docx":
		case "document":
			label = fileType === "docx" ? "DOCX" : "DOC";
			icon = File;
			className = "text-blue-500 bg-blue-500/10 border-blue-500/20";
			break;
		case "ppt":
		case "pptx":
			label = fileType === "pptx" ? "PPTX" : "PPT";
			icon = FileSpreadsheet;
			className = "text-orange-500 bg-orange-500/10 border-orange-500/20";
			break;
		case "txt":
			label = "TXT";
			icon = FileText;
			className = "text-slate-400 bg-slate-400/10 border-slate-400/20";
			break;
		case "image":
			label = "IMAGE";
			icon = Image;
			className = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
			break;
		default:
			break;
	}

	return { label, icon, className };
};

export default function ResourceCard({
	id,
	title,
	type,
	thumbnail,
	subject,
	progress,
	courseCode,
	rating,
	department,
	level,
	showRemoveButton = false,
	onRemove,
}: ResourceCardProps) {
	const fileTypeMeta = getFileTypeMeta(type ?? "other");
	const FileIcon = fileTypeMeta.icon;
	const detailHref = id ? `/catalogue/${id}` : undefined;

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
						<div
							className={`w-16 h-16 rounded-2xl border ${fileTypeMeta.className} flex items-center justify-center`}
						>
							<FileIcon className="w-8 h-8" />
						</div>
					</div>
				)}
				{courseCode && (
					<div className="absolute top-3 left-3 px-3 py-1.5 bg-tertiary-container/80 backdrop-blur-md rounded-full text-xs text-tertiary font-semibold font-jakarta">
						{courseCode}
					</div>
				)}
				{showRemoveButton && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							onRemove?.();
						}}
						className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-variant/60 backdrop-blur-md flex items-center justify-center text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all opacity-0 group-hover:opacity-100"
						title="Remove from catalogue"
					>
						<X className="w-4 h-4" />
					</button>
				)}
			</div>

			<div className="p-5">
				<h3 className="text-base font-semibold text-on-surface line-clamp-2 mb-2 group-hover:text-primary transition-colors">
					{title}
				</h3>

				<p className="text-sm text-on-surface-variant mb-3">{subject}</p>

				<div className="flex items-center gap-2 mb-3">
					<span
						className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${fileTypeMeta.className}`}
					>
						<FileIcon className="w-3.5 h-3.5" />
						{fileTypeMeta.label}
					</span>
				</div>

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
				) : detailHref ? (
					<Link
						to={detailHref}
						className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary-fixed text-sm font-semibold py-2.5 rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 font-jakarta"
					>
						View
						<ExternalLink className="w-4 h-4" />
					</Link>
				) : (
					<button
						type="button"
						className="w-full bg-gradient-to-r from-primary to-secondary text-on-primary-fixed text-sm font-semibold py-2.5 rounded-full hover:shadow-[0_0_30px_rgba(155,168,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 font-jakarta"
					>
						View
						<ExternalLink className="w-4 h-4" />
					</button>
				)}
			</div>
		</div>
	);
}
