import dynamic from "next/dynamic";
import { Suspense } from "react";

const SearchPage = dynamic(() => import("../../../components/search/SearchPage"));

export const Dynamic = "force-dynamic";

function Search () {
    <Suspense>
        <Suspense>
        <SearchPage/>
        </Suspense>
    </Suspense>
}
export default Search;