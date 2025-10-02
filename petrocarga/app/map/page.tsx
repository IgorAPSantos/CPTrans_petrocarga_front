import Map from "@/components/map/map"

export default function Page(){
    return(
        <main className="container mx-auto flex items-center">

        <div className="w-[640px] h-[300px]">
            <Map/>
        </div>
        <div className="bg-amber-300">
            <h1>lista</h1>
        </div>


        </main>
    )
}