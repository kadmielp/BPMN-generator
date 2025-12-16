import React, { useEffect, useRef, useState } from 'react';

// Inform TypeScript about the bpmn-js library on the window object
declare global {
  interface Window {
    BpmnJS: any;
  }
}

interface BPMNViewerProps {
  xml: string;
}

const BPMNViewer: React.FC<BPMNViewerProps> = ({ xml }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (typeof window.BpmnJS === 'undefined') {
      setError('BPMN.js library not loaded. Please check your internet connection and refresh.');
      return;
    }

    // Initialize the viewer
    // We create a new instance every time the XML changes or the component mounts to ensure a clean state
    const viewer = new window.BpmnJS({ 
      container,
      keyboard: {
        bindTo: window
      }
    });

    const renderDiagram = async () => {
      try {
        setError(null);
        await viewer.importXML(xml);
        const canvas = viewer.get('canvas');
        canvas.zoom('fit-viewport');
      } catch (err: any) {
        console.error('Error importing BPMN XML:', err);
        setError(`Failed to render BPMN diagram. The generated XML might be invalid. Error: ${err.message}`);
      }
    };

    if (xml) {
      renderDiagram();
    }

    // Cleanup function to destroy the viewer instance when the component unmounts or XML changes
    return () => {
      viewer.destroy();
    };
  }, [xml]);

  return (
    <div className="relative w-full h-full bg-white rounded-lg shadow-inner overflow-hidden border-4 border-gray-700">
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10">
          <strong className="font-bold">Render Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default BPMNViewer;