import { ReactNode } from 'react';

export type FlowNodeId = string;

export interface OptionChip {
  id: string;
  label: string;
  nextFlowId: FlowNodeId;
  payload?: any;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
}

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'ann';
  text?: string;
  customCard?: ReactNode;
  options?: OptionChip[];
  timestamp: string;
  requiresInput?: boolean;
  inputType?: 'customerNumber' | 'mobileNumber' | 'text' | 'pincode';
  placeholder?: string;
  onSubmitInput?: (val: string) => void;
}

export interface FlowStepConfig {
  id: FlowNodeId;
  message: string | ((context: any) => string);
  options?: OptionChip[] | ((context: any) => OptionChip[]);
  requiresInput?: boolean;
  inputPlaceholder?: string;
  inputType?: 'customerNumber' | 'mobileNumber' | 'text' | 'pincode';
  processInput?: (val: string, context: any) => { nextFlowId: FlowNodeId; error?: string; contextUpdates?: any };
  customRender?: (context: any, engineCallbacks: any) => ReactNode;
}
