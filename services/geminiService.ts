import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This will be caught by the app's error handling.
  // In a production environment, this should ideally not happen.
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const exampleBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Process Started">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:task id="Task_1" name="Initial Task">
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
    </bpmn:task>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1" />
    <bpmn:endEvent id="EndEvent_1" name="Process Ended">
      <bpmn:incoming>Flow_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="179" y="117" />
        <di:waypoint x="229" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="329" y="117" />
        <di:waypoint x="379" y="117" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="143" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="127" y="142" width="68" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
        <dc:Bounds x="229" y="77" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="379" y="99" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="366" y="142" width="63" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

export const generateBPMNXml = async (description: string): Promise<string> => {
    const prompt = `
You are an expert in Business Process Model and Notation (BPMN) 2.0.
Your task is to convert a user's natural language description of a process into a valid BPMN 2.0 XML file.

RULES:
- The output MUST be only the raw XML content.
- Do NOT include any explanations, introductions, or markdown formatting like \`\`\`xml or \`\`\`.
- The XML must be well-formed and valid according to the BPMN 2.0 specification.
- You MUST include a <bpmndi:BPMNDiagram> section with <bpmndi:BPMNPlane>, <bpmndi:BPMNShape>, and <bpmndi:BPMNEdge> elements for the visual representation. This is critical for rendering.
- Ensure all elements have unique IDs.
- Ensure all sequence flows connect a 'sourceRef' to a 'targetRef'.
- Use standard BPMN elements: startEvent, endEvent, task, userTask, serviceTask, exclusiveGateway, parallelGateway, etc.
- Generate logical coordinates (x, y, width, height) for all shapes and waypoints for all edges to create a clean, readable, left-to-right layout.

Here is an example of a simple process for reference:
${exampleBpmnXml}

Now, based on the following user description, generate the complete BPMN 2.0 XML:

USER DESCRIPTION: "${description}"
`;

    try {
        // Use gemini-3-pro-preview for complex code generation tasks like BPMN XML.
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
        });
        
        const rawXml = response.text || "";
        
        // Robust cleaning: Find the XML block regardless of surrounding text
        // Looks for <?xml ... ?> or <bpmn:definitions ... > until the closing tag
        const xmlMatch = rawXml.match(/(<\?xml[\s\S]*?<\/bpmn:definitions>)|(<bpmn:definitions[\s\S]*?<\/bpmn:definitions>)/);
        
        if (xmlMatch) {
            return xmlMatch[0];
        }

        // Fallback cleanup if strict matching fails but content is present
        return rawXml.replace(/```xml/g, '').replace(/```/g, '').trim();

    } catch (error) {
        console.error("Error generating BPMN XML from Gemini:", error);
        throw new Error("Failed to generate diagram. Please try again.");
    }
};