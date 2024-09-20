import { useState, useEffect } from "react";
import type { PaginationProps } from "@/components/react/interfaces";
import '@/assets/css/pagination.css'

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {

    const [paginationNavSize, setPaginationNavSize] = useState<number>(2);
    const [visiblePages, setVisiblePages] = useState<number[]>([]);

    const getVisiblePages = (current: number, total: number) => {
        // Determine start and end of the visible range based on current page and pagination size
        const halfSize = Math.floor(paginationNavSize / 2);
        let start = Math.max(1, current - halfSize);
        let end = Math.min(total, current + halfSize);

        // Adjust start and end if they are constrained by the total number of pages
        if (end - start + 1 < paginationNavSize) {
            if (start === 1) {
                end = Math.min(total, start + paginationNavSize - 1);
            } else if (end === total) {
                start = Math.max(1, end - paginationNavSize + 1);
            }
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    useEffect(() => {
        const pagesToShow = getVisiblePages(currentPage, totalPages);
        setVisiblePages(pagesToShow);
    }, [currentPage, totalPages, paginationNavSize]);


    // Event handler for resize
    const handleResize = () => {
        if(window.innerWidth >= 1024){
            setPaginationNavSize(5);
        }else if(window.innerWidth >= 768){
            setPaginationNavSize(3);
        }else {
            setPaginationNavSize(2)
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

    return (
        <section className="flex justify-center w-full">
            {totalPages > 0 && (
                <div>
                    <div className="flex flex-row flex-nowrap w-full gap-x-1 md:gap-x-1.5 items-center">                       

                        <button
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                            className={`w-3 md:w-4 h-5 md:h-auto text-xs md:text-3xl ${currentPage === 1 ? 'text-secondary' : 'pagination-symbol-shadow'}`}
                        >
                            &laquo;
                        </button>

                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`w-2 md:w-4 h-5 md:h-auto text-xs md:text-2xl ${currentPage === 1 ? 'text-secondary' : 'pagination-symbol-shadow'}`}
                        >
                            &lt;
                        </button>

                        {/* Conditionally render the "..." for the start */}
                        {visiblePages[0] > 1 && (
                            <>
                                <button
                                    onClick={() => onPageChange(1)}
                                    className="w-6 h-5 text-xs text-background bg-secondary"
                                >
                                    1
                                </button>
                                <span className="w-6 h-5 text-xs ">...</span>
                            </>
                        )}

                        {visiblePages.map((item) => (
                            <button
                                key={item}
                                onClick={() => onPageChange(item)}
                                className={`w-6 md:w-9 h-5 md:h-6 text-xs md:text-base ${
                                    item === currentPage ? "bg-primary text-brand font-semibold" : "text-background bg-secondary"
                                }`}
                            >
                                {item}
                            </button>
                        ))}

                        {/* Conditionally render the "..." for the end */}
                        {visiblePages[visiblePages.length - 1] < totalPages && (
                            <>
                                <span className="w-6 h-5 text-xs">...</span>
                                <button
                                    onClick={() => onPageChange(totalPages)}
                                    className="w-6 h-5 text-xs text-background bg-secondary"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`w-2 md:w-4 h-5 md:h-auto text-xs md:text-2xl ${currentPage === totalPages ? 'text-secondary' : 'pagination-symbol-shadow'}`}
                        >
                            &gt;
                        </button>

                        <button
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className={`w-3 md:w-4 h-5 md:h-auto text-xs md:text-3xl ${currentPage === totalPages ? 'text-secondary' : 'pagination-symbol-shadow'}`}
                        >
                            &raquo;
                        </button>                        
                    </div>
                </div>
            )}
        </section>
    );
}