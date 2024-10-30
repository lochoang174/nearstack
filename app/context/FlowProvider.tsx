import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  MarkerType,
  NodeChange,
  EdgeChange,
} from '@xyflow/react';
import { Widget, CommitButton } from "esm-near-social-vm";

interface FlowContextType {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  addNewNode: (code: string, fileName: string, id:string, totalNodes: number) => void;
  setNodeCode: (nodeId: string, newCode: string) => void;
  setNodeDefault: (label: string, nodeId: string) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  selectedNode: Node | null;
  updateReviewNode: (id: string, code: string, x: number, y: number) => void;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [nodeId, setNodeId] = useState(1);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === 'codeNode') {
      setSelectedNode(node);
   
    }
  }, []);
  const addNewNode = useCallback((code: string, fileName: string, id: string, totalNodes: number) => {
    const spacingX = 300; // Khoảng cách ngang giữa các cột node
    const spacingY = 400; // Khoảng cách dọc giữa các node (tăng lên để có thêm không gian cho preview node)
    const startX = 0; // Vị trí X bắt đầu
    const startY = 200; // Vị trí Y bắt đầu (tăng lên để có không gian cho default node)
    const index = parseInt(id);
  
    const newNode = {
      id: `${id}`,
      type: 'codeNode',
      position: { 
        x: startX + ((index - 1) % 2) * spacingX + (index % 2 === 0 ? 50 : -50), 
        y: startY + Math.floor((index - 1) / 2) * spacingY 
      },
      data: { code, fileName },
    };
    const newPreviewNode = {
      id: `p-${id}`,
      type: 'previewNode',
      position: { 
        x: startX + ((index - 1) % 2) * spacingX + (index % 2 === 0 ? 50 : -50), 
        y: startY + Math.floor((index - 1) / 2) * spacingY + 200 
      },
      data: { 
        component: <div>
          <Widget
            key={`preview-${id}`}
            code={code}
          />
        </div>
      },
    };
    setNodes((nds) => [...nds, newNode, newPreviewNode]);
  
    // Thêm edge từ default node (id: '0') đến code node mới
    const newEdge = {
      id: `e-0-${id}`,
      source: '0',
      target: `${id}`,
      markerEnd: { type: MarkerType.Arrow },
    };
    // Thêm edge từ code node đến preview node
    const newEdge2 = {
      id: `e-${id}-p-${id}`,
      source: `${id}`,
      target: `p-${id}`,
      markerEnd: { type: MarkerType.Arrow },
    };
    setEdges((eds) => addEdge(newEdge, eds));
    setEdges((eds) => addEdge(newEdge2, eds));
  }, [setNodes, setEdges]);
  const updateReviewNode = useCallback((id: string, code: string, x: number, y: number) => {
    //@ts-ignore
    setNodes((nds: Node[]) => nds.map((node) => {
      if (node.id === `p-${id}`) {
        // Update existing preview node
        return {
          ...node,
          // position: { x, y },
          data: {
            component: (
              <div>
                <Widget
                  key={`preview-${id}`}
                  code={code}
                />
              </div>
            ),
          },
        };
      } else if (node.id === id) {
        // Update code node
        return {
          ...node,
          data: { ...node.data, code },
        };
      }
      return node;
    }));
  }, [setNodes]);

  const setNodeCode = useCallback((nodeId: string, newCode: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, code: newCode } } : node
      )
    );
  }, [setNodes]);
  const setNodeDefault = (label: string, nodeId: string) => {
    const newNode = {
      id: nodeId,
      type: "customDefault",
      position: { x: 150, y: 0 },
      data: { label },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeId((id) => id + 1);
  }
  return (
    <FlowContext.Provider
      value={{
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNewNode,
        setNodeCode,
        setNodeDefault,
        onNodeClick,
        selectedNode,
        updateReviewNode,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};
