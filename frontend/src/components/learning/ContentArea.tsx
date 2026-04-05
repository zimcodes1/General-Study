interface ContentAreaProps {
  content: string;
}

export default function ContentArea({ content }: ContentAreaProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
      <div className="prose prose-invert prose-lg max-w-none">
        <div
          className="text-on-surface leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
