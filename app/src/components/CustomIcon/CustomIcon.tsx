import React from "react";
import VectorIcon from "react-native-vector-icons/MaterialIcons";

type IconProps = {
  name: string;
  size: number;
  color?: string;
  padding?: [number, number, number, number];
  rotate?: number;
};

function Icon({
  name,
  size,
  color,
  padding = [5, 5, 5, 5],
  rotate = 0,
}: IconProps) {
  return (
    <VectorIcon
      name={name}
      size={size}
      color={color}
      style={{
        paddingTop: padding[0],
        paddingRight: padding[1],
        paddingBottom: padding[2],
        paddingLeft: padding[3],
        transform: [{ rotate: `${rotate}deg` }],
      }}
    />
  );
}

export default Icon;
