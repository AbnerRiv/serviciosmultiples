import type { FurnitureCardProps, OnEventData } from '@/components/react/interfaces';
import '@/assets/css/furnitureCard.css'
import { useState } from 'react';

export default function FurnitureCard({ item, isExpanded, onExpandEvent }: FurnitureCardProps) {

    const [imageError, setImageError] = useState<boolean>(false);
    
    const images: string[] = JSON.parse(item.images);

    const toggleExpand = () => {
        onExpandEvent({id: item.id, value: isExpanded} as OnEventData)
    };

    const descriptionSplit = item.description.split('|').map(item => item.trim());

    return(
        <section className={`${
            isExpanded  ? 'md:w-full lg:w-[60%] flex flex-row' : 'md:w-[48%] lg:w-[30%] md:max-h-80 lg:max-h-none justify-end'
          } w-full transition-all duration-300 bg-background-secondary py-2 rounded-md flex flex-col lg:flex-row`}
        >
            <div className={`${isExpanded ? 'pr-2 lg:pr-4' : ''} flex flex-col items-center justify-between w-full px-2`}>
                <img 
                    src={ !imageError ? images[0] : "images/fallbackImageIlustrationSvg.svg"} 
                    alt={`product image`} 
                    className='w-44 h-44 object-fill object-center'
                    onError={(e) => {
                        setImageError(true);
                        e.currentTarget.onerror = null; // Prevent infinite loop in case the fallback also fails
                    }}
                />
                {imageError && (<p className="text-sm text-alert">Could not load image</p>)}
                <h2 className='text-background-footer text-lg font-semibold item-name-overflow webkit-line-clamp-3 lg:webkit-line-clamp-2 px-2 mt-2 tracking-wide source-code-pro leading-5 text-center break-words'
                    title={item.name}
                >{item.name}</h2>
                <div className='flex w-full justify-between gap-x-[10%] mt-2 text-sm lg:text-base'>
                    <button className='bg-[#00a195] text-background rounded p-1'>
                        {item.categoryName}
                    </button>

                    <button className='bg-[#00be85] text-background rounded p-1' onClick={toggleExpand}>
                        { !isExpanded ? 'Expandir' : 'Collapsar'}
                    </button>
                </div>
            </div>
            <div className={`${isExpanded ? 'flex' : 'hidden'} mx-auto w-[96%] lg:w-[70%] border-left-cus border-top-cus mt-2 lg:mt-0 lg:mx-0 pl-1 flex-col items-center justify-center`}>
                    {
                        <ul className='text-background-footer text font-semibold text-sm flex flex-col gap-y-1 py-3 border-bottom-cus w-11/12 lg:w-[96%] text-center max-h-40 lg:max-h-44 overflow-y-auto ul-scrollable'>
                            {descriptionSplit.map((descriptionItem, index) => (
                                <li key={index} className='break-words'>{'>' + descriptionItem}</li>
                            ))}
                        </ul>
                    }
            
                <div className="flex flex-row flex-wrap gap-x-1 mt-2 items-center text-brand-secondary bg-primary rounded-md p-1">
                    <a href={`mailto:administracionproyectos@serviciosmultiples.pro?subject=Consulta%20acerca%20Producto%20Id%3A${encodeURIComponent(item.productId)}%20Nombre%3A${encodeURIComponent(item.name)}`} 
                    className="text-xs lg:text-sm 2xl:text-base break-words lg:font-semibold">Cotiza con nosotros</a>
                </div>
            </div>
        </section>
    )
}