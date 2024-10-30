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
import { Tabs } from "antd";
import { FaCodepen } from "react-icons/fa";
import { GrDeploy } from "react-icons/gr";
import PreviewNode from "./components/PreviewNode";
import Chat from "./components/Chat/Chat";
import { FlowProvider, useFlow } from "./context/FlowProvider";
import { MessageProvider } from "./context/MessageProvider";
import { useWallet } from "./context/Web3Provider";
import dynamic from 'next/dynamic'

// Dynamically import ClientDB with ssr disabled
const ClientDB = dynamic(() => import('./components/ClientDB'), {
  ssr: false
})

const tabItems = [
  {
    id: "1",
    icon: FaCodepen,
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
      className="btn btn-outline-primary mr-2 self-center"
      disabled={false}
      near={near}
      data={{
        widget: {
          // @ts-ignore
          [selectedNode?.data.fileName!]: {
            "": selectedNode?.data.code,
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
      <div className="flex-1 py-1 px-2 border-r border-gray-300 flex flex-col">
        <div className="flex justify-between">
          <Tabs
            defaultActiveKey="1"
            onChange={handleTabChange}
            items={tabItems.map((tab) => ({
              key: tab.id,
              label: tab.label,
            }))}
          />
          <div className="self-center">
            {/* <button
              onClick={handleAddNewNode}
              className=" mr-4 px-1 py-1 bg-black  text-white rounded hover:bg-blue-600"
            >
              Add
            </button> */}

            {activeTab === "2" && commitButton}
            <button
              onClick={handlePreview}
              className=" px-2 py-2 bg-green-500 text-white rounded hover:bg-blue-600 self-center"
            >
              Preview
            </button>
          </div>
        </div>

        {activeTab === "1" && (
          <>
            {/* <span className="text-xl  mb-2">{title}</span> */}

            <Chat />
            {/* <div className="flex-1 border border-solid ">
              <Widget
                key={`1232133`}
                // config={widgetConfig}
                code={previewCode}

                // props={parsedWidgetProps}
              />
            </div> */}
          </>
        )}

        {activeTab === "2" && (
          // <>
          //    {/* <Widget
          //     src={"eugenethedream/widget/WidgetMetadataEditor"}
          //     key={`metadata-editor`}
          //     // props={useMemo(
          //     //   () => ({
          //     //     widgetPath,
          //     //     onChange: setMetadata,
          //     //   }),
          //     //   [widgetPath]
          //     // )}
          //   />  */}
          //   {/* <div>{commitButton}</div> */}
          // </>

          <Editor
            height="90vh"
            language="javascript"
            value={code}
            onChange={(value) => setCode(value?.toString()??"")}
          />
        )}
      
      </div>

      {/* React Flow Column */}
      <div className="flex-1 p-4 flex flex-col">
        <>
          {/* <div className="w-full">
              <textarea
                className="w-full outline-none"
                id=""
                value={prompt}
                rows={3}
                placeholder="Input your prompt, ex: Create home component"
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown} // Listen for Enter key
              />
            </div> */}

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
              <Background
                variant={BackgroundVariant.Lines}
                bgColor="#ccc"
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
