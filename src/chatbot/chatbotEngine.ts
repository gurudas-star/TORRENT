import { useState } from 'react';
import { FlowNodeId, ChatMessageItem, OptionChip } from './types';
import { FLOW_CONFIG } from './flowConfig';

export interface ChatEngineState {
  currentFlowId: FlowNodeId;
  messages: ChatMessageItem[];
  context: Record<string, any>;
  history: FlowNodeId[];
  isTyping: boolean;
}

export function useChatbotEngine() {
  const [state, setState] = useState<ChatEngineState>(() => {
    const initialConfig = FLOW_CONFIG.main_menu;
    const initialMessageText = typeof initialConfig.message === 'function' ? initialConfig.message({}) : initialConfig.message;
    const initialOptions = typeof initialConfig.options === 'function' ? initialConfig.options({}) : initialConfig.options;

    return {
      currentFlowId: 'main_menu',
      messages: [
        {
          id: 'msg-init-1',
          sender: 'ann',
          text: initialMessageText,
          options: initialOptions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      context: {},
      history: ['main_menu'],
      isTyping: false
    };
  });

  const navigateToFlow = (nextFlowId: FlowNodeId, payload?: any, userLabel?: string) => {
    setState((prev) => {
      const updatedContext = { ...prev.context, ...(payload || {}) };
      const newHistory = [...prev.history, nextFlowId];

      const newMessages: ChatMessageItem[] = [...prev.messages];

      if (userLabel) {
        newMessages.push({
          id: `user-${Date.now()}`,
          sender: 'user',
          text: userLabel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      const targetConfig = FLOW_CONFIG[nextFlowId];
      if (!targetConfig) {
        return prev;
      }

      const messageText = typeof targetConfig.message === 'function' ? targetConfig.message(updatedContext) : targetConfig.message;
      const optionsList = typeof targetConfig.options === 'function' ? targetConfig.options(updatedContext) : targetConfig.options;

      const annMsg: ChatMessageItem = {
        id: `ann-${Date.now()}`,
        sender: 'ann',
        text: messageText,
        options: optionsList,
        requiresInput: targetConfig.requiresInput,
        inputType: targetConfig.inputType,
        placeholder: targetConfig.inputPlaceholder,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      return {
        ...prev,
        currentFlowId: nextFlowId,
        messages: [...newMessages, annMsg],
        context: updatedContext,
        history: newHistory,
        isTyping: false
      };
    });
  };

  const handleOptionClick = (option: OptionChip) => {
    if (option.payload) {
      if (option.payload.cat) {
        state.context.complaintCategory = option.payload.cat;
      }
      if (option.payload.type) {
        state.context.connType = option.payload.type;
      }
      if (option.payload.pincode) {
        state.context.pincode = option.payload.pincode;
      }
      if (option.payload.customerNumber) {
        state.context.customerNumber = option.payload.customerNumber;
      }
    }
    navigateToFlow(option.nextFlowId, option.payload, option.label);
  };

  const handleInputSubmit = (inputText: string) => {
    if (!inputText.trim()) return;

    const currentConfig = FLOW_CONFIG[state.currentFlowId];
    let nextId: FlowNodeId = 'main_menu';
    let contextUpdates = {};

    if (currentConfig && currentConfig.processInput) {
      const res = currentConfig.processInput(inputText, state.context);
      nextId = res.nextFlowId;
      if (res.contextUpdates) {
        contextUpdates = res.contextUpdates;
      }
    }

    navigateToFlow(nextId, contextUpdates, inputText);
  };

  const handleBack = () => {
    if (state.history.length <= 1) return;
    const newHistory = [...state.history];
    newHistory.pop(); // remove current
    const prevFlowId = newHistory[newHistory.length - 1] || 'main_menu';

    const targetConfig = FLOW_CONFIG[prevFlowId];
    const messageText = typeof targetConfig.message === 'function' ? targetConfig.message(state.context) : targetConfig.message;
    const optionsList = typeof targetConfig.options === 'function' ? targetConfig.options(state.context) : targetConfig.options;

    setState((prev) => ({
      ...prev,
      currentFlowId: prevFlowId,
      history: newHistory,
      messages: [
        ...prev.messages,
        {
          id: `ann-back-${Date.now()}`,
          sender: 'ann',
          text: `↩ Returned to previous menu.\n${messageText}`,
          options: optionsList,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }));
  };

  const restartConversation = () => {
    const initialConfig = FLOW_CONFIG.main_menu;
    const initialMessageText = typeof initialConfig.message === 'function' ? initialConfig.message({}) : initialConfig.message;
    const initialOptions = typeof initialConfig.options === 'function' ? initialConfig.options({}) : initialConfig.options;

    setState({
      currentFlowId: 'main_menu',
      messages: [
        {
          id: `msg-reset-${Date.now()}`,
          sender: 'ann',
          text: initialMessageText,
          options: initialOptions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      context: {},
      history: ['main_menu'],
      isTyping: false
    });
  };

  return {
    state,
    handleOptionClick,
    handleInputSubmit,
    handleBack,
    restartConversation,
    navigateToFlow
  };
}
