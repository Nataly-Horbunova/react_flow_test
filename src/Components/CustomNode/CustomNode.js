import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './CustomNode.css';

const CustomNode = ({ data, isConnectable }) => {

  const { type, label } = data;

    return (
        <div className='custom-node'>
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} id='target_handle_1'/>
            { type === 'default' && ( 
              <>
                <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} id='source_handle_1' style={{ left: 50 }} />
                <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} id='source_handle_2' style={{ left: 100 }}/>
              </>
            )}
            <div>{ label }</div>
        </div>
    );
};

export default memo(CustomNode);
