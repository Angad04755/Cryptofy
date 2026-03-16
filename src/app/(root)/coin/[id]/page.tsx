import { Suspense } from "react";
import dynamic from "next/dynamic";

const PriceDetails = dynamic(() => import("@/src/components/prices/priceDetails"))
const Page =  () => {
    return (
        <Suspense>
        <Suspense>
        <PriceDetails/>
        </Suspense>
        </Suspense>
    )
}
export default Page;