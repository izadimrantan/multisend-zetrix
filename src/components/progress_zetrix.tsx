import { CheckIcon } from "@heroicons/react/24/solid";

export default function Progress(props: any) {
    // Progress stages
    const progressList = [
        { id: 1, title: "Prepare" },
        { id: 2, title: "Send" },
    ];

    return (
        <div className={`${props.className} grid grid-cols-2`}>
            {/* Loop each list */}
            {progressList.map((item) => {
                return (
                    <div key={item.id} className={`p-2 lg:p-4 flex items-center bg-foreground border  space-x-2 lg:space-x-4
                    ${props.stage == item.id && "bg-gradient-to-b from-button_primary_gradient_1 to-button_primary_gradient_2"}
                    ${props.stage > item.id ? "border-primary_red" : "border-white/10"}
                    ${item.id == 1 && "rounded-l-xl"} ${item.id == 2 && "rounded-r-xl"}`}>
                        <div className="flex h-6 w-6 lg:h-8 lg:w-8 items-center justify-center rounded-full border border-white/20 text-sm lg:text-base">{props.stage > item.id ? <CheckIcon className="w-4 h-4" /> : item.id}</div>
                        <div className="text-sm lg:text-base">{item.title}</div>
                    </div>
                )
            })}
        </div>
    )
}