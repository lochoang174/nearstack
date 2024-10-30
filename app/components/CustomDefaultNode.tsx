import { Handle, Position } from "@xyflow/react";
interface ICustomDefaultNodeProps {
  data: {
    label: string;
  };
}
export const CustomDefaultNode = ({ data }: ICustomDefaultNodeProps) => {
  console.log("data",data);

    return (
      <>
        <Handle type="target" position={Position.Top} />
        <div style={{
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
        }}>
          <span style={{ 
            color: '#495057', 
            fontWeight: 'bold',
            marginBottom: '4px',
          }}>
            Prompt: {" "}
          </span>
          <span style={{ color: '#212529' }}>{data.label}</span>
        </div>
        <Handle type="source" position={Position.Bottom} />
      </>
    );
  };