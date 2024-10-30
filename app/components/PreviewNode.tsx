import React, { ReactNode } from 'react';
import { Handle, Position } from '@xyflow/react';

interface PreviewNodeProps {
    data:{
        component: ReactNode;

    }
}

export function PreviewNode({ data }: PreviewNodeProps) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div style={{
        borderRadius: '8px',
        // backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '10px',
        // width: '100%',
        display: 'inline-block',
        // maxWidth: '1000px', // Giới hạn chiều rộng tối đa
        // maxHeight: '200px', // Giới hạn chiều cao tối đa
        overflow: 'auto', // Thêm thanh cuộn khi nội dung vượt quá kích thước
        position: 'relative',
        zIndex: 1000,
        // height: '100%',
        // height:"1000px",
        // width:"2000px",

        backgroundColor:"gray"
      }}>
        
          {data.component || <p>No component to preview</p>}
        </div>
      
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default PreviewNode;
