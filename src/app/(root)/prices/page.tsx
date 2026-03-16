import dynamic from "next/dynamic";
import { Suspense } from "react";

const HoldingTable = dynamic(() => import("../../../components/prices/HoldingTable"));
const MobileHoldingTable = dynamic(() => import("../../../components/prices/MobileHoldingTable"));

function Prices() {
return (
    <>
    <Suspense>
    <div className="hidden md:block">
            <HoldingTable/>
    </div>

    <div className="block md:hidden">
        <MobileHoldingTable/>
    </div>
    </Suspense>
    </>
)
}

export default Prices;