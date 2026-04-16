export default function ECGChart({ data = [], riskLevel = 'Low', width = 120, height = 36 }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + ((max - v) / range) * (height - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  const color = riskLevel === 'High' ? 'var(--red)' : riskLevel === 'Medium' ? 'var(--amber)' : 'var(--green)';
  const glow  = riskLevel === 'High' ? 'rgba(239,68,68,0.4)' : riskLevel === 'Medium' ? 'rgba(245,158,11,0.3)' : 'rgba(34,197,94,0.3)';

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <defs>
        <filter id={`glow-${riskLevel}`}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Glow layer */}
      <polyline points={pts} className="ecg-line" stroke={glow} strokeWidth={3} filter={`url(#glow-${riskLevel})`} />
      {/* Sharp line */}
      <polyline points={pts} className="ecg-line" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}
