import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { NodeLibrary } from './components/NodeLibrary';
import { PipelineCanvas } from './components/PipelineCanvas';
import { ToolBar } from './components/ToolBar';
import { FileUpload } from './components/FileUpload';
import { CommandPalette } from './components/CommandPalette';
import { HotKeys } from './components/HotKeys';
import { StatusBar } from './components/StatusBar';

function App() {
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Global Hotkeys */}
      <HotKeys onOpenCommandPalette={() => setShowCommandPalette(true)} />
      
      {/* Toolbar */}
      <ToolBar />
      
      {/* File Upload Area */}
      <FileUpload />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Node Library Sidebar */}
        <NodeLibrary />
        
        {/* Pipeline Canvas */}
        <PipelineCanvas />
      </div>

      {/* Status Bar */}
      <StatusBar />

      {/* Command Palette */}
      <CommandPalette 
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />

      {/* Toast Notifications */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'white',
            border: '1px solid #E5E7EB',
            color: '#374151'
          }
        }}
      />
    </div>
  );
}

export default App;