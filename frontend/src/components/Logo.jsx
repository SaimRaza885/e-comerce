import React from 'react'
import { Link } from 'react-router-dom'

const Logo = ({size=24}) => {
    return (
        <Link to={"/"}>
            <h1 style={{ fontSize: `${size}px` }} className="font-bold text-accent">Gilgit Dry Fruits</h1>
        </Link>
    )
}

export default Logo