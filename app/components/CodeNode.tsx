"use client";

import { Handle, Position } from '@xyflow/react';
// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-ignore
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState } from 'react';
// @ts-ignore
import { Widget } from 'esm-near-social-vm';

const handleStyle = { left: 10 };
interface ICodeNodeProps {
  data: {
    code: string;
    fileName: string;
  };
}
export function CodeNode({ data }: ICodeNodeProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.code)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="code-node">
        <div className="file-name text-white">{data.fileName}</div>
        <button 
          onClick={copyToClipboard}
          className="copy-button"
          title={copySuccess ? 'Copied!' : 'Copy to clipboard'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="copy-icon">
            <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
            <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25zM4.875 6H6v10.125A3.375 3.375 0 009.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V7.875C3 6.839 3.84 6 4.875 6z" />
          </svg>
        </button>
        <SyntaxHighlighter
          language="javascript"
          style={vscDarkPlus}
          customStyle={{ margin: 0, borderRadius: '5px', paddingTop: '30px' }}
        >
          {data.code}
        
        </SyntaxHighlighter>
        {/* <Widget
          key={Date.now()}
          code={data.code}
        /> */}
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </>
  );
}