import * as React from "react";

interface SVGProps extends React.SVGProps<SVGSVGElement> {}

const LockIcon: React.FC<SVGProps> = (props) => (
  <svg
    fill="#000000"
    width="800px"
    height="800px"
    viewBox="0 0 36 36"
    preserveAspectRatio="xMidYMid meet"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <title>lock-line</title>
    <path
      className="clr-i-outline clr-i-outline-path-1"
      d="M18.09,20.59A2.41,2.41,0,0,0,17,25.14V28h2V25.23a2.41,2.41,0,0,0-.91-4.64Z"
    />
    <path
      className="clr-i-outline clr-i-outline-path-2"
      d="M26,15V10.72a8.2,8.2,0,0,0-8-8.36,8.2,8.2,0,0,0-8,8.36V15H7V32a2,2,0,0,0,2,2H27a2,2,0,0,0,2-2V15ZM12,10.72a6.2,6.2,0,0,1,6-6.36,6.2,6.2,0,0,1,6,6.36V15H12ZM9,32V17H27V32Z"
    />
    <rect x={0} y={0} width={36} height={36} fillOpacity={0} />
  </svg>
);

export default LockIcon;
