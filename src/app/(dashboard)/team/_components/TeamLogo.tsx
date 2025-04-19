import Image from "next/image";


const TeamLogo = ({src} : {src : string}) => {
    return <Image width={34} height={36} src={src} alt="team-logo" />
}

export default TeamLogo