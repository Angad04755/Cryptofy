import HoldingTable from "@/src/components/prices/HoldingTable";
import MobileHoldingTable from "@/src/components/prices/MobileHoldingTable";
const Prices = () => {
    return (
        <>
        <div className="hidden md:block">
        <HoldingTable/>
        </div>
        <div className="block md:hidden">
            <MobileHoldingTable/>
        </div>
        </>
    )
}
export default Prices;