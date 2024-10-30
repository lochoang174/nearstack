"use client";

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import { CodeNode } from '../components/CodeNode';
 
import '@xyflow/react/dist/style.css';
import { CustomDefaultNode } from '../components/CustomDefaultNode';
 
const initialNodes = [
  { 
    id: '1', 
    type: 'codeNode',
    position: { x: 0, y: 0 }, 
    data: { code: 'console.log("Hello, React Flow!");', fileName: 'hello.tsx' } 
  },
  { 
    id: '2', 
    type: 'codeNode',
    position: { x: 0, y: 200 }, 
    data: { code: 'const answer = 42;', fileName: 'answer.tsx' } 
  },
  { 
    id: '3', 
    type: 'codeNode',
    position: { x: 0, y: 400 }, 
    data: { code: 'function NewComponent() {\n  return (\n    <div>\n      <h1>New Component</h1>\n    </div>\n  );\n}', fileName: 'newComponent.tsx' } 
  },
  { 
    id: '4', 
    type: 'default',
    position: { x: -200, y: 200 }, 
    data: { label: 'Create BOS components' } 
  },
];
const initialEdges = [
  { id: 'e4-1', source: '4', target: '1', markerEnd: { type: MarkerType.Arrow } },
  { id: 'e4-2', source: '4', target: '2', markerEnd: { type: MarkerType.Arrow } },
  { id: 'e4-3', source: '4', target: '3', markerEnd: { type: MarkerType.Arrow } },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const nodeTypes = useMemo(() => ({ 
    codeNode: CodeNode,
    customDefault: CustomDefaultNode
  }), []);

  // Update the node type in initialNodes
  const updatedInitialNodes = useMemo(() => initialNodes.map(node => 
    node.id === '4' ? { ...node, type: 'customDefault' } : node
  ), []);

  const [updatedNodes, setUpdatedNodes, onUpdatedNodesChange] = useNodesState(updatedInitialNodes);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={updatedNodes}
        edges={edges}
        onNodesChange={onUpdatedNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

