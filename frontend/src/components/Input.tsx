interface inputProps {
    heading: string,
    placeholder: string,
    type: string ,
    onChange : (val : string )=> void 
}

export default function Input({ heading, placeholder, type , onChange}: inputProps) {
    return <div className=" flex flex-col gap-2 pt-2 w-full">
        <div className="text-xl font-semibold ">{heading} </div>
        <input
        onChange={(e)=>{
            onChange(e.target.value)
        }}
        className="p-2 rounded-md border-2 w-full border-gray-200 focus:border-white focus:ring-2 focus:ring-blue-400" type={type} placeholder={placeholder} />
    </div>
}