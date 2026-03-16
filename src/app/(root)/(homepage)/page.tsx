import { Suspense } from "react";
import Hero from "../../../components/home/Hero";
const Homepage = () => {
    return (
        <>
        <Suspense>
            <Hero />
        </Suspense>
        </>
    )
}
export default Homepage;