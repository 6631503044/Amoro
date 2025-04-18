import * as React from "react";
import Svg, { Path } from "react-native-svg";
const HeartIcon = (props) => (
  <Svg
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="800px"
    height="800px"
    viewBox="0 0 64 64"
    enableBackground="new 0 0 64 64"
    xmlSpace="preserve"
    {...props}
  >
    <Path
      fill="none"
      stroke="#000000"
      strokeWidth={2}
      strokeMiterlimit={10}
      d="M1,21c0,20,31,38,31,38s31-18,31-38 c0-8.285-6-16-15-16c-8.285,0-16,5.715-16,14c0-8.285-7.715-14-16-14C7,5,1,12.715,1,21z"
    />
  </Svg>
);
export default HeartIcon;
