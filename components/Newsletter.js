"use client"

import { on } from "events";
import { useState } from "react";

export default function Newsletter(){

const [email, setEmail] = useState("")

const onSubmit = async (e) => {
    e.preventDefault()
     const response = await fetch("/api/admin/newsletter/subscribe", {
     method: "POST",
     body: JSON.stringify({ email }),
     })
    }

return (
        <section className="flex justify-center items-center py-8 md:py-16 px-4 md:px-6 w-full">
            <div className="w-full max-w-[1750px] mx-auto bg-primary p-4 md:p-5 rounded-xl md:rounded-2xl">
                <div className="w-full max-w-2xl mx-auto bg-primary p-4  text-white text-center space-y-4">
                <div className="flex flex-col xl:flex-row items-center text-center justify-center">   
                <h2 className="text-xl md:text-2xl font-bold font-[Platype] lg:text-[40px] xl:text-[40px]">
  Get Exclusive Genwin Offers
</h2>
                </div> 
                
                <form className="flex flex-col md:flex-row items-center gap-3 md:gap-4" onSubmit={onSubmit}>
                    {/* Email Input */}
                    <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                    className="w-full md:flex-1 px-4 py-2 text-gray-900 rounded-md outline-none"
                    />
                    {/* Subscribe Button */}
                    <button
                    type="submit"
                    className="bg-black text-white font-bold py-2 px-6 rounded-md hover:bg-white hover:text-red-500 transition"
                    >
                    Subscribe
                    </button>
                </form>
                {/* Description */}
                <p className="text-sm mt-4 ">
                Be the first to know about new products & special deals.
                </p>
                </div>  
            </div>
        </section>
    );
}        