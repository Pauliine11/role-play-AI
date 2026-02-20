import { motion } from 'framer-motion';

interface CircleCanvasProps {
  centerX: number;
  centerY: number;
  radius: number;
  progress: number;
  isActive: boolean;
  controlPoints: Array<{ x: number; y: number }>;
  currentCheckpoint: number;
  checkpointsValidated: boolean[];
}

export function CircleCanvas({
  centerX,
  centerY,
  radius,
  progress,
  isActive,
  controlPoints,
  currentCheckpoint,
  checkpointsValidated,
}: CircleCanvasProps) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        stroke="#3A2F1E"
        strokeWidth="4"
        opacity="0.3"
      />

      {isActive && (
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke={progress > 95 ? '#22C55E' : '#C9A227'}
          strokeWidth="8"
          strokeDasharray={2 * Math.PI * radius}
          strokeDashoffset={2 * Math.PI * radius * (1 - progress / 100)}
          strokeLinecap="round"
          initial={{ strokeDashoffset: 2 * Math.PI * radius }}
          animate={{
            strokeDashoffset: 2 * Math.PI * radius * (1 - progress / 100),
            filter: progress > 95
              ? ['drop-shadow(0 0 10px rgba(34,197,94,0.8))', 'drop-shadow(0 0 20px rgba(34,197,94,1))', 'drop-shadow(0 0 10px rgba(34,197,94,0.8))']
              : 'drop-shadow(0 0 10px rgba(201,162,39,0.6))',
          }}
          transition={{ duration: 0.2, repeat: progress > 95 ? Infinity : 0 }}
          style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
        />
      )}

      {controlPoints.map((point, index) => {
        const isValidated = checkpointsValidated[index];
        const isCurrent = index === currentCheckpoint;

        return (
          <motion.g key={index}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r={isValidated ? 12 : isCurrent ? 14 : 10}
              fill={isValidated ? '#22C55E' : isCurrent ? '#C9A227' : '#6B5A45'}
              stroke={isValidated ? '#34D399' : isCurrent ? '#E6C847' : '#3A2F1E'}
              strokeWidth={isCurrent ? 3 : 2}
              initial={{ scale: 0 }}
              animate={{
                scale: isValidated ? [1, 1.2, 1] : isCurrent ? [1, 1.1, 1] : 1,
                filter: isCurrent
                  ? ['drop-shadow(0 0 8px rgba(201,162,39,0.8))', 'drop-shadow(0 0 16px rgba(201,162,39,1))', 'drop-shadow(0 0 8px rgba(201,162,39,0.8))']
                  : 'none',
              }}
              transition={{
                scale: {
                  duration: isValidated ? 0.5 : isCurrent ? 1 : 0,
                  repeat: isCurrent && !isValidated ? Infinity : 0,
                  ease: 'easeInOut',
                },
                filter: {
                  duration: 1,
                  repeat: isCurrent && !isValidated ? Infinity : 0,
                  ease: 'easeInOut',
                },
              }}
            />
            {isValidated && (
              <motion.text
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-white text-2xl font-bold pointer-events-none"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                ✓
              </motion.text>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}
