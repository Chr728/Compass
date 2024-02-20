import {FC} from "react";
import fetchLocations from "@/app/http/fetchLocations";

interface pageProps {
    params: {
        clinicType: string
    }
}

const ClinicLocations: FC<pageProps> = ({ params }) => {

    return <div>

    </div>;
}

export default ClinicLocations;
