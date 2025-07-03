import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { usePipelineStore } from '../stores/pipelineStore';

interface ConnectionValidatorProps {
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
}

export const ConnectionValidator: React.FC<ConnectionValidatorProps> = ({
  sourceNodeId,
  sourcePortId,
  targetNodeId,
  targetPortId
}) => {
  const { pipeline, validateConnection } = usePipelineStore();
  
  const sourceNode = pipeline.nodes.find(n => n.id === sourceNodeId);
  const targetNode = pipeline.nodes.find(n => n.id === targetNodeId);
  
  if (!sourceNode || !targetNode) return null;
  
  const sourcePort = sourceNode.nodeSpec.outputs.find(p => p.id === sourcePortId);
  const targetPort = targetNode.nodeSpec.inputs.find(p => p.id === targetPortId);
  
  if (!sourcePort || !targetPort) return null;
  
  const isValid = validateConnection(sourceNodeId, sourcePortId, targetNodeId, targetPortId);
  
  // Check MIME type compatibility
  const hasCompatibleMime = sourcePort.mimeTypes.some(sourceMime =>
    targetPort.mimeTypes.some(targetMime =>
      sourceMime === targetMime || 
      sourceMime === '*/*' || 
      targetMime === '*/*' ||
      sourceMime.split('/')[0] === targetMime.split('/')[0]
    )
  );
  
  const getValidationMessage = () => {
    if (!hasCompatibleMime) {
      return {
        type: 'error' as const,
        message: `Incompatible formats: ${sourcePort.mimeTypes.join(', ')} → ${targetPort.mimeTypes.join(', ')}`
      };
    }
    
    if (!isValid) {
      return {
        type: 'error' as const,
        message: 'This connection would create a cycle in the pipeline'
      };
    }
    
    return {
      type: 'success' as const,
      message: 'Valid connection'
    };
  };
  
  const validation = getValidationMessage();
  
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle
  };
  
  const colors = {
    success: 'text-green-600 bg-green-50 border-green-200',
    error: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200'
  };
  
  const IconComponent = icons[validation.type];
  
  return (
    <div className={`absolute z-50 p-3 rounded-lg border shadow-lg ${colors[validation.type]} max-w-xs`}>
      <div className="flex items-start gap-2">
        <IconComponent className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="text-sm font-medium">{validation.message}</div>
      </div>
    </div>
  );
};