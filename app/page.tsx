"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import { CodeNode } from "./components/CodeNode";
import { CustomDefaultNode } from "./components/CustomDefaultNode";
import { Editor } from "@monaco-editor/react";
//@ts-ignore
import { Widget, CommitButton } from "esm-near-social-vm";
import "@xyflow/react/dist/style.css";
import Tabs from './components/Tabs/Tabs';
import { FaCodepen } from "react-icons/fa";
import { GrDeploy } from "react-icons/gr";
import PreviewNode from "./components/PreviewNode";
import Chat from "./components/Chat/Chat";
import { FaMessage } from "react-icons/fa6";
import { FlowProvider, useFlow } from "./context/FlowProvider";
import { MessageProvider } from "./context/MessageProvider";
import { useWallet } from "./context/Web3Provider";
import dynamic from 'next/dynamic'
import CustomEdge from "./components/CustomEdge";

// Dynamically import ClientDB with ssr disabled
const ClientDB = dynamic(() => import('./components/ClientDB'), {
  ssr: false
})

const tabItems = [
  {
    id: "1",
    icon: FaMessage,
    label: "Chat",
  },
  {
    id: "2",
    icon: FaCodepen,
    label: "Editor",
  },
 
];

function AppContent() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNewNode,
    setNodeCode,
    onNodeClick,
    updateReviewNode,
    selectedNode,
  } = useFlow();
  const { near } = useWallet();
  const [code, setCode] = useState("// Write your code here");
  const [fileName, setFileName] = useState("newFile.tsx");
  const [title, setTitle] = useState("Editor");
  const [activeTab, setActiveTab] = useState("1");
  const [previewCode, setPreviewCode] = useState("");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };
  useEffect(() => {
    setCode(selectedNode?.data.code!.toString());
  }, [selectedNode]);
  // useEffect(() => {
  //   if (socket) {
  //     socket.on("NewMessage", (data) => {
  //       // dispatch(setMessageList(data))
  //     });
  //   }
  // }, [socket]);

  const nodeTypes = useMemo(
    () => ({
      codeNode: CodeNode,
      customDefault: CustomDefaultNode,
      previewNode: PreviewNode,
    }),
    []
  );
  const edgeTypes = {
    'custom-edge': CustomEdge,
  };
  const handleAddNewNode = () => {
    // addNewNode(code, fileName);
  };

  const handlePreview = () => {
    // setPreviewCode(code);
    // console.log(code);
    updateReviewNode(
      selectedNode?.id!,
      code,
      selectedNode?.position.x!,
      selectedNode?.position.y!
    );
  };

  // const onNodeClick = (event, node) => {
  //   setTitle(node.id);
  //   setCode(node.data.code);
  // };

  const commitButton = (
    <CommitButton
      className="border-[2px] border-[#0CF25D] border-solid text-[#0CF25D] px-2 py-2 rounded-lg mr-2"
      disabled={false}
      near={near}
      data={{
        widget: {
          // @ts-ignore
          [selectedNode?.data.fileName!]: {
            "":code,
            metadata: {},
          },
        },
      }}
    >
      Publish
    </CommitButton>
  );

  return (
    <div className="flex h-full">
      {/* Editor Column */}
      <div className="flex-1 py-1 px-2  flex flex-col">
        <div className="flex justify-between">
          <Tabs
            items={tabItems}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          {activeTab === "2" && (
            <div className="self-center">
              {commitButton}
              <button
                onClick={handlePreview}
                className="px-2 py-2 bg-[#0cf25dc8] text-white rounded self-center"
              >
                Preview
              </button>
            </div>
          )}
        </div>
        
        {activeTab === "1" && (
          <>

            <Chat />
          
          </>
        )}

        {activeTab === "2" && (
         

          <Editor
            height="90vh"
            className="rounded-lg"
            language="javascript"
            theme="custom-theme"
            value={code}
            onChange={(value) => setCode(value?.toString()??"")}
           beforeMount={(monaco)=>{
            monaco.editor.defineTheme('custom-theme', {
              base: 'vs-dark',
              inherit: true,
              rules: [],
              colors: {
                'editor.background': '#050A19',

              }
            });
           }}
          />
        )}
      
      </div>

      {/* React Flow Column */}
      <div className="flex-1 p-4 flex flex-col bg-[#00030D]">
        <>
          

          <div className=" rounded  h-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}

              onNodeClick={onNodeClick}
              fitView
            >
              <Controls />
              <MiniMap />
              <Background
                variant={BackgroundVariant.Dots}
                bgColor="#00030D"
                color="#0CF25D"
                gap={12}
                size={1}
              />
            </ReactFlow>
          </div>
        </>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FlowProvider>
      <ClientDB/>
      <MessageProvider>
        <AppContent />
      </MessageProvider>
    </FlowProvider>
  );
}
