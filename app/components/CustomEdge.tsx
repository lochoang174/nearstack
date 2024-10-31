import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  ...props
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.7
  });

  return (
    <>
      <BaseEdge 
        id={id} 
        path={edgePath}
        style={{
          stroke: '#0CF25D',
          strokeWidth: 2,
          ...style,
        }}
        {...props}
      />
    </>
  );
}
