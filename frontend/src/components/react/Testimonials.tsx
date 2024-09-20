import type { TestimonialsProps, Testimonial } from "@/components/react/interfaces";
import LessThan from "@/components/react/icons/LessThan.tsx";
import GreaterThan from "@/components/react/icons/GreaterThan.tsx";
import { useEffect, useState } from "react";

export default function Testimonials({ testimonials, title}: TestimonialsProps){

    const testimoniesPath = 'images/testimonies/'
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showArrowContainer, setShowArrowContainer] = useState(false);
    const [itemsToShow, setItemsToShow] = useState(1);
    const [arrowDimension, setArrowDimension] = useState(18);
    const [processedPeople, setProcessedPeople] = useState<[] | Array<Testimonial>>([]);

    const handleResize = () => {
        if(window.innerWidth >= 1024){
            setItemsToShow(3);
            setArrowDimension(25);
        }else if(window.innerWidth >= 768){
            setItemsToShow(2);
            setArrowDimension(20);
        }else {
            setItemsToShow(1)
            setArrowDimension(18);
        }
    };

    useEffect(() => {
        handleResize();
        // Add the resize event listener when the component mounts
        window.addEventListener('resize', handleResize);
        
        // Cleanup the event listener when the component unmounts
        return () => {
        window.removeEventListener('resize', handleResize);
        };
    }, []); 


    useEffect(() => {
        // Ensure the currentIndex doesn't exceed the number of available testimonials
        if(currentIndex + itemsToShow > testimonials.length){
            setCurrentIndex(Math.max(testimonials.length - itemsToShow, 0))
        }

        // Update the arrow visibility and the processed people list
        if(itemsToShow < testimonials.length){
            setShowArrowContainer(true)
            setProcessedPeople(testimonials.slice(currentIndex, currentIndex + itemsToShow))
        }else{
            setProcessedPeople(testimonials)
            setShowArrowContainer(false)
        }
    }, [itemsToShow, currentIndex]);

    const handleNext = () => {
        if (currentIndex + itemsToShow < testimonials.length) {
          setCurrentIndex(currentIndex + 1);
        }
      };
    
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return(
        <section className="w-full flex mb-6 flex-col items-center relative">
            <h1
                className="text-brand-secondary merry text-xl mb-2 font-semibold tracking-widest merry"
            >
                {title}
            </h1>
            <hr className="w-1/4 border-brand-secondary font-semibold border-2" />
            <section className="w-[90%] mt-5 flex flex-row flex-nowrap gap-2 justify-center overflow-hidden">

                {processedPeople.map((person, index) => (
                <div key={index} className="w-full lg:w-[32%] bg-background-secondary p-2 flex flex-col items-center rounded-md transition-transform">
                    <img
                    src={testimoniesPath + person.photo}
                    alt={`${person.name} testimony`}
                    className="object-cover object-center w-16 h-16 rounded-full border-background border-solid border-4"
                    />
                        <p className="my-2.5 leading-8 text-center">
                        <em className="text-brand-secondary text-2xl font-black">&ldquo;</em>
                        {person.text}
                        <em className="text-brand-secondary text-2xl font-black">&rdquo;</em>
                    </p>
                    <span>
                        <h2 className="text-lg text-brand font-semibold merry">
                            {person.name}
                        </h2>
                        <small className="text-sm">
                            {person.position} en {person.company}
                        </small>
                    </span>
                </div>
                ))}

            </section>

            {showArrowContainer && (
                <section className="absolute top-[60%] flex w-full justify-between items-center">
                    <button 
                        id="lessThanButton"
                        onClick={handlePrev} 
                        disabled={currentIndex === 0} 
                        className={`${currentIndex === 0 ? 'cursor-not-allowed' : ''} md:ml-1`}
                    >
                        <LessThan width={arrowDimension+"px"} height={arrowDimension + "px"} color={currentIndex === 0 ? "#A9A9AA" : "#0FD862"}/>
                    </button>

                    <button 
                        onClick={handleNext}
                        disabled={currentIndex + itemsToShow >= testimonials.length} 
                        className={`${currentIndex + itemsToShow >= testimonials.length ? 'cursor-not-allowed' : ''} md:ml-1`}
                    >
                        <GreaterThan width={arrowDimension+"px"} height={arrowDimension + "px"} color={currentIndex + itemsToShow >= testimonials.length ? "#A9A9AA" : "#0FD862"}/>
                    </button>
                </section>
            )}
        </section>
    )
}