import React, {createContext, useState} from 'react';

interface AppState {
  count: number;
  value: boolean;
}

interface MyComponentProps {
  children: React.ReactNode;
}

interface AppContextProps {
  state: AppState;
  incrementCount: () => void;
  handleSwitchValueChange: () => void;
}

const initialAppState: AppState = {
  count: 0,
  value: false,
};

export const AppContext = createContext<AppContextProps>({
  state: initialAppState,
  incrementCount: () => {},
  handleSwitchValueChange: () => {},
});

export const AppProvider: React.FC<MyComponentProps> = ({children}) => {
  // Define your state and functions here
  const [state, setState] = useState<AppState>(initialAppState);

  const incrementCount = () => {
    setState({...state, count: state.count + 1});
  };

  const handleSwitchValueChange = () => {
    setState({...state, value: !state.value});
  };

  // Pass the state and functions to the context provider
  return (
    <AppContext.Provider
      value={{state, incrementCount, handleSwitchValueChange}}>
      {children}
    </AppContext.Provider>
  );
};
