"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  useReactFlow,
} from "@xyflow/react";
import { CodeNode } from "../components/CodeNode";
import { CustomDefaultNode } from "../components/CustomDefaultNode";
import { Editor } from "@monaco-editor/react";
//@ts-ignore
import { Widget, useInitNear } from "esm-near-social-vm";
import "@xyflow/react/dist/style.css";
import { useAppSelector } from "../redux/store";

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]); // Bắt đầu với mảng nodes rỗng
  const [edges, setEdges, onEdgesChange] = useEdgesState([]); // Bắt đầu với mảng edges rỗng
  const [nodeId, setNodeId] = useState(1); // Để tạo id duy nhất cho node
  const [code, setCode] = useState("// Write your code here"); // State để lưu code từ Monaco Editor
  const [fileName, setFileName] = useState("newFile.tsx"); // Tên file mặc định
  const [title,setTitle]=useState('Editor')
  const [prompt, setPrompt] = useState('');

  const [previewCode, setPreviewCode] = useState("");
  // const {wallet}=useAppSelector((state)=>state.wallet)

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(
    () => ({
      codeNode: CodeNode,
      customDefault: CustomDefaultNode,
    }),
    []
  );
  const handleSend = () => {
    if (prompt.trim()) {
      const newNode = {
        id: `0`,
        type: "default",
        position: { x: -200, y: 200 }, 
        data: { label:prompt } 
      };
  
      setNodes((nds) => [...nds, newNode]); 
      setNodeId((id) => id + 1);
      setPrompt(''); // Clear textarea after sending
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents newline insertion
      handleSend();
    }
  };
  // Hàm thêm node mới
  const addNewNode = () => {
    
    const newNode = {
      id: `${nodeId}`,
      type: "codeNode",
      position: { x: Math.random() * 400, y: Math.random() * 400 }, // Vị trí ngẫu nhiên
      data: { code: code, fileName: fileName }, // Sử dụng code và fileName từ Monaco Editor
    };

    setNodes((nds) => [...nds, newNode]);
    //  { id: 'e4-1', source: '0', target: 'nodeId', markerEnd: { type: MarkerType.Arrow } },
    const newEdge = {
      id: `e-${0}-${nodeId}`,
      source: `${0}`,
      target: `${nodeId}`,
      markerEnd: { type: MarkerType.Arrow }, // Mũi tên cho edge
    };
    setEdges((eds) => addEdge(newEdge, eds));
    setNodeId((id) => id + 1);
    // reactFlowInstance.setViewport({ x: -100, y: -100, zoom: 0.7 }); // Zoom out để nhìn tổng thể

  };
  const handlePreview = () => {
    setPreviewCode(code); // Cập nhật code từ editor để preview
    console.log(code)
  };
  const onNodeClick = (event, node) => {
    setTitle(node.id)
    setCode(node.data.code)
  };
  return (
    <div className="flex h-screen">
      {/* Editor Column */}
      <div className="flex-1 p-4 border-r border-gray-300 flex flex-col">
        <span className="text-xl  mb-2">{title}</span>
        <Editor
          height="40vh"
          language="javascript"
          value={code}
          onChange={(value) => setCode(value)} // Cập nhật code từ Monaco Editor
        />
        <div>
          <button
            onClick={addNewNode}
            className="mt-4 mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Node
          </button>
          <button
            onClick={addNewNode}
            className="mt-4 mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={handlePreview}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-600"
          >
            Preview
          </button>
        </div>

        <div className="flex-1 border border-solid ">
          <Widget
            key={`1232133`}
            // config={widgetConfig}
            code={previewCode}

            // props={parsedWidgetProps}
          />
        </div>
      </div>

      {/* React Flow Column */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="w-full">
          <textarea
            className="w-full outline-none"
            id=""
            value={prompt}
            rows={3}
            placeholder="Input your prompt, ex: Create home component"
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown} // Listen for Enter key
          />
        </div>

        <div className="border rounded p-4 h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
