type inputtype = {
    ref?: any
    placeholder?: string
}

export function Input({ref, placeholder}: inputtype){
    return (
        <div>
         <input type="text"placeholder={placeholder} className="px-4 py-2" ref={ref} />
        </div>
    )
}