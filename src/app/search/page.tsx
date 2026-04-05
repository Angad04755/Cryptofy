import dynamic from "next/dynamic";
import { Suspense } from "react";

const SearchPage = dynamic(() => import("../../components/search/SearchPage"));

function Search () {
    
    return (
    <Suspense>
        <Suspense>
        <SearchPage/>
        </Suspense>
    </Suspense>
    )
}
export default Search;