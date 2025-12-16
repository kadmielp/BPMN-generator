
import React, { useState, useCallback } from 'react';
import { generateBPMNXml } from './services/geminiService';
import BPMNViewer from './components/BPMNViewer';

// Default XML content to display on initial load, showing how to use the app.
const initialBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_0g9w7b4" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Process starts">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Activity_1" name="Describe a process in the text area">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Activity_1" />
    <bpmn:task id="Activity_2" name="Click 'Generate'">
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Activity_1" targetRef="Activity_2" />
    <bpmn:endEvent id="EndEvent_1" name="Diagram is generated">
      <bpmn:incoming>Flow_3</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Activity_2" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="159" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="166" y="202" width="63" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_19y625y_di" bpmnElement="Activity_1">
        <dc:Bounds x="270" y="137" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_1r693xl_di" bpmnElement="Activity_2">
        <dc:Bounds x="430" y="137" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1j5g72r_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="592" y="159" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="571" y="202" width="78" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_15l6p50_di" bpmnElement="Flow_1">
        <di:waypoint x="215" y="177" />
        <di:waypoint x="270" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0z0p2y9_di" bpmnElement="Flow_2">
        <di:waypoint x="370" y="177" />
        <di:waypoint x="430" y="177" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0h63f3q_di" bpmnElement="Flow_3">
        <di:waypoint x="530" y="177" />
        <di:waypoint x="592" y="177" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

const LoadingSpinner: React.FC = () => (
  <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-20 rounded-lg">
    <div className="flex flex-col items-center">
      <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="mt-4 text-lg font-medium text-gray-300">Generating Diagram...</span>
      <span className="mt-2 text-sm text-gray-400">This may take a moment.</span>
    </div>
  </div>
);

const App: React.FC = () => {
    const [description, setDescription] = useState<string>('An online retail process: A customer places an order. The system checks inventory. If items are available, it processes payment and sends a confirmation email. If not, it notifies the customer of a backorder.');
    const [bpmnXml, setBpmnXml] = useState<string>(initialBpmnXml);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!description.trim()) {
            setError('Please enter a process description.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const xml = await generateBPMNXml(description);
            setBpmnXml(xml);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [description]);
    
    return (
        <div className="flex h-screen font-sans bg-gray-900 text-gray-200">
            {/* Control Panel */}
            <div className="w-full md:w-1/3 max-w-md p-6 bg-gray-800 shadow-2xl flex flex-col space-y-6 overflow-y-auto">
                <header>
                    <h1 className="text-3xl font-bold text-cyan-400">BPMN Diagram Generator</h1>
                    <p className="mt-2 text-gray-400">Describe a business process, and let AI visualize it for you.</p>
                </header>
                
                <div className="flex-grow flex flex-col">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Process Description</label>
                    <textarea
                        id="description"
                        className="w-full flex-grow p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 resize-none"
                        placeholder="e.g., A customer submits a loan application..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={10}
                    />
                </div>
                
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                        </>
                    ) : (
                        'Generate Diagram'
                    )}
                </button>

                {error && (
                    <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md">
                        <p><strong className="font-bold">Error:</strong> {error}</p>
                    </div>
                )}
            </div>

            {/* Diagram Viewer */}
            <div className="flex-1 p-6 flex items-center justify-center relative">
                {isLoading && <LoadingSpinner />}
                <BPMNViewer xml={bpmnXml} />
            </div>
        </div>
    );
};

export default App;
