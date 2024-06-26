import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './Components/CustomNode/CustomNode';

import Sidebar from './Components/Sidebar';
import './index.css';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input node' },
    position: { x: 100, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const App = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const newNode = {
        id: getId(),
        type: 'custom', 
        position,
        data: { label: `${type} node`, type },
      };

      setNodes((nds) => nds.concat(newNode)); 
    },
    [reactFlowInstance],
  );

  const { getNodes, getEdges } = useReactFlow();

  // Connection validation
  const isValidConnection = useCallback( 
    (connection) => {
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find((node) => node.id === connection.target);

      // Prevent multiple source connections
      const existingEdges = edges.filter(
        (edge) => edge.source === connection.source && edge.sourceHandle === connection.sourceHandle
      );
  
      if (existingEdges.length >= 1) return false;

      // Prevent circular connection within one node
      if (target.id === connection.source) return false;
      
      return true;
    },
    [getNodes, getEdges],
  );

  return (
    <div className="dndflow" >
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ width: '100vw', height: '100vh' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            isValidConnection={isValidConnection}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar /> 
    </div>
  );
};

export default App;
