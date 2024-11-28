class State {
  constructor() {
    this.conversationHistory = [];
    this.isInConversation = false;
  }

  setConversationState(value) {
    this.isInConversation = value;
    window.isInConversation = value;
  }
}

export const state = new State();