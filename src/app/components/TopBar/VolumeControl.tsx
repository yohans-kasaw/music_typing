import { FC } from "react";
import Volume2Icon from "../../svgs/Volume2Icon";

export const VolumeControl: FC = () => {
  return (
    <div className="flex items-center">
      <Volume2Icon className="w-6 h-6 mr-2" />
      <span>Volume</span>
    </div>
  );
};
