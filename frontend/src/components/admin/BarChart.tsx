interface BarChartProps {
    data: { week: string; count: number }[];
    label?: string;
    color?: string;
}

export default function BarChart({ data, label = 'Count', color = 'var(--color-primary, #6750a4)' }: BarChartProps) {
    const maxVal = Math.max(...data.map((d) => d.count), 1);
    const chartHeight = 120;
    const barWidth = 28;
    const gap = 8;
    const chartWidth = data.length * (barWidth + gap) - gap;

    return (
        <div className="w-full overflow-x-auto">
            <svg
                width="100%"
                viewBox={`0 0 ${chartWidth + 16} ${chartHeight + 40}`}
                className="overflow-visible"
                style={{ minWidth: `${chartWidth + 16}px` }}
            >
                {/* Gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                    const y = chartHeight - pct * chartHeight;
                    return (
                        <line
                            key={pct}
                            x1={0}
                            x2={chartWidth + 16}
                            y1={y}
                            y2={y}
                            stroke="currentColor"
                            strokeOpacity={0.07}
                            strokeWidth={1}
                        />
                    );
                })}

                {data.map((d, i) => {
                    const barH = Math.max((d.count / maxVal) * chartHeight, 2);
                    const x = i * (barWidth + gap) + 8;
                    const y = chartHeight - barH;

                    return (
                        <g key={i}>
                            {/* Bar */}
                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barH}
                                rx={4}
                                ry={4}
                                fill={color}
                                opacity={0.85}
                                className="transition-all duration-300"
                            />
                            {/* Value on top */}
                            {d.count > 0 && (
                                <text
                                    x={x + barWidth / 2}
                                    y={y - 4}
                                    textAnchor="middle"
                                    fontSize={9}
                                    fill="currentColor"
                                    opacity={0.55}
                                    fontFamily="inherit"
                                >
                                    {d.count}
                                </text>
                            )}
                            {/* Week label */}
                            <text
                                x={x + barWidth / 2}
                                y={chartHeight + 16}
                                textAnchor="middle"
                                fontSize={9}
                                fill="currentColor"
                                opacity={0.5}
                                fontFamily="inherit"
                            >
                                {d.week}
                            </text>
                        </g>
                    );
                })}
            </svg>
            {label && (
                <p className="text-xs text-on-surface-variant text-center mt-1 opacity-60">{label}</p>
            )}
        </div>
    );
}
