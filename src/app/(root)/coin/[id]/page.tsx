import PriceDetails from "@/src/components/prices/priceDetails";

interface props {
    params: Promise<{id: string}>
}
const Page = async ({params}: props) => {
    const {id} = await params
    return (
        <PriceDetails id={id}/>
    )
}
export default Page;