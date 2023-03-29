import React, {useState} from 'react';
import {Switch} from 'react-native-switch';

interface SwitchButtonProps {
  label1: string;
  label2: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({
  label1,
  label2,
  value,
  onValueChange,
}) => {
  const [isEnabled, setIsEnabled] = useState(value);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    onValueChange(!isEnabled);
  };

  return (
    <>
      <Switch
        value={isEnabled}
        onValueChange={toggleSwitch}
        activeText={label1}
        inActiveText={label2}
        circleSize={30}
        barHeight={30}
        circleBorderWidth={0}
        backgroundActive={'#B5EAD8'}
        backgroundInactive={'gray'}
        circleActiveColor={'white'}
        circleInActiveColor={'white'}
        switchWidthMultiplier={2.8}
      />
    </>
  );
};

export default SwitchButton;
