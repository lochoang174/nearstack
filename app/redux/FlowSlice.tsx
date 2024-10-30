// flowSlice.ts - Không thay đổi
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge, addEdge as xyAddEdge } from '@xyflow/react'; // Đổi tên addEdge từ @xyflow/react

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  nodeId: number;
}

const initialState: FlowState = {
  nodes: [],
  edges: [],
  nodeId: 1,
};

export const flowSlice = createSlice({
  name: 'flow',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<{ code: string; fileName: string }>) => {
      const newNode = {
        id: `${state.nodeId}`,
        type: 'codeNode',
        position: { x: Math.random() * 400, y: Math.random() * 400 },
        data: { code: action.payload.code, fileName: action.payload.fileName },
      };
      state.nodes.push(newNode);
      state.nodeId += 1;
    },
    addEdge: (state, action: PayloadAction<{ sourceId: string; targetId: string }>) => {
      const newEdge = {
        id: `e-${action.payload.sourceId}-${action.payload.targetId}`,
        source: action.payload.sourceId,
        target: action.payload.targetId,
        markerEnd: { type: 'arrowclosed' },
      };
      // @ts-ignore
      state.edges = xyAddEdge(newEdge, state.edges); // Sử dụng addEdge từ @xyflow/react
    },
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
  },
});

export const { addNode, addEdge, setNodes, setEdges } = flowSlice.actions;
export default flowSlice.reducer;
