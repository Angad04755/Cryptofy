import dynamic from "next/dynamic";
import { Suspense } from "react";

const HoldingTable = dynamic(() => import("../../../components/prices/HoldingTable"));

function Prices() {
return (
    <>
    <Suspense>
            <HoldingTable/>
    </Suspense>
    </>
)
}

export default Prices;