import dynamic from "next/dynamic";
import { Suspense } from "react";

const HoldingTable = dynamic(() => import("../../../components/prices/HoldingTable"));
const MobileHoldingTable = dynamic(() => import("../../../components/prices/MobileHoldingTable"));

function Prices() {
return (
    <>
    <div className="hidden md:block">
        <Suspense>
            <HoldingTable/>
        </Suspense>
    </div>

    <div className="block md:hidden">
      <Suspense>
        <MobileHoldingTable/>
      </Suspense>
    </div>
    </>
)
}

export default Prices;