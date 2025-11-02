import React from 'react'

const Animated_Borders = () => {
    return (
        <>
            <span className="absolute right-0 top-0 w-[3px] h-full bg-green-500 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-700"></span>
            <span className="absolute left-0 top-0 w-[3px] h-full bg-yellow-500 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700"></span>
            <span className="absolute left-0 top-0 h-[3px] w-full bg-yellow-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
            <span className="absolute left-0 bottom-0 h-[3px] w-full bg-green-500 transform translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
        </>
    )
}

export default Animated_Borders