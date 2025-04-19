const NoTeamsBg = ({size = 480} : {size? : number}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 480 480"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_242_6630"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width={size}
        height={size}
      >
        <rect width={size} height={size} fill="url(#paint0_radial_242_6630)" />
      </mask>
      <g mask="url(#mask0_242_6630)">
        <circle cx="240" cy="240" r="47.5" stroke="#EAECF0" />
        <circle opacity="0.8" cx="240" cy="240" r="79.5" stroke="#D0D5DD" />
        <circle opacity="0.5" cx="240" cy="240" r="111.5" stroke="#D0D5DD" />
        <circle cx="240" cy="240" r="143.5" stroke="#EAECF0" />
        <circle opacity="0.4" cx="240" cy="240" r="143.5" stroke="#D0D5DD" />
        <circle opacity="0.3" cx="240" cy="240" r="175.5" stroke="#D0D5DD" />
        <circle cx="240" cy="240" r="207.5" stroke="#EAECF0" />
        <circle cx="240" cy="240" r="239.5" stroke="#EAECF0" />
        
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_242_6630"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(240 240) rotate(90) scale(240 240)"
        >
          <stop />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default NoTeamsBg;
