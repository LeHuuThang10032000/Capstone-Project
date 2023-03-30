import React, {useState} from 'react';
import {Switch} from 'react-native-switch';

interface SwitchButtonProps {
  label1: string;
  label2: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const SwitchButtonSmall: React.FC<SwitchButtonProps> = ({
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
        circleSize={20}
        barHeight={20}
        circleBorderWidth={0}
        backgroundActive={'#B5EAD8'}
        backgroundInactive={'gray'}
        circleActiveColor={'white'}
        circleInActiveColor={'white'}
        switchWidthMultiplier={3}
      />
    </>
  );
};

export default SwitchButtonSmall;
